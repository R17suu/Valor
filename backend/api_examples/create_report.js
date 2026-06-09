/**
 * VALOR Backend - Citizen Photo Draft + Final Submit Example
 *
 * Flow:
 * 1. Citizen uploads a photo.
 * 2. AI drafts title, description, category, priority, and department.
 * 3. Citizen edits the AI draft.
 * 4. Citizen clicks Submit.
 * 5. Backend processes the final report and groups it into an incident.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function callApi(path, method, body) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`${path} failed: ${await response.text()}`);
  }

  return response.json();
}

async function resolveDepartmentId(departmentName) {
  const result = await callApi(
    `/rest/v1/departments?select=id,name&name=eq.${encodeURIComponent(departmentName)}`,
    "GET"
  );

  return result?.[0]?.id || null;
}

async function generateDraftFromPhoto(draftInput) {
  return callApi("/functions/v1/draft-report", "POST", draftInput);
}

async function createAndProcessReport(reportData) {
  const createPayload = {
    title: reportData.title,
    description: reportData.description,
    latitude: reportData.latitude,
    longitude: reportData.longitude,
    contact_name: reportData.contactName,
    contact_number: reportData.contactNumber,
    contact_email: reportData.contactEmail,
    photo_url: reportData.photoUrl || null,
    category: reportData.category || null,
    priority: reportData.priority || null,
    department_id: reportData.departmentId || null,
    ai_summary: reportData.aiSummary || null,
    status: "submitted",
  };

  console.log("Creating report...");
  const report = await callApi("/rest/v1/reports", "POST", createPayload);
  console.log("Report created:", report.id);

  console.log("Processing report...");
  const processed = await callApi("/functions/v1/process-report", "POST", {
    report_id: report.id,
  });

  console.log("Report processed");
  console.log("  Category:", processed.classification.category);
  console.log("  Priority:", processed.classification.priority);
  console.log("  Department:", processed.classification.department);
  console.log("  Summary:", processed.summary);

  return {
    report: { ...report, ...processed },
  };
}

async function main() {
  const uploadedPhotoUrl =
    "https://storage.supabase.co/reports-images/pothole-001.jpg";

  const draft = await generateDraftFromPhoto({
    photo_url: uploadedPhotoUrl,
    latitude: 8.2456,
    longitude: 125.1234,
  });

  console.log("AI draft:", draft);

  // Simulate citizen review and manual edits.
  const reviewedDraft = {
    title: draft.suggested_title,
    description: `${draft.description} Citizen note: the damaged section is near the public market entrance.`,
    category: draft.category,
    priority: draft.priority,
    departmentId: await resolveDepartmentId(draft.department),
    aiSummary: draft.summary,
    latitude: 8.2456,
    longitude: 125.1234,
    contactName: "Juan Dela Cruz",
    contactNumber: "+63917234567",
    contactEmail: "juan@example.com",
    photoUrl: uploadedPhotoUrl,
  };

  try {
    const result = await createAndProcessReport(reviewedDraft);
    console.log("\nReport creation complete!");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Failed to create report:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  createAndProcessReport,
  generateDraftFromPhoto,
  resolveDepartmentId,
};
