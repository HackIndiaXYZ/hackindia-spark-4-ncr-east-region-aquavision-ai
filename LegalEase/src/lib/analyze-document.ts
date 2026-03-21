import type { AnalysisResult } from "@/types/analysis";

type AnalyzeResponse = {
  ok: boolean;
  mode: "demo" | "live";
  data?: AnalysisResult;
  error?: string;
};

export async function analyzeDocument(file: File, privacyMode = false) {
  // Vercel Hobby tier has a strict 4.5MB request body limit.
  // We check this before uploading to avoid the 413 Payload Too Large crash.
  const MAX_FILE_SIZE = 4.5 * 1024 * 1024; // 4.5 MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). The maximum allowed size is 4.5MB due to server limits.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("privacyMode", privacyMode.toString());

  const response = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (response.status === 413) {
    throw new Error("File is too large. The server rejected the upload.");
  }

  // If Vercel throws a 504 Gateway Timeout or similar html error, handle it safely
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Non-JSON response from server:", text);
    throw new Error(`Server returned an unexpected error (${response.status}). Please try again.`);
  }

  const payload = (await response.json()) as AnalyzeResponse;

  if (!response.ok || !payload.ok || !payload.data) {
    throw new Error(payload.error || "Analysis failed.");
  }

  return {
    data: payload.data,
    mode: payload.mode,
  };
}
