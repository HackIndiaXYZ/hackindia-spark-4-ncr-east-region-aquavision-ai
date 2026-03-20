import type { AnalysisResult } from "@/types/analysis";

export const demoAnalysis: AnalysisResult = {
  documentName: "service-agreement.pdf",
  summary:
    "We found a few tricky parts in this contract. It asks you to take on a lot of risk, makes it hard to leave early, and could charge you big penalties if you're late on payments.",
  riskScore: 78,
  confidenceScore: 91,
  risks: [
    {
      id: "liability-1",
      title: "You might have to pay for everything",
      level: "high",
      description:
        "The company limits how much they have to pay if things go wrong, but they don't give you the same protection.",
      consequence:
        "If there's a fight or mistake, you might end up paying a huge bill that isn't completely your fault.",
    },
    {
      id: "term-1",
      title: "You don't have enough time to back out",
      level: "medium",
      description:
        "If you want to stop working with them, you have to tell them very quickly. The timeline is extremely tight.",
      consequence:
        "You might get stuck without a backup plan or have your business disrupted because you couldn't find a replacement in time.",
    },
    {
      id: "payment-1",
      title: "The late fees are extremely high",
      level: "medium",
      description:
        "If you miss a payment deadline, the extra interest they charge you is way higher than normal.",
      consequence:
        "A small delay in payment could accidentally snowball into a massive extra charge out of nowhere.",
    },
    {
      id: "ip-1",
      title: "It's not clear who owns the final work",
      level: "low",
      description:
        "The contract doesn't clearly say if you totally own the work you create, or if they own parts of it.",
      consequence:
        "They might try to block you from reusing your own work or ideas for other projects in the future.",
    },
  ],
  consequences: [
    "Unexpected legal bills if a mistake happens.",
    "Stressful, rushed operations if you need to cancel.",
    "Huge penalty costs if a payment gets delayed.",
  ],
};

export function getDemoAnalysis(documentName?: string): AnalysisResult {
  return {
    ...demoAnalysis,
    documentName: documentName || demoAnalysis.documentName,
  };
}
