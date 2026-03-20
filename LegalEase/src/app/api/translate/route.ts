import { NextResponse } from "next/server";

import { getGeminiFallbackMessage } from "@/lib/server/gemini-runtime";
import { getDemoTranslation, translateAnalysisWithGemini } from "@/lib/server/gemini-translate";
import type { AnalysisResult } from "@/types/analysis";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { analysis, targetLanguage } = body as {
      analysis: AnalysisResult;
      targetLanguage: string;
    };

    if (!analysis || !targetLanguage) {
      return NextResponse.json(
        { ok: false, error: "Analysis data and targetLanguage are required." },
        { status: 400 },
      );
    }

    if (targetLanguage === "en") {
      return NextResponse.json({
        ok: true,
        data: analysis,
        mode: "live",
      });
    }

    if (!["hi", "ta", "te"].includes(targetLanguage)) {
      return NextResponse.json(
        { ok: false, error: "Unsupported target language." },
        { status: 400 },
      );
    }

    try {
      const translated = await translateAnalysisWithGemini(
        analysis,
        targetLanguage as "hi" | "ta" | "te",
      );

      return NextResponse.json({
        ok: true,
        mode: "live",
        data: translated,
      });
    } catch (error) {
      const fallbackReason = getGeminiFallbackMessage(error, "translation");
      console.warn(fallbackReason);

      return NextResponse.json({
        ok: true,
        mode: "demo",
        data: getDemoTranslation(
          analysis,
          targetLanguage as "hi" | "ta" | "te",
        ),
        fallbackReason,
      });
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }
}