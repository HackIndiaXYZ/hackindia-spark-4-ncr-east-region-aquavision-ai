import type { AnalysisResult } from "@/types/analysis";

type TranslateResponse = {
  ok: boolean;
  mode: "demo" | "live";
  data?: AnalysisResult;
  error?: string;
};

export async function translateDocument(
  analysis: AnalysisResult,
  targetLanguage: "en" | "hi" | "ta" | "te"
) {
  if (targetLanguage === "en") {
    // English is the base language, we don't need to hit the API if the original analysis is already in English.
    // However, to keep it simple, we can either return the original analysis if we cached it or just let the API handle the no-op.
    // The API handles "en", but since we need the *original* english, the caller should ideally just revert to the original state.
    return { data: analysis, mode: "live" as const };
  }

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ analysis, targetLanguage }),
  });

  const payload = (await response.json()) as TranslateResponse;

  if (!response.ok || !payload.ok || !payload.data) {
    throw new Error(payload.error || "Translation failed.");
  }

  return {
    data: payload.data,
    mode: payload.mode,
  };
}
