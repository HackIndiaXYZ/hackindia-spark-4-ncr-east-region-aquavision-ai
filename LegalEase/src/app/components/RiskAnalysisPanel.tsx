import type { AnalysisResult, RiskCard, RiskLevel } from "@/types/analysis";

import { RiskCategoryAccordion } from "./RiskCategoryAccordion";
import { RiskIndicatorBar } from "./RiskIndicatorBar";
import { RiskSummaryBanner } from "./RiskSummaryBanner";

interface RiskAnalysisPanelProps {
  analysis: AnalysisResult | null;
  analysisMode: "demo" | "live" | null;
  onViewInDocument: (clauseId: string) => void;
  canViewInDocument?: boolean;
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
  canViewInDocument = false,
  showAnimations = false,
  targetLanguage = "en",
}: RiskAnalysisPanelProps) {
  if (!analysis) {
    return null;
  }

  const getStr = (en: string, hi: string, hinglish: string, gu: string, ta: string, te: string, mr: string) => {
    if (targetLanguage === 'hi') return hi;
    if (targetLanguage === 'hinglish') return hinglish;
    if (targetLanguage === 'gu') return gu;
    if (targetLanguage === 'ta') return ta;
    if (targetLanguage === 'te') return te;
    if (targetLanguage === 'mr') return mr;
    return en;
  };

  const t = {
    liveAnalysis: getStr("🟢 Live AI Analysis", "🟢 लाइव AI विश्लेषण", "🟢 Live AI Analysis", "🟢 લાઇવ AI વિશ્લેષણ", "🟢 நேரடி AI பகுப்பாய்வு", "🟢 లైవ్ AI విశ్లేషణ", "🟢 थेट AI विश्लेषण"),
    demoMode: getStr("🟡 Demo Mode (Hackathon Preview)", "🟡 डेमो मोड (हैकथॉन प्रीव्यू)", "🟡 Demo Mode (Hackathon Preview)", "🟡 ડેમો મોડ (હેકાથોન પ્રિવ્યૂ)", "🟡 டெமோ பயன்முறை (ஹக்கத்தான் முன்னோட்டம்)", "🟡 డెమో మోడ్ (హాకథాన్ ప్రివ్యూ)", "🟡 डेमो मोड (हॅकथॉन प्रिव्ह्यू)"),
    confidence: getStr("Confidence Score", "विश्वास स्कोर", "Confidence Score", "વિશ્વાસ સ્કોર", "நம்பிக்கை மதிப்பெண்", "విశ్వాస స్కోరు", "विश्वास स्कोर"),
    risksFound: getStr("Risks Found", "पाए गए जोखिम", "Risks Mile", "જોખમો મળ્યા", "கண்டறியப்பட்ட அபாயங்கள்", "ప్రమాదాలు కనుగొనబడ్డాయి", "सापडलेल्या जोखीमा"),
    high: getStr("high", "उच्च", "high", "ઉચ્ચ", "உயர்", "అధిక", "उच्च"),
    whatGoesWrong: getStr("⚠️ What could go wrong?", "⚠️ क्या गलत हो सकता है?", "⚠️ Kya galat ho sakta hai?", "⚠️ શું ખોટું થઈ શકે છે?", "⚠️ என்ன தவறாக நடக்கலாம்?", "⚠️ ఏమి తప్పు జరగవచ్చు?", "⚠️ काय चुकीचे होऊ शकते?"),
    summaryLabel: getStr("Summary", "सारांश (SUMMARY)", "Summary", "સારાંશ (SUMMARY)", "சுருக்கம் (SUMMARY)", "సారాంశం (SUMMARY)", "सारांश (SUMMARY)"),
    simplifiedNote: getStr("We’ve simplified this so you can understand it easily.", "हमने आपके समझने के लिए इसे आसान कर दिया है।", "Isko aasan language mein samjhaya gaya hai.", "અમે આને સરળ બનાવ્યું છે જેથી તમે સમજી શકો.", "நீங்கள் எளிதாக புரிந்து கொள்ள முடியும் என்பதற்காக இதை எளிதாக்கியுள்ளோம்.", "మీరు సులభంగా అర్థం చేసుకోవడానికి మేము దీన్ని సరళీకృతం చేసాము.", "समजायला सोपे व्हावे म्हणून हे सोप्या भाषेत दिले आहे."),
    riskBreakdown: getStr("Risk Breakdown", "जोखिम का विवरण", "Risk Breakdown", "જોખમનું વિભાજન", "அபாய விவரம்", "ప్రమాదాల విచ్ఛిన్నం", "जोखीम तपशील"),
    priorityNote: getStr("High priority items are expanded", "उच्च प्राथमिकता वाले आइटम विस्तारित हैं", "High priority items khule hue hain", "ઉચ્ચ પ્રાથમિકતાવાળી આઇટમ્સ વિસ્તૃત કરવામાં આવી છે", "முன்னுரிமை உருப்படிகள் விரிவாக்கப்பட்டுள்ளன", "అధిక ప్రాధాన్యత ఉన్నవి విస్తరించబడ్డాయి", "उच्च प्राधान्याच्या बाबी उघड्या आहेत"),
    catHigh: getStr("High Risk Issues", "उच्च जोखिम वाली समस्याएं", "High Risk Wale Issues", "ઉચ્ચ જોખમી સમસ્યાઓ", "உயர் அபாய சிக்கல்கள்", "అధిక ప్రమాద సమస్యలు", "उच्च जोखीम समस्या"),
    catMedium: getStr("Moderate Risk Issues", "मध्यम जोखिम वाली समस्याएं", "Moderate Risk Wale Issues", "મધ્યમ જોખમી સમસ્યાઓ", "மிதமான அபாய சிக்கல்கள்", "మితమైన ప్రమాద సమస్యలు", "मध्यम जोखीम समस्या"),
    catLow: getStr("Review Recommended", "समीक्षा की सिफारिश की गई", "Review Karna Recommended Hai", "સમીક્ષાની ભલામણ કરવામાં આવે છે", "மதிப்பாய்வு பரிந்துரைக்கப்படுகிறது", "సమీక్ష సిఫార్సు చేయబడింది", "पुनरावलोकन सुचवले आहे"),
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
    <div className="custom-scrollbar h-full overflow-y-auto bg-transparent">
      <div className="min-h-full bg-slate-50 dark:bg-[#0B0F19]" id="exportable-analysis">
        <div className="border-b border-border dark:border-white/10">
          <RiskSummaryBanner
            riskLevel={riskLevel}
            riskScore={analysis.riskScore}
            primaryIssues={primaryIssues}
            targetLanguage={targetLanguage}
          />
        </div>

        {analysisMode && (
          <div className="border-b border-border bg-white/80 dark:border-white/10 dark:bg-[#0B0F19]/60 px-4 py-3 backdrop-blur-md md:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs shadow-sm ${
                  analysisMode === "live"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
                    : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
                }`}
                style={{ fontWeight: 700, letterSpacing: "0.02em" }}
              >
                {analysisMode === "live"
                  ? t.liveAnalysis
                  : t.demoMode}
              </span>
            </div>
          </div>
        )}

        <div className="border-b border-border bg-transparent dark:border-white/10 p-4 md:p-6">
          <RiskIndicatorBar score={analysis.riskScore} animate={showAnimations} targetLanguage={targetLanguage} />
        </div>

        <div className="border-b border-border bg-slate-50/80 dark:border-white/10 dark:bg-[#0F172A]/40 px-4 py-3 md:px-6 md:py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground dark:text-slate-400">{t.confidence}</div>
              <div className="text-2xl text-slate-900 dark:text-slate-100" style={{ fontWeight: 700 }}>
                {analysis.confidenceScore}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground dark:text-slate-400">{t.risksFound}</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl text-red-500 dark:text-red-400" style={{ fontWeight: 700 }}>
                  {totalRisks}
                </div>
                <div className="text-sm text-muted-foreground dark:text-slate-400">({highRiskCount} {t.high})</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-border bg-transparent dark:border-white/10 px-4 py-4 md:px-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base md:text-lg text-amber-600 dark:text-amber-400" style={{ fontWeight: 700 }}>
              {t.whatGoesWrong}
            </h3>
          </div>
          <div className="space-y-2">
            {analysis.consequences.map((consequence) => (
              <div
                key={consequence}
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-100 dark:shadow-[0_0_10px_rgba(245,158,11,0.05)] backdrop-blur-sm"
              >
                {consequence}
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-border bg-slate-50/80 dark:border-white/10 dark:bg-[#0F172A]/40 px-4 py-4 md:px-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.08em] text-muted-foreground dark:text-slate-400">
              {t.summaryLabel}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">{analysis.summary}</p>
            <p className="mt-2 text-xs italic text-muted-foreground dark:text-slate-500">{t.simplifiedNote}</p>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base md:text-lg text-slate-900 dark:text-slate-100" style={{ fontWeight: 600 }}>
              {t.riskBreakdown}
            </h3>
            <div className="text-xs text-muted-foreground dark:text-slate-400">
              {t.priorityNote}
            </div>
          </div>
          <RiskCategoryAccordion
            categories={riskCategories}
            onViewInDocument={onViewInDocument}
            canViewInDocument={canViewInDocument}
            targetLanguage={targetLanguage}
          />
        </div>
      </div>
    </div>
  );
}
