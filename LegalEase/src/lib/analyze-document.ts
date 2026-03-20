import type { AnalysisResult } from "@/types/analysis";

type AnalyzeResponse = {
  ok: boolean;
  mode: "demo" | "live";
  data?: AnalysisResult;
  error?: string;
};

export async function analyzeDocument(file: File, privacyMode = false) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("privacyMode", privacyMode.toString());

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json()) as AnalyzeResponse;

  if (!response.ok || !payload.ok || !payload.data) {
    throw new Error(payload.error || "Analysis failed.");
  }

  return {
    data: payload.data,
    mode: payload.mode,
  };
}
