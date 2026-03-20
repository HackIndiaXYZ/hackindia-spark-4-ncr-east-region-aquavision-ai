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

  const getStr = (en: string, hi: string, hinglish: string, gu: string, ta: string, te: string) => {
    if (targetLanguage === 'hi') return hi;
    if (targetLanguage === 'hinglish') return hinglish;
    if (targetLanguage === 'gu') return gu;
    if (targetLanguage === 'ta') return ta;
    if (targetLanguage === 'te') return te;
    return en;
  };

  const t = {
    liveAnalysis: getStr("🟢 Live AI Analysis", "🟢 लाइव AI विश्लेषण", "🟢 लाइव AI एनालिसिस", "🟢 લાઇવ AI વિશ્લેષણ", "🟢 நேரடி AI பகுப்பாய்வு", "🟢 లైవ్ AI విశ్లేషణ"),
    demoMode: getStr("🟡 Demo Mode", "🟡 डेमो मोड", "🟡 डेमो मोड", "🟡 ડેમો મોડ", "🟡 டெமோ பயன்முறை", "🟡 డెమో మోడ్"),
    demoNote: getStr("Showing demo results due to temporary issue", "अस्थायी समस्या के कारण डेमो परिणाम दिखा रहे हैं", "अस्थायी समस्या के कारण डेमो परिणाम दिखा रहे हैं", "અસ્થાયી સમસ્યાને કારણે ડેમો પરિણામો બતાવી રહ્યું છે", "தற்காலிக சிக்கல் காரணமாக டெமோ முடிவுகள் காட்டப்படுகின்றன", "తాత్కాలిక సమస్య కారణంగా డెమో ఫలితాలు చూపుతున్నాము"),
    confidence: getStr("Confidence Score", "विश्वास स्कोर", "कॉन्फिडेंस स्कोर", "વિશ્વાસ સ્કોર", "நம்பிக்கை மதிப்பெண்", "విశ్వాస స్కోరు"),
    risksFound: getStr("Risks Found", "पाए गए जोखिम", "जोखिम मिले", "જોખમો મળ્યા", "கண்டறியப்பட்ட அபாயங்கள்", "ప్రమాదాలు కనుగొనబడ్డాయి"),
    high: getStr("high", "उच्च", "हाई", "ઉચ્ચ", "உயர்", "అధిక"),
    whatGoesWrong: getStr("⚠️ What could go wrong?", "⚠️ क्या गलत हो सकता है?", "⚠️ क्या गलत हो सकता है?", "⚠️ શું ખોટું થઈ શકે છે?", "⚠️ என்ன தவறாக நடக்கலாம்?", "⚠️ ఏమి తప్పు జరగవచ్చు?"),
    summaryLabel: getStr("Summary", "सारांश (SUMMARY)", "सारांश (SUMMARY)", "સારાંશ (SUMMARY)", "சுருக்கம் (SUMMARY)", "సారాంశం (SUMMARY)"),
    simplifiedNote: getStr("We’ve simplified this so you can understand it easily.", "हमने आपके समझने के लिए इसे आसान कर दिया है।", "हमने इसे आसान कर दिया है ताकि आप इसे आसानी से समझ सकें।", "અમે આને સરળ બનાવ્યું છે જેથી તમે સમજી શકો.", "நீங்கள் எளிதாக புரிந்து கொள்ள முடியும் என்பதற்காக இதை எளிதாக்கியுள்ளோம்.", "మీరు సులభంగా అర్థం చేసుకోవడానికి మేము దీన్ని సరళీకృతం చేసాము."),
    riskBreakdown: getStr("Risk Breakdown", "जोखिम का विवरण", "जोखिम का विवरण", "જોખમનું વિભાજન", "அபாய விவரம்", "ప్రమాదాల విచ్ఛిన్నం"),
    priorityNote: getStr("High priority items are expanded", "उच्च प्राथमिकता वाले आइटम विस्तारित हैं", "उच्च प्राथमिकता वाले आइटम विस्तारित हैं", "ઉચ્ચ પ્રાથમિકતાવાળી આઇટમ્સ વિસ્તૃત કરવામાં આવી છે", "முன்னுரிமை உருப்படிகள் விரிவாக்கப்பட்டுள்ளன", "అధిక ప్రాధాన్యత ఉన్నవి విస్తరించబడ్డాయి"),
    catHigh: getStr("High Risk Issues", "उच्च जोखिम वाली समस्याएं", "उच्च जोखिम वाली समस्याएं", "ઉચ્ચ જોખમી સમસ્યાઓ", "உயர் அபாய சிக்கல்கள்", "అధిక ప్రమాద సమస్యలు"),
    catMedium: getStr("Moderate Risk Issues", "मध्यम जोखिम वाली समस्याएं", "मध्यम जोखिम वाली समस्याएं", "મધ્યમ જોખમી સમસ્યાઓ", "மிதமான அபாய சிக்கல்கள்", "మితమైన ప్రమాద సమస్యలు"),
    catLow: getStr("Review Recommended", "समीक्षा की सिफारिश की गई", "समीक्षा की सिफारिश की गई", "સમીક્ષાની ભલામણ કરવામાં આવે છે", "மதிப்பாய்வு பரிந்துரைக்கப்படுகிறது", "సమీక్ష సిఫార్సు చేయబడింది"),
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
