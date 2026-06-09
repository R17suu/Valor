import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateGeminiContent } from "./gemini.ts";

interface DraftReportRequest {
  photo_url: string;
  title?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

interface DraftReportResponse {
  suggested_title: string;
  description: string;
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  department: string;
  confidence: number;
  summary: string;
}

const CATEGORIES = [
  "Potholes",
  "Road Damage",
  "Flooding",
  "Illegal Dumping",
  "Garbage Accumulation",
  "Broken Streetlights",
  "Fallen Trees",
  "Water Service Issues",
  "Public Safety Concerns",
];

const DEPARTMENTS = [
  "Engineering Office",
  "CENRO (City Environment and Natural Resources Office)",
  "Disaster Risk Reduction Office",
  "Water District",
  "Public Safety Office",
];

const PRIORITIES = ["critical", "high", "medium", "low"];

const draftSchema = {
  type: "object",
  properties: {
    suggested_title: { type: "string" },
    description: { type: "string" },
    category: { type: "string", enum: CATEGORIES },
    priority: { type: "string", enum: PRIORITIES },
    department: { type: "string", enum: DEPARTMENTS },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    summary: { type: "string" },
  },
  required: [
    "suggested_title",
    "description",
    "category",
    "priority",
    "department",
    "confidence",
    "summary",
  ],
  additionalProperties: false,
} as const;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const payload: DraftReportRequest = await req.json();
    const { photo_url, title, description, latitude, longitude } = payload;

    if (!photo_url) {
      return new Response(
        JSON.stringify({ error: "Missing required field: photo_url" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const prompt = `You are helping a citizen prepare a city issue report draft.

Analyze the attached photo and provide a review-friendly draft that the citizen can edit before submitting.

If context is provided, use it to improve accuracy:
- Existing title: ${title ? `"${title}"` : "none"}
- Existing description: ${description ? `"${description}"` : "none"}
- Location hint latitude: ${latitude ?? "unknown"}
- Location hint longitude: ${longitude ?? "unknown"}

Return valid JSON only with:
- suggested_title: a short, specific title
- description: 2-4 clear sentences describing what is visible in the photo and the likely issue
- category: one of these categories: ${CATEGORIES.join(", ")}
- priority: one of these priorities: ${PRIORITIES.join(", ")}
- department: one of these departments: ${DEPARTMENTS.join(", ")}
- confidence: a number from 0 to 1
- summary: a concise summary for city staff

Rules:
- Be factual and avoid overclaiming if the image is unclear.
- Make the description easy for a citizen to review and edit.
- Prefer the most likely category and department based on visible evidence.
- If the image shows a safety risk or flooding, raise priority accordingly.
- Do not include markdown or extra text.`;

    const response = await generateGeminiContent({
      prompt,
      imageUrl: photo_url,
      responseMimeType: "application/json",
      responseSchema: draftSchema,
      maxOutputTokens: 768,
      temperature: 0.2,
    });

    let draft: DraftReportResponse;

    try {
      draft = JSON.parse(response.text);
    } catch (error) {
      console.error("Failed to parse Gemini draft response:", response.text);
      return new Response(
        JSON.stringify({
          error: "Failed to parse AI response",
          details: response.text,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(draft), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in draft-report:", error);
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
