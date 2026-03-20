import type { AnalysisResult } from "@/types/analysis";

export const demoAnalysis: AnalysisResult = {
  documentName: "service-agreement.pdf",
  summary:
    "This service agreement includes broad indemnity obligations, auto-renewal behavior, and termination language that favors the provider.",
  riskScore: 78,
  confidenceScore: 91,
  risks: [
    {
      id: "liability-1",
      title: "Asymmetric Liability Terms",
      level: "high",
      description:
        "Your exposure appears broader than the provider's liability cap, which creates an uneven allocation of risk.",
      consequence:
        "A dispute could leave you covering losses that the other side has contractually limited for itself.",
    },
    {
      id: "term-1",
      title: "Short Termination Notice Period",
      level: "medium",
      description:
        "The agreement allows a short notice window that may not give enough time for a safe transition.",
      consequence:
        "Operations could be disrupted if the contract ends before you have a replacement process in place.",
    },
    {
      id: "payment-1",
      title: "High Late Payment Interest",
      level: "medium",
      description:
        "The late-fee clause applies a monthly interest rate above what many commercial agreements use.",
      consequence:
        "Delayed payments could snowball into materially higher costs over a short period.",
    },
    {
      id: "ip-1",
      title: "Ambiguous IP Ownership",
      level: "low",
      description:
        "The contract leaves room for disagreement over what counts as pre-existing materials versus deliverables.",
      consequence:
        "Ownership disputes can delay product delivery and complicate future reuse of work product.",
    },
  ],
  consequences: [
    "Unexpected legal liability in a dispute",
    "Operational disruption from a fast exit timeline",
    "Higher financial exposure from penalty-style payment clauses",
  ],
};

export function getDemoAnalysis(documentName?: string): AnalysisResult {
  return {
    ...demoAnalysis,
    documentName: documentName || demoAnalysis.documentName,
  };
}
