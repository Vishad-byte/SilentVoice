// /api/suggest-messages/route.ts
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const runtime = "edge";

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Use Gemini 2.0 models (1.5 models are deprecated)
    // Try gemini-2.0-flash (stable) or gemini-2.0-flash-lite (free tier friendly)
    const modelName = "gemini-2.0-flash"; 
    console.log("Using model:", modelName);
    const model = google(modelName);

    const result = streamText({
      model,
      prompt,
      maxOutputTokens: 200,
    });

    // useCompletion with streamProtocol='data' expects UI message stream response
    return result.toUIMessageStreamResponse();
  } catch (err: unknown) {
    console.error("Gemini Error:", err);
    console.error("Error details:", JSON.stringify(err, null, 2));
    
    // Check for quota/quota errors
    const error = err instanceof Error ? err : new Error(String(err));
    const errorMessage = error.message ?? "Unexpected error";
    const isQuotaError = errorMessage.includes("quota") || 
                        errorMessage.includes("Quota exceeded") ||
                        errorMessage.includes("rate limit");
    
    // Return error in a format that useCompletion can handle
    return new Response(
      JSON.stringify({ 
        error: isQuotaError 
          ? "Free tier quota exceeded. Please check your Google AI Studio billing settings or wait before retrying."
          : errorMessage,
        details: error.cause instanceof Error ? error.cause.message : error.stack,
        isQuotaError
      }),
      {
        status: isQuotaError ? 429 : 500,
        headers: { 
          "Content-Type": "application/json",
          "X-Error": "true"
        },
      }
    );
  }
}
