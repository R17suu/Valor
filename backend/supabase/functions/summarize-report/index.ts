import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateGeminiContent } from "./gemini.ts";

interface SummarizeReportRequest {
  title: string;
  description: string;
  photo_url?: string;
}

interface SummarizeReportResponse {
  summary: string;
}

serve(async (req: Request) => {
  // Handle CORS
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
    const payload: SummarizeReportRequest = await req.json();
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
      prompt: `You are an expert summarizer for city government issue reports.

Summarize the following citizen report in 2-3 sentences, focusing on the key issue and location details.
The summary should be clear, professional, and actionable for city officials.

Report Title: "${title}"
Report Description: "${description}"

Provide ONLY the summary text, no additional formatting or explanation.`,
      imageUrl: payload.photo_url,
      maxOutputTokens: 256,
      temperature: 0.2,
    });

    const summary = response.text;

    if (!summary || summary.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Failed to generate summary",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        summary: summary.trim(),
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error in summarize-report:", error);
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
