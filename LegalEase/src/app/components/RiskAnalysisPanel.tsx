import type { AnalysisResult, RiskCard, RiskLevel } from "@/types/analysis";

import { RiskCategoryAccordion } from "./RiskCategoryAccordion";
import { RiskSummaryBanner } from "./RiskSummaryBanner";

interface RiskAnalysisPanelProps {
  analysis: AnalysisResult | null;
  analysisMode: "demo" | "live" | null;
  onViewInDocument: (clauseId: string) => void;
  canViewInDocument?: boolean;
  exportElementId?: string;
  exportMode?: boolean;
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

const langNames: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  hinglish: "Hinglish",
  gu: "Gujarati",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
};

export function RiskAnalysisPanel({
  analysis,
  analysisMode,
  onViewInDocument,
  canViewInDocument = false,
  exportElementId,
  exportMode = false,
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
    liveAnalysis: getStr("Live AI Analysis", "लाइव AI विश्लेषण", "Live AI Analysis", "લાઇવ AI વિશ્લેષણ", "நேரடி AI பகுப்பாய்வு", "లైవ్ AI విశ్లేషణ", "थेट AI विश्लेषण"),
    demoMode: getStr("Demo Mode", "डेमो मोड", "Demo Mode", "ડેમો મોડ", "டெமோ பயன்முறை", "డెమో మోడ్", "डेमो मोड"),
    privacyProtected: getStr("Privacy Protected", "गोपनीयता सुरक्षित", "Privacy Protected", "ગોપનીયતા સુરક્ષિત", "தனியுரிமை பாதுகாக்கப்பட்டது", "గోప్యత రక్షించబడింది", "गोपनीयता सुरक्षित"),
    aiConfidence: getStr("AI Confidence", "AI विश्वास", "AI Confidence", "AI વિશ્વાસ", "AI நம்பிக்கை", "AI విశ్వాసం", "AI विश्वास"),
    risksFound: getStr("Risks Found", "पाए गए जोखिम", "Risks Mile", "જોખમો મળ્યા", "கண்டறியப்பட்ட அபாயங்கள்", "ప్రమాదాలు కనుగొనబడ్డాయి", "सापडलेल्या जोखीमा"),
    language: getStr("Language", "भाषा", "Language", "ભાષા", "மொழி", "భాష", "भाषा"),
    loopholes: getStr("Loopholes", "खामियां", "Loopholes", "છટકબારી", "ஓட்டைகள்", "లొసుగులు", "पळवाटा"),
    high: getStr("high", "उच्च", "high", "ઉચ્ચ", "உயர்", "అధిక", "उच्च"),
    none: getStr("none", "कोई नहीं", "none", "કોઈ નહીં", "இல்லை", "ఏదీ లేదు", "काही नाही"),
    simplifiedView: getStr("SIMPLIFIED VIEW", "सरल दृश्य", "SIMPLIFIED VIEW", "સરળ દૃશ્ય", "எளிமையான காட்சி", "సరళీకృత వీక్షణ", "सोपे दृश्य"),
    realWorldConsequences: getStr("Real-World Consequences", "वास्तविक परिणाम", "Real-World Consequences", "વાસ્તવિક પરિણામો", "நிஜ உலக விளைவுகள்", "వాస్తవ-ప్రపంచ పర్యవసానాలు", "वास्तविक परिणाम"),
    riskBreakdown: getStr("Risk Breakdown", "जोखिम का विवरण", "Risk Breakdown", "જોખમનું વિભાજન", "அபாய விவரம்", "ప్రమాదాల విచ్ఛిన్నం", "जोखीम तपशील"),
    priorityNote: getStr("High priority items are expanded", "उच्च प्राथमिकता वाले आइटम विस्तारित हैं", "High priority items khule hue hain", "ઉચ્ચ પ્રાથમિકતાવાળી આઇટમ્સ વિસ્તૃત કરવામાં આવી છે", "முன்னுரிமை உருப்படிகள் விரிவாக்கப்பட்டுள்ளன", "అధిక ప్రాధాన్యత ఉన్నవి విస్తరించబడ్డాయి", "उच्च प्राधान्याच्या बाबी उघड्या आहेत"),
    catHigh: getStr("High Risk Issues", "उच्च जोखिम वाली समस्याएं", "High Risk Wale Issues", "ઉચ્ચ જોખમી સમસ્યાઓ", "உயர் அபாய சிக்கல்கள்", "అధిక ప్రమాద సమస్యలు", "उच्च जोखीम समस्या"),
    catMedium: getStr("Moderate Risk Issues", "मध्यम जोखिम वाली समस्याएं", "Moderate Risk Wale Issues", "મધ્યમ જોખમી સમસ્યાઓ", "மிதமான அபாய சிக்கல்கள்", "మితమైన ప్రమాద సమస్యలు", "मध्यम जोखीम समस्या"),
    catLow: getStr("Review Recommended", "समीक्षा की सिफारिश की गई", "Review Karna Recommended Hai", "સમીક્ષાની ભલામણ કરવામાં આવે છે", "மதிப்பாய்வு பரிந்துரைக்கப்படுகிறது", "సమీక్ష సిఫార్సు చేయబడింది", "पुनरावलोकन सुचवले आहे"),
    loopholesTraps: getStr("Loopholes & Hidden Traps", "खामियां और छिपे जाल", "Loopholes & Hidden Traps", "છટકબારી અને છુપાયેલા જાળ", "ஓட்டைகள் & மறைக்கப்பட்ட பொறிகள்", "లొసుగులు & దాగిన ఉచ్చులు", "पळवाटा आणि लपलेले सापळे"),
    highRiskLabel: getStr("HIGH RISK", "उच्च जोखिम", "HIGH RISK", "ઉચ્ચ જોખમ", "உயர் அபாயம்", "అధిక ప్రమాదం", "उच्च जोखीम"),
    mediumRiskLabel: getStr("MEDIUM RISK", "मध्यम जोखिम", "MEDIUM RISK", "મધ્યમ જોખમ", "மிதமான அபாயம்", "మితమైన ప్రమాదం", "मध्यम जोखीम"),
    lowRiskLabel: getStr("LOW RISK", "कम जोखिम", "LOW RISK", "ઓછું જોખમ", "குறைந்த அபாயம்", "తక్కువ ప్రమాదం", "कमी जोखीम"),
    evidenceFromDocument: getStr("EVIDENCE FROM DOCUMENT:", "दस्तावेज़ से प्रमाण:", "EVIDENCE FROM DOCUMENT:", "દસ્તાવેજમાંથી પુરાવા:", "ஆவணத்திலிருந்து சான்று:", "పత్రం నుండి సాక్ష్యం:", "कागदपत्रातील पुरावा:"),
    viewInDocument: getStr("VIEW IN DOCUMENT", "दस्तावेज़ में देखें", "DOCUMENT MEIN DEKHO", "દસ્તાવેજમાં જુઓ", "ஆவணத்தில் பார்க்கவும்", "పత్రంలో చూడండి", "कागदपत्रात पहा"),
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
      <div className="min-h-full bg-white dark:bg-[#0F172A]" id={exportElementId}>
        {/* Semi-circular Gauge Banner */}
        <div className="border-b border-slate-200 dark:border-white/10">
          <RiskSummaryBanner
            riskLevel={riskLevel}
            riskScore={analysis.riskScore}
            primaryIssues={primaryIssues}
            targetLanguage={targetLanguage}
          />
        </div>

        {/* Badges Row: Live AI Analysis + Privacy Protected */}
        {analysisMode && (
          <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] px-4 py-3 md:px-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs shadow-sm ${
                  analysisMode === "live"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30"
                    : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30"
                }`}
                style={{ fontWeight: 700 }}
              >
                <span className={`inline-block h-2 w-2 rounded-full ${analysisMode === "live" ? "bg-emerald-500" : "bg-amber-500"}`} />
                {analysisMode === "live" ? t.liveAnalysis : t.demoMode}
              </span>
              <span
                className="flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 px-3 py-1 text-xs shadow-sm"
                style={{ fontWeight: 700 }}
              >
                🔒 {t.privacyProtected}
              </span>
            </div>
          </div>
        )}

        {/* 4-column Stats Row */}
        <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] px-4 py-4 md:px-6">
          <div className="grid grid-cols-4 gap-4">
            {/* AI Confidence */}
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.aiConfidence}</div>
              <div className="text-2xl text-slate-900 dark:text-slate-100" style={{ fontWeight: 700 }}>
                {analysis.confidenceScore}%
              </div>
            </div>
            {/* Risks Found */}
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.risksFound}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl text-red-500 dark:text-red-400" style={{ fontWeight: 700 }}>
                  {totalRisks}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  ({highRiskCount} {t.high})
                </span>
              </div>
            </div>
            {/* Language */}
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.language}</div>
              <div className="text-2xl text-slate-900 dark:text-slate-100" style={{ fontWeight: 700 }}>
                {langNames[targetLanguage] || "English"}
              </div>
            </div>
            {/* Loopholes */}
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t.loopholes}</div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl text-emerald-500 dark:text-emerald-400" style={{ fontWeight: 700 }}>
                  0
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500">{t.none}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simplified View - Summary */}
        <div className="border-b border-slate-200 dark:border-white/10 bg-emerald-50/50 dark:bg-emerald-500/5 px-4 py-4 md:px-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🧒</span>
            <h3
              className="text-sm uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-400"
              style={{ fontWeight: 800 }}
            >
              {t.simplifiedView}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {analysis.summary}
          </p>
        </div>

        {/* Loopholes & Hidden Traps */}
        <div className="border-b border-slate-200 dark:border-white/10 bg-amber-50/30 dark:bg-amber-500/5 px-4 py-5 md:px-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">⚡</span>
            <h3
              className="text-base md:text-lg text-slate-900 dark:text-slate-100"
              style={{ fontWeight: 700 }}
            >
              {t.loopholesTraps}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.risks.map((risk, idx) => {
              const badgeColor =
                risk.level === "high"
                  ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30"
                  : risk.level === "medium"
                  ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
                  : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30";
              const badgeLabel =
                risk.level === "high" ? t.highRiskLabel : risk.level === "medium" ? t.mediumRiskLabel : t.lowRiskLabel;
              const cardBorder =
                risk.level === "high"
                  ? "border-red-200 dark:border-red-500/20"
                  : risk.level === "medium"
                  ? "border-amber-200 dark:border-amber-500/20"
                  : "border-emerald-200 dark:border-emerald-500/20";

              return (
                <div
                  key={risk.id}
                  className={`rounded-xl border ${cardBorder} bg-white dark:bg-[#1E293B] p-4 flex flex-col gap-3 shadow-sm`}
                >
                  {/* Header: TRAP #N + Badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400"
                      style={{ fontWeight: 700 }}
                    >
                      TRAP #{idx + 1}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] ${badgeColor}`}
                      style={{ fontWeight: 700 }}
                    >
                      {badgeLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug" style={{ fontWeight: 600 }}>
                    {risk.title}
                  </p>

                  {/* Evidence */}
                  <div>
                    <div
                      className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1"
                      style={{ fontWeight: 700 }}
                    >
                      {t.evidenceFromDocument}
                    </div>
                    <p className="text-xs italic text-slate-500 dark:text-slate-400 leading-relaxed">
                      &ldquo;{risk.description}&rdquo;
                    </p>
                  </div>

                  {/* View in Document */}
                  {canViewInDocument && (
                    <button
                      onClick={() => onViewInDocument(risk.id)}
                      data-export-hidden="true"
                      className="mt-auto text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-center py-1.5 border-t border-slate-100 dark:border-white/10"
                      style={{ fontWeight: 700 }}
                    >
                      {t.viewInDocument} →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-World Consequences */}
        <div className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F172A] px-4 py-4 md:px-6">
          <h3
            className="text-base md:text-lg text-slate-900 dark:text-slate-100 mb-3"
            style={{ fontWeight: 700 }}
          >
            {t.realWorldConsequences}
          </h3>
          <div className="space-y-2">
            {analysis.consequences.map((consequence) => (
              <div
                key={consequence}
                className="rounded-lg bg-amber-50/60 dark:bg-amber-500/5 border-l-4 border-amber-400 dark:border-amber-500/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-300"
              >
                {consequence}
              </div>
            ))}
          </div>
        </div>

        {/* Risk Breakdown Accordion */}
        <div className="p-4 md:p-6 bg-white dark:bg-[#0F172A]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base md:text-lg text-slate-900 dark:text-slate-100" style={{ fontWeight: 600 }}>
              {t.riskBreakdown}
            </h3>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              {t.priorityNote}
            </div>
          </div>
          <RiskCategoryAccordion
            categories={riskCategories}
            onViewInDocument={onViewInDocument}
            canViewInDocument={canViewInDocument}
            forceExpandAll={exportMode}
            targetLanguage={targetLanguage}
          />
        </div>
      </div>
    </div>
  );
}
