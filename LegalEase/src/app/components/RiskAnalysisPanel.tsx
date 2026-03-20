import type { AnalysisResult, RiskCard, RiskLevel } from "@/types/analysis";

import { RiskCategoryAccordion } from "./RiskCategoryAccordion";
import { RiskIndicatorBar } from "./RiskIndicatorBar";
import { RiskSummaryBanner } from "./RiskSummaryBanner";

interface RiskAnalysisPanelProps {
  analysis: AnalysisResult | null;
  analysisMode: "demo" | "live" | null;
  onViewInDocument: (clauseId: string) => void;
  showAnimations?: boolean;
  targetLanguage?: string;
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
  targetLanguage = "en",
}: RiskAnalysisPanelProps) {
  if (!analysis) {
    return null;
  }

  const t = {
    liveAnalysis: targetLanguage === "hi" ? "🟢 लाइव AI एनालिसिस" : "🟢 Live AI Analysis",
    demoMode: targetLanguage === "hi" ? "🟡 डेमो मोड" : "🟡 Demo Mode",
    demoNote: targetLanguage === "hi" ? "अस्थायी समस्या के कारण डेमो परिणाम दिखा रहे हैं" : "Showing demo results due to temporary issue",
    confidence: targetLanguage === "hi" ? "कॉन्फिडेंस स्कोर" : "Confidence Score",
    risksFound: targetLanguage === "hi" ? "जोखिम मिले" : "Risks Found",
    high: targetLanguage === "hi" ? "हाई" : "high",
    whatGoesWrong: targetLanguage === "hi" ? "⚠️ क्या गलत हो सकता है?" : "⚠️ What could go wrong?",
    summaryLabel: targetLanguage === "hi" ? "सारांश (SUMMARY)" : "Summary",
    simplifiedNote: targetLanguage === "hi" ? "हमने इसे आसान कर दिया है ताकि आप इसे आसानी से समझ सकें।" : "We’ve simplified this so you can understand it easily.",
    riskBreakdown: targetLanguage === "hi" ? "जोखिम का विवरण" : "Risk Breakdown",
    priorityNote: targetLanguage === "hi" ? "उच्च प्राथमिकता वाले आइटम विस्तारित हैं" : "High priority items are expanded",
    catHigh: targetLanguage === "hi" ? "उच्च जोखिम वाली समस्याएं" : "High Risk Issues",
    catMedium: targetLanguage === "hi" ? "मध्यम जोखिम वाली समस्याएं" : "Moderate Risk Issues",
    catLow: targetLanguage === "hi" ? "समीक्षा की सिफारिश की गई" : "Review Recommended",
  };

  const riskLevel = scoreToRiskLevel(analysis.riskScore);
  const riskCategories = categoryConfig
    .map((category) => ({
      id: category.id,
      title: category.id === "high" ? t.catHigh : category.id === "medium" ? t.catMedium : t.catLow,
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
            targetLanguage={targetLanguage}
          />
        </div>

        {analysisMode && (
          <div className="border-b border-border bg-white px-4 py-3 md:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs shadow-sm ${
                  analysisMode === "live"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-amber-100 text-amber-900 border border-amber-200"
                }`}
                style={{ fontWeight: 700, letterSpacing: "0.02em" }}
              >
                {analysisMode === "live"
                  ? t.liveAnalysis
                  : t.demoMode}
              </span>
              {analysisMode === "demo" && (
                <span className="text-xs text-muted-foreground">
                  {t.demoNote}
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
              <div className="text-xs text-muted-foreground">{t.confidence}</div>
              <div className="text-2xl" style={{ fontWeight: 700 }}>
                {analysis.confidenceScore}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{t.risksFound}</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl text-red-600" style={{ fontWeight: 700 }}>
                  {totalRisks}
                </div>
                <div className="text-sm text-muted-foreground">({highRiskCount} {t.high})</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-border bg-white px-4 py-4 md:px-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base md:text-lg text-amber-900" style={{ fontWeight: 700 }}>
              {t.whatGoesWrong}
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
              {t.summaryLabel}
            </div>
            <p className="text-sm leading-relaxed text-foreground">{analysis.summary}</p>
            <p className="mt-2 text-xs italic text-muted-foreground">{t.simplifiedNote}</p>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base md:text-lg" style={{ fontWeight: 600 }}>
              {t.riskBreakdown}
            </h3>
            <div className="text-xs text-muted-foreground">
              {t.priorityNote}
            </div>
          </div>
          <RiskCategoryAccordion
            categories={riskCategories}
            onViewInDocument={onViewInDocument}
            targetLanguage={targetLanguage}
          />
        </div>
      </div>
    </div>
  );
}
