import {
  SchemaType,
  type ResponseSchema,
} from "@google/generative-ai";

import { withGeminiModelFallback } from "@/lib/server/gemini-runtime";
import type { AnalysisResult, RiskCard, RiskLevel } from "@/types/analysis";

const GEMINI_TIMEOUT_MS = 30_000;
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
  if (!contractText.trim()) {
    throw new Error("No contract text was extracted from the PDF.");
  }

  const excerpt = prepareContractExcerpt(contractText);
  const prompt = `
You are Legal-Ease, an AI contract risk analyzer built for everyday Indian users.

GOAL: Make the entire analysis understandable for a normal non-technical person (8th-grade reading level).

Analyze the extracted contract text and return JSON only. Use the exact schema provided.
Do not wrap the JSON in markdown.

Language & Tone Rules:
- summary: Plain-English, friendly, and helpful summary. Highlight the main catch.
- title: Replace complex legal titles with simple sentences. (e.g., Instead of "Asymmetric Liability", use "You might have to pay for everything").
- description: Use very simple, everyday language. Avoid ALL legal jargon. Keep it short and clear, explain like talking to a normal person.
- consequence: Clear real-world consequence. What could go wrong? (e.g., "You might end up paying extra money unexpectedly.")

Scoring Rules:
- riskScore: 0 (safe) to 100 (very risky). Use conservative scoring.
- confidenceScore: 0 to 100 (how confident you are in the analysis).
- risks: Return 3 to 6 concise items.
- consequences: short real-world business or legal impacts in plain English.

Document name: ${documentName}

Extracted contract text:
${excerpt}
`.trim();

  const parsed = await withGeminiModelFallback("analysis", async (client, modelName) => {
    const model = client.getGenerativeModel(
      {
        model: modelName,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
          responseSchema: analysisResponseSchema,
        },
      },
      { timeout: GEMINI_TIMEOUT_MS },
    );

    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().trim());
  });

  return normalizeAnalysisPayload(documentName, parsed);
}