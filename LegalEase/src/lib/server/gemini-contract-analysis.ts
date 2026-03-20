import {
  GoogleGenerativeAI,
  SchemaType,
  type ResponseSchema,
} from "@google/generative-ai";

import type { AnalysisResult, RiskCard, RiskLevel } from "@/types/analysis";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const GEMINI_TIMEOUT_MS = 15000;
const MAX_PROMPT_CHARS = 18000;

const analysisResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: "Plain-English summary of the contract's main risk posture.",
    },
    riskScore: {
      type: SchemaType.INTEGER,
      description: "Overall contract risk score from 0 to 100.",
    },
    confidenceScore: {
      type: SchemaType.INTEGER,
      description: "Confidence in the extracted assessment from 0 to 100.",
    },
    risks: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: {
            type: SchemaType.STRING,
          },
          title: {
            type: SchemaType.STRING,
          },
          level: {
            type: SchemaType.STRING,
            enum: ["low", "medium", "high"],
          },
          description: {
            type: SchemaType.STRING,
          },
          consequence: {
            type: SchemaType.STRING,
          },
        },
        required: ["id", "title", "level", "description", "consequence"],
      },
    },
    consequences: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
    },
  },
  required: [
    "summary",
    "riskScore",
    "confidenceScore",
    "risks",
    "consequences",
  ],
} satisfies ResponseSchema;

function clampScore(value: unknown) {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
      ? Number.parseFloat(value)
      : 0;

  return Math.max(0, Math.min(100, Math.round(numericValue || 0)));
}

function normalizeRiskLevel(level: unknown): RiskLevel {
  if (level === "high" || level === "medium" || level === "low") {
    return level;
  }

  return "medium";
}

function createRiskId(title: string, index: number) {
  const baseId = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return baseId || `risk-${index + 1}`;
}

function normalizeRisks(rawRisks: unknown): RiskCard[] {
  if (!Array.isArray(rawRisks)) {
    return [];
  }

  return rawRisks
    .map((risk, index) => {
      if (!risk || typeof risk !== "object") {
        return null;
      }

      const candidate = risk as Partial<RiskCard>;
      const title = candidate.title?.trim() || `Risk ${index + 1}`;
      const description = candidate.description?.trim() || "Review recommended.";
      const consequence =
        candidate.consequence?.trim() || "This clause may create downstream business risk.";

      return {
        id: candidate.id?.trim() || createRiskId(title, index),
        title,
        level: normalizeRiskLevel(candidate.level),
        description,
        consequence,
      };
    })
    .filter((risk): risk is RiskCard => risk !== null)
    .slice(0, 8);
}

function normalizeConsequences(rawConsequences: unknown, risks: RiskCard[]) {
  if (Array.isArray(rawConsequences)) {
    const normalized = rawConsequences
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5);

    if (normalized.length > 0) {
      return normalized;
    }
  }

  return [...new Set(risks.map((risk) => risk.consequence))].slice(0, 5);
}

function normalizeAnalysisPayload(
  documentName: string,
  payload: unknown,
): AnalysisResult {
  const candidate =
    payload && typeof payload === "object"
      ? (payload as Partial<AnalysisResult>)
      : {};
  const risks = normalizeRisks(candidate.risks);
  const consequences = normalizeConsequences(candidate.consequences, risks);

  return {
    documentName,
    summary:
      candidate.summary?.trim() ||
      "The contract was analyzed, but the model returned a limited summary.",
    riskScore: clampScore(candidate.riskScore),
    confidenceScore: clampScore(candidate.confidenceScore),
    risks,
    consequences,
  };
}

function prepareContractExcerpt(contractText: string) {
  const normalizedText = contractText
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return normalizedText.slice(0, MAX_PROMPT_CHARS);
}

export async function analyzeContractTextWithGemini(
  documentName: string,
  contractText: string,
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  if (!contractText.trim()) {
    throw new Error("No contract text was extracted from the PDF.");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({
    model: DEFAULT_MODEL,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
      responseSchema: analysisResponseSchema,
    },
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, GEMINI_TIMEOUT_MS);

  try {
    const excerpt = prepareContractExcerpt(contractText);
    const prompt = `
You are Legal-Ease, an AI contract risk analyzer for hackathon demo use.

Analyze the extracted contract text and return JSON only.
Use the exact schema.
Keep the summary concise and plain-English.
Use conservative scoring.
Do not mention missing context unless it affects confidence.
Do not wrap the JSON in markdown.

Scoring rules:
- riskScore: 0 to 100
- confidenceScore: 0 to 100
- risks: 3 to 6 concise items when possible
- consequences: short real-world business or legal impacts

Document name: ${documentName}

Extracted contract text:
${excerpt}
`.trim();

    const result = await model.generateContent(prompt, {
      timeout: GEMINI_TIMEOUT_MS,
      signal: controller.signal,
    });
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return normalizeAnalysisPayload(documentName, parsed);
  } finally {
    clearTimeout(timeoutId);
  }
}
