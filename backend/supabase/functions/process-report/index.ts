import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface ProcessReportRequest {
  report_id: string;
}

interface ProcessReportResponse {
  success: boolean;
  report_id: string;
  incident_id: string;
  incident_created: boolean;
  classification: {
    category: string;
    priority: string;
    department: string;
  };
  summary: string;
  duplicate_match?: {
    incident_id: string;
    distance_meters: number;
  };
}

interface DepartmentLookup {
  id: string;
  name: string;
}

// Helper function to call Edge Function
async function callEdgeFunction(
  functionName: string,
  payload: Record<string, unknown>,
  supabaseUrl: string,
  supabaseAnonKey: string
): Promise<unknown> {
  const response = await fetch(
    `${supabaseUrl}/functions/v1/${functionName}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${functionName} failed: ${error}`);
  }

  return response.json();
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const payload: ProcessReportRequest = await req.json();
    const { report_id } = payload;

    if (!report_id) {
      return new Response(
        JSON.stringify({ error: "Missing required field: report_id" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase clients
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 1: Fetch the report
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*")
      .eq("id", report_id)
      .single();

    if (reportError || !report) {
      console.error("Report not found:", reportError);
      return new Response(
        JSON.stringify({ error: "Report not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Processing report:", report_id);

    const reportPhotoUrl = report.photo_url || null;

    let finalCategory = report.category || "";
    let finalPriority = report.priority || "";
    let finalDepartmentId = report.department_id || "";
    let finalDepartmentName = "";

    // Step 2: Classify the report only if the citizen has not already chosen values
    if (!finalCategory || !finalPriority || !finalDepartmentId) {
      console.log("Classifying report...");
      const classification = await callEdgeFunction(
        "classify-report",
        {
          title: report.title,
          description: report.description,
          photo_url: reportPhotoUrl,
        },
        supabaseUrl,
        supabaseAnonKey
      );

      const classified = classification as Record<string, unknown>;
      finalCategory = finalCategory || String(classified.category || "");
      finalPriority = finalPriority || String(classified.priority || "");

      if (!finalDepartmentId) {
        const { data: department } = await supabase
          .from("departments")
          .select("id, name")
          .eq("name", String(classified.department || ""))
          .single();

        const departmentRecord = department as DepartmentLookup | null;
        finalDepartmentId = departmentRecord?.id || "";
        finalDepartmentName =
          departmentRecord?.name || String(classified.department || "");
      }
    }

    if (finalDepartmentId && !finalDepartmentName) {
      const { data: department } = await supabase
        .from("departments")
        .select("id, name")
        .eq("id", finalDepartmentId)
        .single();

      const departmentRecord = department as DepartmentLookup | null;
      finalDepartmentName = departmentRecord?.name || "";
    }

    if (!finalCategory || !finalPriority || !finalDepartmentId) {
      throw new Error("Failed to determine category, priority, or department");
    }

    // Step 3: Summarize the report only if the citizen has not already edited a summary
    let finalSummary = report.ai_summary || "";

    if (!finalSummary) {
      console.log("Summarizing report...");
      const summaryResponse = await callEdgeFunction(
        "summarize-report",
        {
          title: report.title,
          description: report.description,
          photo_url: reportPhotoUrl,
        },
        supabaseUrl,
        supabaseAnonKey
      );

      finalSummary = String(
        (summaryResponse as Record<string, unknown>).summary || ""
      );
    }

    // Step 4: Detect duplicates
    console.log("Detecting duplicates...");
    const duplicateResponse = await callEdgeFunction(
      "detect-duplicate",
      {
        latitude: report.latitude,
        longitude: report.longitude,
        category: finalCategory,
      },
      supabaseUrl,
      supabaseAnonKey
    );

    const isDuplicate = (duplicateResponse as Record<string, unknown>)
      .duplicate_found;
    const duplicateIncidentId = (duplicateResponse as Record<string, unknown>)
      .incident_id;

    // Get barangay by coordinates (closest one)
    const { data: barangays } = await supabase
      .from("barangays")
      .select("id")
      .order("id", { ascending: true })
      .limit(1);

    // Step 5: Update report with classification and summary
    const { error: updateError } = await supabase
      .from("reports")
      .update({
        category: finalCategory,
        priority: finalPriority,
        department_id: finalDepartmentId,
        ai_summary: finalSummary,
        barangay_id: barangays?.[0]?.id || null,
        status: "assigned",
      })
      .eq("id", report_id);

    if (updateError) {
      console.error("Error updating report:", updateError);
      throw new Error(`Failed to update report: ${updateError.message}`);
    }

    let incidentId: string;
    let incidentCreated = false;

    if (isDuplicate && duplicateIncidentId) {
      // Step 6a: Attach to existing incident
      console.log("Attaching to existing incident:", duplicateIncidentId);

      const { error: attachError } = await supabase
        .from("reports")
        .update({
          incident_id: duplicateIncidentId,
        })
        .eq("id", report_id);

      if (attachError) {
        throw new Error(`Failed to attach to incident: ${attachError.message}`);
      }

      // Increment report count
      const { data: incident } = await supabase
        .from("incidents")
        .select("report_count")
        .eq("id", duplicateIncidentId)
        .single();

      await supabase
        .from("incidents")
        .update({
          report_count: (incident?.report_count || 1) + 1,
        })
        .eq("id", duplicateIncidentId);

      incidentId = duplicateIncidentId;
    } else {
      // Step 6b: Create new incident
      console.log("Creating new incident");

      const { data: newIncident, error: createError } = await supabase
        .from("incidents")
        .insert({
          category: finalCategory,
          priority: finalPriority,
          department_id: finalDepartmentId,
          latitude: report.latitude,
          longitude: report.longitude,
          status: "open",
          report_count: 1,
          barangay_id: barangays?.[0]?.id || null,
        })
        .select()
        .single();

      if (createError || !newIncident) {
        throw new Error(`Failed to create incident: ${createError?.message}`);
      }

      incidentId = newIncident.id;
      incidentCreated = true;

      // Link report to new incident
      const { error: linkError } = await supabase
        .from("reports")
        .update({
          incident_id: incidentId,
        })
        .eq("id", report_id);

      if (linkError) {
        throw new Error(`Failed to link report: ${linkError.message}`);
      }
    }

    console.log("Report processing complete");

    return new Response(
      JSON.stringify({
        success: true,
        report_id,
        incident_id: incidentId,
        incident_created: incidentCreated,
        classification: {
          category: finalCategory,
          priority: finalPriority,
          department: finalDepartmentName || String(finalDepartmentId),
        },
        summary: finalSummary,
        ...(isDuplicate && {
          duplicate_match: {
            incident_id: duplicateIncidentId,
            distance_meters: (duplicateResponse as Record<string, unknown>)
              .distance_meters,
          },
        }),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error in process-report:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
