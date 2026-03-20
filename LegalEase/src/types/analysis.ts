export type RiskLevel = "low" | "medium" | "high";

export type RiskCard = {
  id: string;
  title: string;
  level: RiskLevel;
  description: string;
  consequence: string;
};

export type AnalysisResult = {
  documentName: string;
  summary: string;
  riskScore: number;
  confidenceScore: number;
  risks: RiskCard[];
  consequences: string[];
};
