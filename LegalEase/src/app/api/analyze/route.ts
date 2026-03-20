import { NextResponse } from "next/server";

import { getDemoAnalysis } from "@/lib/demo-analysis";
import { getGeminiFallbackMessage } from "@/lib/server/gemini-runtime";
import { analyzeContractTextWithGemini } from "@/lib/server/gemini-contract-analysis";
import { extractPdfText } from "@/lib/server/extract-pdf-text";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "PDF file is required." },
      { status: 400 },
    );
  }

  const documentName = file.name || "uploaded-contract.pdf";

  try {
    const fileBytes = await file.arrayBuffer();
    const extractedText = await extractPdfText(Buffer.from(fileBytes));
    const analysis = await analyzeContractTextWithGemini(
      documentName,
      extractedText,
    );

    return NextResponse.json({
      ok: true,
      mode: "live",
      data: analysis,
    });
  } catch (error) {
    const fallbackReason = getGeminiFallbackMessage(error, "analysis");
    console.warn(fallbackReason);

    return NextResponse.json({
      ok: true,
      mode: "demo",
      data: getDemoAnalysis(documentName),
      fallbackReason,
    });
  }
}