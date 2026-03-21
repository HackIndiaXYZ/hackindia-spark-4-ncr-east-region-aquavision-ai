import { CheckCircle } from "lucide-react";

interface RiskSummaryBannerProps {
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  primaryIssues: string[];
  targetLanguage?: string;
}

export function RiskSummaryBanner({
  riskLevel,
  riskScore,
  primaryIssues,
  targetLanguage = "en",
}: RiskSummaryBannerProps) {
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
    overallRiskScore: getStr("OVERALL RISK SCORE", "कुल जोखिम स्कोर", "OVERALL RISK SCORE", "એકંદર જોખમ સ્કોર", "ஒட்டுமொத்த அபாய மதிப்பெண்", "మొత్తం ప్రమాద స్కోరు", "एकूण जोखीम स्कोर"),
    low: getStr("LOW", "कम", "LOW", "ઓછું", "குறைவு", "తక్కువ", "कमी"),
    high: getStr("HIGH", "उच्च", "HIGH", "ઉચ્ચ", "உயர்", "అధిక", "उच्च"),
    score: getStr("S C O R E", "स्कोर", "S C O R E", "સ્કોર", "மதிப்பெண்", "స్కోరు", "स्कोर"),
    keyConcerns: getStr("Key concerns:", "मुख्य चिंताएं:", "Main concerns:", "મુખ્ય ચિંતાઓ:", "முக்கிய கவலைகள்:", "ముఖ్య ఆందోళనలు:", "मुख्य चिंता:"),
  };

  const config = {
    low: {
      label: getStr("LOW RISK", "कम जोखिम", "KAM RISK", "ઓછું જોખમ", "குறைந்த அபாயம்", "తక్కువ ప్రమాదం", "कमी जोखीम"),
      message: getStr("This contract appears relatively safe with minor concerns.", "यह अनुबंध मामूली चिंताओं के साथ अपेक्षाकृत सुरक्षित प्रतीत होता है।", "Yeh contract kaafi had tak safe lag raha hai.", "આ કરાર પ્રમાણમાં સુરક્ષિત જણાય છે.", "இந்த ஒப்பந்தம் ஒப்பீட்டளவில் பாதுகாப்பானது.", "ఈ ఒప్పందం సాపేక్షంగా సురక్షితంగా ఉన్నట్లు కనిపిస్తోంది.", "हा करार तुलनेने सुरक्षित दिसतो."),
      color: "#10b981",
    },
    medium: {
      label: getStr("MEDIUM RISK", "मध्यम जोखिम", "MEDIUM RISK", "મધ્યમ જોખમ", "மிதமான அபாயம்", "మితమైన ప్రమాదం", "मध्यम जोखीम"),
      message: getStr("This contract has moderate concerns that should be reviewed.", "इस अनुबंध में मध्यम चिंताएं हैं जिनकी समीक्षा की जानी चाहिए।", "Is contract mein kuch concerns hain.", "આ કરારમાં મધ્યમ ચિંતાઓ છે.", "இந்த ஒப்பந்தத்தில் மிதமான கவலைகள் உள்ளன.", "ఈ ఒప్పందంలో మితమైన ఆందోళనలు ఉన్నాయి.", "या करारात मध्यम चिंता आहेत."),
      color: "#f59e0b",
    },
    high: {
      label: getStr("HIGH RISK", "उच्च जोखिम", "HIGH RISK", "ઉચ્ચ જોખમ", "உயர் அபாயம்", "అధిక ప్రమాదం", "उच्च जोखीम"),
      message: getStr("This contract has significant risks that need immediate attention.", "इस अनुबंध में महत्वपूर्ण जोखिम हैं।", "Is contract mein bade risks hain.", "આ કરારમાં નોંધપાત્ર જોખમો છે.", "இந்த ஒப்பந்தத்தில் குறிப்பிடத்தக்க அபாயங்கள் உள்ளன.", "ఈ ఒప్పందంలో ముఖ్యమైన ప్రమాదాలు ఉన్నాయి.", "या करारात महत्त्वाच्या जोखमी आहेत."),
      color: "#ef4444",
    },
  };

  const style = config[riskLevel];

  // Semi-circular gauge SVG values
  const radius = 80;
  const strokeWidth = 16;
  const circumference = Math.PI * radius; // half-circle
  const scorePercent = Math.min(Math.max(riskScore, 0), 100) / 100;
  const dashOffset = circumference * (1 - scorePercent);

  // Gradient stop color based on score
  const gradientEnd = riskScore > 66 ? "#ef4444" : riskScore > 33 ? "#f59e0b" : "#10b981";

  const bgTint = riskLevel === "low"
    ? "bg-emerald-50 dark:bg-emerald-500/5"
    : riskLevel === "medium"
    ? "bg-amber-50 dark:bg-amber-500/5"
    : "bg-red-50 dark:bg-red-500/5";

  return (
    <div
      className={`flex flex-col items-center justify-center ${bgTint} p-6 md:p-8 text-center`}
      style={{ animation: "slideDown 0.4s ease-out" }}
    >
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-emerald-500" />
        <span
          className="text-sm uppercase tracking-[0.15em] text-slate-700 dark:text-slate-300"
          style={{ fontWeight: 800 }}
        >
          {t.overallRiskScore}
        </span>
      </div>

      {/* Semi-circular Gauge */}
      <div className="relative" style={{ width: 220, height: 130 }}>
        <svg
          width="220"
          height="130"
          viewBox="0 0 220 130"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {/* Background track */}
          <path
            d={`M ${110 - radius} 110 A ${radius} ${radius} 0 0 1 ${110 + radius} 110`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="dark:stroke-slate-700"
          />
          {/* Filled arc */}
          <path
            d={`M ${110 - radius} 110 A ${radius} ${radius} 0 0 1 ${110 + radius} 110`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>
        {/* Score Number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <div className="flex items-baseline">
            <span
              className="text-5xl md:text-6xl tracking-tight"
              style={{ fontWeight: 800, color: style.color }}
            >
              {riskScore}
            </span>
            <span className="text-xl md:text-2xl text-slate-400 dark:text-slate-500" style={{ fontWeight: 500 }}>
              /100
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 mt-0.5">
            {t.score}
          </span>
        </div>
      </div>

      {/* LOW / HIGH labels */}
      <div className="flex w-[220px] justify-between px-2 -mt-1 mb-3">
        <span className="text-[11px] text-slate-400 dark:text-slate-500" style={{ fontWeight: 600 }}>
          {t.low}
        </span>
        <span className="text-[11px] text-slate-400 dark:text-slate-500" style={{ fontWeight: 600 }}>
          {t.high}
        </span>
      </div>

      {/* Risk level badge */}
      <div
        className="mb-3 inline-block rounded-md border border-slate-200 dark:border-slate-600 bg-white dark:bg-[#1E293B] px-5 py-1.5 text-sm"
        style={{ fontWeight: 800, letterSpacing: "0.05em", color: style.color }}
      >
        {style.label}
      </div>

      {/* Message */}
      <p className="mb-3 max-w-md text-sm text-slate-600 dark:text-slate-400" style={{ fontWeight: 500 }}>
        {style.message}
      </p>

      {/* Key Concerns pill */}
      {primaryIssues.length > 0 && (
        <div
          className={`mt-3 rounded-xl border-l-4 px-5 py-3 max-w-lg shadow-sm ${
            riskLevel === "low"
              ? "border-l-emerald-500 bg-white dark:bg-[#1E293B] border border-l-4 border-emerald-200 dark:border-emerald-500/20"
              : riskLevel === "medium"
              ? "border-l-amber-500 bg-white dark:bg-[#1E293B] border border-l-4 border-amber-200 dark:border-amber-500/20"
              : "border-l-red-500 bg-white dark:bg-[#1E293B] border border-l-4 border-red-200 dark:border-red-500/20"
          }`}
        >
          <span className="text-sm">
            <strong className="text-slate-800 dark:text-slate-200" style={{ fontWeight: 700 }}>{t.keyConcerns}</strong>{" "}
            <span className="text-slate-600 dark:text-slate-400">
              {primaryIssues.join(", ")}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
