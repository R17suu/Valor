import { GoogleGenAI } from "npm:@google/genai";

type GeminiGenerateOptions = {
  prompt: string;
  imageUrl?: string;
  responseSchema?: Record<string, unknown>;
  responseMimeType?: string;
  maxOutputTokens?: number;
  temperature?: number;
};

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash-lite";

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRetryableStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;

  const candidate = error as {
    status?: number;
    code?: number;
    response?: { status?: number };
  };

  return candidate.status ?? candidate.code ?? candidate.response?.status;
}

function isRetryableGeminiError(error: unknown): boolean {
  const status = getRetryableStatus(error);
  const message = error instanceof Error ? error.message : String(error);

  return (
    status === 429 ||
    status === 500 ||
    status === 503 ||
    status === 504 ||
    /RESOURCE_EXHAUSTED|UNAVAILABLE|INTERNAL|DEADLINE_EXCEEDED/i.test(message)
  );
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary);
}

async function fetchImageData(imageUrl: string): Promise<{
  mimeType: string;
  data: string;
}> {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch image: ${response.status} ${response.statusText}`
    );
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const mimeType = contentType.split(";")[0].trim();

  if (!mimeType.startsWith("image/")) {
    throw new Error(`URL did not return an image. Received: ${mimeType}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());

  return {
    mimeType,
    data: bytesToBase64(bytes),
  };
}

export async function generateGeminiContent(
  options: GeminiGenerateOptions
): Promise<{
  text: string;
}> {
  const contents = options.imageUrl
    ? [
        {
          text: options.prompt,
        },
        {
          inlineData: await fetchImageData(options.imageUrl),
        },
      ]
    : options.prompt;

  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config: {
          temperature: options.temperature ?? 0.2,
          maxOutputTokens: options.maxOutputTokens ?? 512,
          ...(options.responseMimeType
            ? {
                responseMimeType: options.responseMimeType,
              }
            : {}),
          ...(options.responseSchema
            ? {
                responseSchema: options.responseSchema,
              }
            : {}),
        },
      });

      const text = (response.text || "").trim();

      if (!text) {
        throw new Error("Gemini returned an empty response");
      }

      return { text };
    } catch (error) {
      lastError = error;

      if (attempt < 2 && isRetryableGeminiError(error)) {
        const delayMs = 500 * Math.pow(2, attempt);
        await sleep(delayMs);
        continue;
      }

      throw error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(String(lastError));
}
