import { NextResponse } from "next/server";

import { getDemoAnalysis } from "@/lib/demo-analysis";
import { getGeminiFallbackMessage } from "@/lib/server/gemini-runtime";
import { analyzeContractTextWithGemini } from "@/lib/server/gemini-contract-analysis";
import { extractPdfText } from "@/lib/server/extract-pdf-text";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const privacyMode = formData.get("privacyMode") === "true";

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "PDF file is required." },
      { status: 400 },
    );
  }

  const documentName = file.name || "uploaded-contract.pdf";

  try {
    const fileBytes = await file.arrayBuffer();
    let extractedText = await extractPdfText(Buffer.from(fileBytes));

    if (privacyMode) {
      extractedText = extractedText
        .replace(/\b\d{10}\b/g, "[PHONE]")
        .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL]")
        .replace(/\b\d{11,}\b/g, "[NUMBER]")
        // 1. Mask titles and up to 3 following words (Name)
        .replace(/\b(?:Mr\.?|Mrs\.?|Ms\.?|Dr\.?|Prof\.?|Shri|Smt\.?|Kumari)\s+[A-Za-z.\-]+\s*(?:[A-Za-z.\-]+\s*){0,3}\b/gi, "[NAME]")
        // 2. Identify and mask Legal Entities (e.g., PVT. LTD., LLP, INC)
        .replace(/\b[A-Za-z.\-&]+\s*(?:[A-Za-z.\-&]+\s*){0,4}(?:PVT\.?|PRIVATE|LTD\.?|LIMITED|LLC|INC\.?|CORP\.?|CORPORATION|LLP)\b/gi, "[ENTITY]")
        // 3. Fallback: Identify 2+ consecutive capitalized words OR all-caps words in the middle of a sentence (Names/Locations/Projects like CYBERTHUM)
        .replace(/(?<=[^.?!]\s)[A-Z][A-Za-z\-]+\s+[A-Z][A-Za-z\-]+(?:\s+[A-Z][A-Za-z\-]+)*/g, "[NAME]");
    }

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