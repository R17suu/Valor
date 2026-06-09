import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateGeminiContent } from "./gemini.ts";

interface ClassifyReportRequest {
  title: string;
  description: string;
  photo_url?: string;
}

interface ClassifyReportResponse {
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  department: string;
  confidence: number;
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

const classificationSchema = {
  type: "object",
  properties: {
    category: {
      type: "string",
      enum: CATEGORIES,
    },
    priority: {
      type: "string",
      enum: PRIORITIES,
    },
    department: {
      type: "string",
      enum: DEPARTMENTS,
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
  },
  required: ["category", "priority", "department", "confidence"],
  additionalProperties: false,
} as const;

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const payload: ClassifyReportRequest = await req.json();
    const { title, description } = payload;

    if (!title || !description) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: title and description",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const response = await generateGeminiContent({
      prompt: `You are an expert city issue classifier for the City Government of Valencia.

Classify the following citizen report.

Allowed categories: ${CATEGORIES.join(", ")}
Allowed departments: ${DEPARTMENTS.join(", ")}
Allowed priority levels: ${PRIORITIES.join(", ")}

Report Title: "${title}"
Report Description: "${description}"

Rules for classification:
- Critical: Immediate safety risk, flooding, public safety emergencies
- High: Major infrastructure damage, service disruptions
- Medium: Moderate issues affecting multiple people
- Low: Minor issues, non-urgent

Return valid JSON only.`,
      imageUrl: payload.photo_url,
      responseMimeType: "application/json",
      responseSchema: classificationSchema,
      maxOutputTokens: 256,
      temperature: 0.2,
    });

    const responseText = response.text;

    if (!responseText) {
      return new Response(
        JSON.stringify({
          error: "Failed to generate classification",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse JSON response
    let classification: ClassifyReportResponse;
    try {
      classification = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini response:", responseText);
      return new Response(
        JSON.stringify({
          error: "Failed to parse AI response",
          details: responseText,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate response
    if (
      !CATEGORIES.includes(classification.category) ||
      !DEPARTMENTS.includes(classification.department) ||
      !PRIORITIES.includes(classification.priority)
    ) {
      return new Response(
        JSON.stringify({
          error: "AI returned invalid classification values",
          received: classification,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(classification), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error in classify-report:", error);
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
