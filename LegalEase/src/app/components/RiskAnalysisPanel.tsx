import type { AnalysisResult, RiskCard, RiskLevel } from "@/types/analysis";

import { RiskCategoryAccordion } from "./RiskCategoryAccordion";
import { RiskIndicatorBar } from "./RiskIndicatorBar";
import { RiskSummaryBanner } from "./RiskSummaryBanner";

interface RiskAnalysisPanelProps {
  analysis: AnalysisResult | null;
  analysisMode: "demo" | "live" | null;
  onViewInDocument: (clauseId: string) => void;
  showAnimations?: boolean;
}

type ClauseSeverity = "critical" | "moderate" | "informational";

const severityByLevel: Record<RiskLevel, ClauseSeverity> = {
  high: "critical",
  medium: "moderate",
  low: "informational",
};

const categoryConfig = [
  {
    id: "high",
    title: "High Risk Issues",
    level: "high" as const,
    isHighPriority: true,
  },
  {
    id: "medium",
    title: "Moderate Risk Issues",
    level: "medium" as const,
    isHighPriority: false,
  },
  {
    id: "low",
    title: "Review Recommended",
    level: "low" as const,
    isHighPriority: false,
  },
];

function scoreToRiskLevel(score: number): RiskLevel {
  if (score > 66) {
    return "high";
  }

  if (score > 33) {
    return "medium";
  }

  return "low";
}

function getPrimaryIssues(risks: RiskCard[]) {
  return risks.slice(0, 2).map((risk) => risk.title);
}

export function RiskAnalysisPanel({
  analysis,
  analysisMode,
  onViewInDocument,
  showAnimations = false,
}: RiskAnalysisPanelProps) {
  if (!analysis) {
    return null;
  }

  const riskLevel = scoreToRiskLevel(analysis.riskScore);
  const riskCategories = categoryConfig
    .map((category) => ({
      id: category.id,
      title: category.title,
      isHighPriority: category.isHighPriority,
      clauses: analysis.risks
        .filter((risk) => risk.level === category.level)
        .map((risk) => ({
          id: risk.id,
          title: risk.title,
          description: risk.description,
          consequence: risk.consequence,
          severity: severityByLevel[risk.level],
        })),
    }))
    .filter((category) => category.clauses.length > 0);

  const totalRisks = analysis.risks.length;
  const highRiskCount = analysis.risks.filter((risk) => risk.level === "high").length;
  const primaryIssues = getPrimaryIssues(analysis.risks);

  return (
    <div className="custom-scrollbar h-full overflow-y-auto bg-gray-50">
      <div className="min-h-full">
        <div className="border-b border-border">
          <RiskSummaryBanner
            riskLevel={riskLevel}
            riskScore={analysis.riskScore}
            primaryIssues={primaryIssues}
          />
        </div>

        {analysisMode && (
          <div className="border-b border-border bg-white px-4 py-3 md:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs ${
                  analysisMode === "live"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-800"
                }`}
                style={{ fontWeight: 600 }}
              >
                {analysisMode === "live"
                  ? "Live Analysis"
                  : "Demo Mode (Fallback)"}
              </span>
              {analysisMode === "demo" && (
                <span className="text-xs text-muted-foreground">
                  Showing demo results due to temporary issue
                </span>
              )}
            </div>
          </div>
        )}

        <div className="border-b border-border bg-white p-4 md:p-6">
          <RiskIndicatorBar score={analysis.riskScore} animate={showAnimations} />
        </div>

        <div className="border-b border-border bg-white px-4 py-3 md:px-6 md:py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Confidence Score</div>
              <div className="text-2xl" style={{ fontWeight: 700 }}>
                {analysis.confidenceScore}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Risks Found</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl text-red-600" style={{ fontWeight: 700 }}>
                  {totalRisks}
                </div>
                <div className="text-sm text-muted-foreground">({highRiskCount} high)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-border bg-white px-4 py-4 md:px-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base md:text-lg" style={{ fontWeight: 600 }}>
              Real-World Consequences
            </h3>
          </div>
          <div className="space-y-2">
            {analysis.consequences.map((consequence) => (
              <div
                key={consequence}
                className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-950"
              >
                {consequence}
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-border bg-white px-4 py-4 md:px-6">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
              Summary
            </div>
            <p className="text-sm leading-relaxed text-foreground">{analysis.summary}</p>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base md:text-lg" style={{ fontWeight: 600 }}>
              Risk Breakdown
            </h3>
            <div className="text-xs text-muted-foreground">
              High priority items are expanded
            </div>
          </div>
          <RiskCategoryAccordion
            categories={riskCategories}
            onViewInDocument={onViewInDocument}
          />
        </div>
      </div>
    </div>
  );
}
