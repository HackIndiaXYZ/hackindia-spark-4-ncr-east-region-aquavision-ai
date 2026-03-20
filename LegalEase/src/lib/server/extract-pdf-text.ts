import pdfParse from "pdf-parse";

function normalizeExtractedText(rawText: string) {
  return rawText
    .replace(/\u0000/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractPdfText(fileBuffer: Buffer) {
  const parsed = await pdfParse(fileBuffer);
  return normalizeExtractedText(parsed.text || "");
}
