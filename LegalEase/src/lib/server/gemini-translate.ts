import type { AnalysisResult } from "@/types/analysis";

import { withGeminiModelFallback } from "@/lib/server/gemini-runtime";

export async function translateAnalysisWithGemini(
  analysis: AnalysisResult,
  targetLanguage: "hi" | "ta" | "te",
): Promise<AnalysisResult> {
  const languageMap = {
    hi: "Hindi",
    ta: "Tamil",
    te: "Telugu",
  };

  const targetLangName = languageMap[targetLanguage];
  const payloadStr = JSON.stringify(analysis, null, 2);
  const prompt = `
You are an expert legal translator. Translate the following contract analysis JSON from English to ${targetLangName}.

STRICT RULES:
1. ONLY translate the string values. DO NOT translate the JSON keys (e.g., keep "documentName", "summary", "riskScore", "confidenceScore", "risks", "id", "title", "level", "description", "consequence", "consequences").
2. DO NOT change the "level" values ("low", "medium", "high"). Keep them in English.
3. Keep legal terminology accurate and professional in ${targetLangName}.
4. Return ONLY the translated JSON matching the exact original structure. No markdown wrapping.

Original JSON:
${payloadStr}
`.trim();

  return withGeminiModelFallback("translation", async (client, modelName) => {
    const model = client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text().trim());

    if (!parsed.summary || !Array.isArray(parsed.risks)) {
      throw new Error("Translation returned invalid shape.");
    }

    return parsed as AnalysisResult;
  });
}
// Fallback logic for demo
const demoHindiTranslation: AnalysisResult = {
  documentName: "service-agreement.pdf",
  summary: "à¤‡à¤¸ à¤¸à¥‡à¤µà¤¾ à¤¸à¤®à¤à¥Œà¤¤à¥‡ à¤®à¥‡à¤‚ à¤µà¥à¤¯à¤¾à¤ªà¤• à¤•à¥à¤·à¤¤à¤¿à¤ªà¥‚à¤°à¥à¤¤à¤¿ à¤¦à¤¾à¤¯à¤¿à¤¤à¥à¤µ, à¤¸à¥à¤µà¤¤à¤ƒ-à¤¨à¤µà¥€à¤¨à¥€à¤•à¤°à¤£ à¤µà¥à¤¯à¤µà¤¹à¤¾à¤°, à¤”à¤° à¤ªà¥à¤°à¤¦à¤¾à¤¤à¤¾ à¤•à¥‡ à¤ªà¤•à¥à¤· à¤®à¥‡à¤‚ à¤¸à¤®à¤¾à¤ªà¥à¤¤à¤¿ à¤•à¥€ à¤­à¤¾à¤·à¤¾ à¤¶à¤¾à¤®à¤¿à¤² à¤¹à¥ˆà¥¤",
  riskScore: 78,
  confidenceScore: 91,
  risks: [
    {
      id: "liability-1",
      title: "à¤…à¤¸à¤®à¤®à¤¿à¤¤ à¤¦à¤¾à¤¯à¤¿à¤¤à¥à¤µ à¤¶à¤°à¥à¤¤à¥‡à¤‚",
      level: "high",
      description: "à¤†à¤ªà¤•à¤¾ à¤œà¥‹à¤–à¤¿à¤® à¤ªà¥à¤°à¤¦à¤¾à¤¤à¤¾ à¤•à¥€ à¤¦à¥‡à¤¯à¤¤à¤¾ à¤¸à¥€à¤®à¤¾ à¤¸à¥‡ à¤…à¤§à¤¿à¤• à¤µà¥à¤¯à¤¾à¤ªà¤• à¤ªà¥à¤°à¤¤à¥€à¤¤ à¤¹à¥‹à¤¤à¤¾ à¤¹à¥ˆ, à¤œà¥‹ à¤œà¥‹à¤–à¤¿à¤® à¤•à¤¾ à¤…à¤¸à¤®à¤¾à¤¨ à¤†à¤µà¤‚à¤Ÿà¤¨ à¤¬à¤¨à¤¾à¤¤à¤¾ à¤¹à¥ˆà¥¤",
      consequence: "à¤•à¥‹à¤ˆ à¤­à¥€ à¤µà¤¿à¤µà¤¾à¤¦ à¤†à¤ªà¤•à¥‹ à¤‰à¤¨ à¤¨à¥à¤•à¤¸à¤¾à¤¨à¥‹à¤‚ à¤•à¥‹ à¤•à¤µà¤° à¤•à¤°à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤›à¥‹à¤¡à¤¼ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆ à¤œà¤¿à¤¨à¥à¤¹à¥‡à¤‚ à¤¦à¥‚à¤¸à¤°à¥‡ à¤ªà¤•à¥à¤· à¤¨à¥‡ à¤¸à¤‚à¤µà¤¿à¤¦à¤¾à¤¤à¥à¤®à¤• à¤°à¥‚à¤ª à¤¸à¥‡ à¤…à¤ªà¤¨à¥‡ à¤²à¤¿à¤ à¤¸à¥€à¤®à¤¿à¤¤ à¤•à¤° à¤²à¤¿à¤¯à¤¾ à¤¹à¥ˆà¥¤",
    },
    {
      id: "term-1",
      title: "à¤²à¤˜à¥ à¤¸à¤®à¤¾à¤ªà¥à¤¤à¤¿ à¤¸à¥‚à¤šà¤¨à¤¾ à¤…à¤µà¤§à¤¿",
      level: "medium",
      description: "à¤¸à¤®à¤à¥Œà¤¤à¤¾ à¤à¤• à¤›à¥‹à¤Ÿà¥€ à¤¸à¥‚à¤šà¤¨à¤¾ à¤µà¤¿à¤‚à¤¡à¥‹ à¤•à¥€ à¤…à¤¨à¥à¤®à¤¤à¤¿ à¤¦à¥‡à¤¤à¤¾ à¤¹à¥ˆ à¤œà¥‹ à¤¸à¥à¤°à¤•à¥à¤·à¤¿à¤¤ à¤¸à¤‚à¤•à¥à¤°à¤®à¤£ à¤•à¥‡ à¤²à¤¿à¤ à¤ªà¤°à¥à¤¯à¤¾à¤ªà¥à¤¤ à¤¸à¤®à¤¯ à¤¨à¤¹à¥€à¤‚ à¤¦à¥‡ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆà¥¤",
      consequence: "à¤¯à¤¦à¤¿ à¤†à¤ªà¤•à¥‡ à¤ªà¤¾à¤¸ à¤ªà¥à¤°à¤¤à¤¿à¤¸à¥à¤¥à¤¾à¤ªà¤¨ à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤¸à¥à¤¥à¤¾à¤ªà¤¿à¤¤ à¤¹à¥‹à¤¨à¥‡ à¤¸à¥‡ à¤ªà¤¹à¤²à¥‡ à¤…à¤¨à¥à¤¬à¤‚à¤§ à¤¸à¤®à¤¾à¤ªà¥à¤¤ à¤¹à¥‹ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆ à¤¤à¥‹ à¤¸à¤‚à¤šà¤¾à¤²à¤¨ à¤¬à¤¾à¤§à¤¿à¤¤ à¤¹à¥‹ à¤¸à¤•à¤¤à¤¾ à¤¹à¥ˆà¥¤",
    },
    {
      id: "payment-1",
      title: "à¤‰à¤šà¥à¤š à¤µà¤¿à¤²à¤‚à¤¬ à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤¬à¥à¤¯à¤¾à¤œ",
      level: "medium",
      description: "à¤µà¤¿à¤²à¤‚à¤¬-à¤¶à¥à¤²à¥à¤• à¤–à¤‚à¤¡ à¤à¤• à¤®à¤¾à¤¸à¤¿à¤• à¤¬à¥à¤¯à¤¾à¤œ à¤¦à¤° à¤²à¤¾à¤—à¥‚ à¤•à¤°à¤¤à¤¾ à¤¹à¥ˆ à¤œà¥‹ à¤•à¤¿ à¤•à¤ˆ à¤µà¤¾à¤£à¤¿à¤œà¥à¤¯à¤¿à¤• à¤¸à¤®à¤à¥Œà¤¤à¥‹à¤‚ à¤•à¥‡ à¤‰à¤ªà¤¯à¥‹à¤— à¤¸à¥‡ à¤…à¤§à¤¿à¤• à¤¹à¥ˆà¥¤",
      consequence: "à¤µà¤¿à¤²à¤‚à¤¬à¤¿à¤¤ à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤¥à¥‹à¤¡à¤¼à¥‡ à¤¹à¥€ à¤¸à¤®à¤¯ à¤®à¥‡à¤‚ à¤­à¥Œà¤¤à¤¿à¤• à¤°à¥‚à¤ª à¤¸à¥‡ à¤‰à¤šà¥à¤š à¤²à¤¾à¤—à¤¤ à¤®à¥‡à¤‚ à¤¤à¤¬à¥à¤¦à¥€à¤² à¤¹à¥‹ à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤",
    },
    {
      id: "ip-1",
      title: "à¤…à¤¸à¥à¤ªà¤·à¥à¤Ÿ à¤¬à¥Œà¤¦à¥à¤§à¤¿à¤• à¤¸à¤‚à¤ªà¤¦à¤¾ à¤¸à¥à¤µà¤¾à¤®à¤¿à¤¤à¥à¤µ",
      level: "low",
      description: "à¤…à¤¨à¥à¤¬à¤‚à¤§ à¤‡à¤¸ à¤¬à¤¾à¤¤ à¤ªà¤° à¤…à¤¸à¤¹à¤®à¤¤à¤¿ à¤•à¥€ à¤—à¥à¤‚à¤œà¤¾à¤‡à¤¶ à¤›à¥‹à¤¡à¤¼à¤¤à¤¾ à¤¹à¥ˆ à¤•à¤¿ à¤•à¥à¤¯à¤¾ à¤ªà¥‚à¤°à¥à¤µ-à¤®à¥Œà¤œà¥‚à¤¦ à¤¸à¤¾à¤®à¤—à¥à¤°à¥€ à¤¬à¤¨à¤¾à¤® à¤¡à¤¿à¤²à¥€à¤µà¤°à¥‡à¤¬à¤²à¥à¤¸ à¤•à¥‡ à¤°à¥‚à¤ª à¤®à¥‡à¤‚ à¤—à¤¿à¤¨à¤¾ à¤œà¤¾à¤¤à¤¾ à¤¹à¥ˆà¥¤",
      consequence: "à¤¸à¥à¤µà¤¾à¤®à¤¿à¤¤à¥à¤µ à¤µà¤¿à¤µà¤¾à¤¦ à¤‰à¤¤à¥à¤ªà¤¾à¤¦ à¤µà¤¿à¤¤à¤°à¤£ à¤®à¥‡à¤‚ à¤¦à¥‡à¤°à¥€ à¤•à¤° à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚ à¤”à¤° à¤­à¤µà¤¿à¤·à¥à¤¯ à¤®à¥‡à¤‚ à¤•à¤¾à¤® à¤•à¥‡ à¤‰à¤¤à¥à¤ªà¤¾à¤¦ à¤•à¥‡ à¤ªà¥à¤¨: à¤‰à¤ªà¤¯à¥‹à¤— à¤•à¥‹ à¤œà¤Ÿà¤¿à¤² à¤¬à¤¨à¤¾ à¤¸à¤•à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤",
    },
  ],
  consequences: [
    "à¤µà¤¿à¤µà¤¾à¤¦ à¤®à¥‡à¤‚ à¤…à¤ªà¥à¤°à¤¤à¥à¤¯à¤¾à¤¶à¤¿à¤¤ à¤•à¤¾à¤¨à¥‚à¤¨à¥€ à¤¦à¤¾à¤¯à¤¿à¤¤à¥à¤µ",
    "à¤¤à¥‡à¤œà¥€ à¤¸à¥‡ à¤¨à¤¿à¤•à¤¾à¤¸ à¤¸à¤®à¤¯à¤°à¥‡à¤–à¤¾ à¤¸à¥‡ à¤ªà¤°à¤¿à¤šà¤¾à¤²à¤¨ à¤µà¥à¤¯à¤µà¤§à¤¾à¤¨",
    "à¤œà¥à¤°à¥à¤®à¤¾à¤¨à¤¾-à¤¶à¥ˆà¤²à¥€ à¤­à¥à¤—à¤¤à¤¾à¤¨ à¤–à¤‚à¤¡à¥‹à¤‚ à¤¸à¥‡ à¤‰à¤šà¥à¤š à¤µà¤¿à¤¤à¥à¤¤à¥€à¤¯ à¤œà¥‹à¤–à¤¿à¤®",
  ],
};

export function getDemoTranslation(analysis: AnalysisResult, targetLanguage: "hi" | "ta" | "te"): AnalysisResult {
  if (targetLanguage === "hi") {
    // Return hindi translation but keep the user's risk scores and document name just in case they're different
    return {
      ...demoHindiTranslation,
      documentName: analysis.documentName,
      riskScore: analysis.riskScore,
      confidenceScore: analysis.confidenceScore,
    };
  }
  
  // If no demo translation exists for the specific language, just return original to prevent crashing
  return analysis;
}
