import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_PRIMARY_MODEL = "gemini-2.5-flash";
const DEFAULT_FALLBACK_MODELS = [
  "gemini-3-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
] as const;

type GeminiErrorLike = {
  status?: number;
  statusText?: string;
  message?: string;
};

type GeminiAttempt = {
  model: string;
  message: string;
  status?: number;
};

function parseModelList(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
}

function getModelCandidates() {
  return [...new Set([
    ...parseModelList(process.env.GEMINI_MODEL),
    DEFAULT_PRIMARY_MODEL,
    ...parseModelList(process.env.GEMINI_FALLBACK_MODELS),
    ...DEFAULT_FALLBACK_MODELS,
  ])];
}

function toGeminiError(error: unknown): GeminiErrorLike {
  if (!error || typeof error !== "object") {
    return {};
  }

  return error as GeminiErrorLike;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  const geminiError = toGeminiError(error);
  return geminiError.message || "Unknown Gemini error.";
}

function isFatalConfigurationError(error: unknown) {
  const geminiError = toGeminiError(error);
  const message = getErrorMessage(error).toLowerCase();

  return (
    geminiError.status === 401 ||
    geminiError.status === 403 ||
    message.includes("api key not valid") ||
    message.includes("api_key_invalid") ||
    message.includes("permission denied")
  );
}

function summarizeAttempts(attempts: GeminiAttempt[]) {
  const hasQuotaFailure = attempts.some(
    (attempt) =>
      attempt.status === 429 ||
      attempt.message.toLowerCase().includes("quota exceeded") ||
      attempt.message.toLowerCase().includes("too many requests"),
  );

  if (hasQuotaFailure) {
    return `Gemini quota is unavailable for the attempted models (${attempts
      .map((attempt) => attempt.model)
      .join(", ")}).`;
  }

  const lastAttempt = attempts.at(-1);

  if (!lastAttempt) {
    return "Gemini is unavailable right now.";
  }

  return `Gemini is unavailable right now (${lastAttempt.model}: ${lastAttempt.message}).`;
}

export class GeminiRequestError extends Error {
  attempts: GeminiAttempt[];

  constructor(message: string, attempts: GeminiAttempt[]) {
    super(message);
    this.name = "GeminiRequestError";
    this.attempts = attempts;
  }
}

export function getGeminiFallbackMessage(error: unknown, action: "analysis" | "translation") {
  if (error instanceof GeminiRequestError) {
    const message = summarizeAttempts(error.attempts);
    return `Using demo ${action} because ${message.charAt(0).toLowerCase()}${message.slice(1)}`;
  }

  const message = getErrorMessage(error);

  if (message === "GEMINI_API_KEY is not configured.") {
    return `Using demo ${action} because the Gemini API key is not configured.`;
  }

  return `Using demo ${action} because Gemini is unavailable right now.`;
}

export async function withGeminiModelFallback<T>(
  taskName: string,
  handler: (client: GoogleGenerativeAI, modelName: string) => Promise<T>,
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const attempts: GeminiAttempt[] = [];

  for (const modelName of getModelCandidates()) {
    try {
      return await handler(client, modelName);
    } catch (error) {
      attempts.push({
        model: modelName,
        message: getErrorMessage(error),
        status: toGeminiError(error).status,
      });

      if (isFatalConfigurationError(error)) {
        break;
      }
    }
  }

  throw new GeminiRequestError(
    `Gemini ${taskName} failed for all configured models.`,
    attempts,
  );
}
