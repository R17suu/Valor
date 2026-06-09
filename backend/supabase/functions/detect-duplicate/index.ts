import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface DetectDuplicateRequest {
  latitude: number;
  longitude: number;
  category: string;
}

interface DetectDuplicateResponse {
  duplicate_found: boolean;
  incident_id?: string;
  distance_meters?: number;
  existing_incident_count?: number;
}

// Earth's radius in meters
const EARTH_RADIUS = 6371000;

// Haversine formula to calculate distance between two coordinates
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dlat = toRad(lat2 - lat1);
  const dlon = toRad(lon2 - lon1);

  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dlon / 2) *
      Math.sin(dlon / 2);

  const c = 2 * Math.asin(Math.sqrt(a));
  return EARTH_RADIUS * c;
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
    const payload: DetectDuplicateRequest = await req.json();
    const { latitude, longitude, category } = payload;

    if (!latitude || !longitude || !category) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: latitude, longitude, category",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return new Response(
        JSON.stringify({
          error: "Invalid coordinates",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Find unresolved incidents of the same category within 100 meters
    const { data: incidents, error: queryError } = await supabase
      .from("incidents")
      .select("id, latitude, longitude, report_count")
      .eq("category", category)
      .neq("status", "resolved")
      .neq("status", "closed");

    if (queryError) {
      console.error("Database query error:", queryError);
      return new Response(
        JSON.stringify({
          error: "Database error",
          details: queryError.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!incidents || incidents.length === 0) {
      return new Response(
        JSON.stringify({
          duplicate_found: false,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Find incidents within 100 meters
    const DUPLICATE_THRESHOLD = 100; // meters

    for (const incident of incidents) {
      const distance = haversineDistance(
        latitude,
        longitude,
        incident.latitude,
        incident.longitude
      );

      if (distance <= DUPLICATE_THRESHOLD) {
        // Duplicate found
        return new Response(
          JSON.stringify({
            duplicate_found: true,
            incident_id: incident.id,
            distance_meters: Math.round(distance),
            existing_incident_count: incident.report_count,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    // No duplicate found
    return new Response(
      JSON.stringify({
        duplicate_found: false,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error in detect-duplicate:", error);
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
