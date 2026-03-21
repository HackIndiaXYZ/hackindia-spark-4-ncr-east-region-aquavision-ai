import { ExternalLink, AlertCircle } from "lucide-react";

interface ClauseCardProps {
  id: string;
  title: string;
  description: string;
  consequence?: string;
  technicalDetails?: string;
  severity: "critical" | "moderate" | "informational";
  onViewInDocument: (id: string) => void;
  canViewInDocument?: boolean;
  delay?: number;
  targetLanguage?: string;
}

export function ClauseCard({
  id,
  title,
  description,
  consequence,
  technicalDetails,
  severity,
  onViewInDocument,
  canViewInDocument = false,
  delay = 0,
  targetLanguage = "en",
}: ClauseCardProps) {
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
    whatThisMeans: getStr("What this means:", "इसका क्या मतलब है:", "Iska kya matlab hai:", "આનો અર્થ શું છે:", "இதன் பொருள் என்ன:", "దీని అర్థం ఏమిటి:", "याचा अर्थ काय:"),
    warning: getStr("Warning: Real-world consequence", "चेतावनी: वास्तविक दुनिया का परिणाम", "Warning: Asli duniya mein asar", "ચેતવણી: વાસ્તવિક દુનિયાનું પરિણામ", "எச்சரிக்கை: நிஜ உலக விளைவு", "హెచ్చరిక: వాస్తవ ప్రపంచ పరిణామం", "इशारा: प्रत्यक्ष परिणाम"),
    technical: getStr("Technical:", "तकनीकी:", "Technical:", "તકનીકી:", "தொழில்நுட்பம்:", "సాంకేతిక:", "तांत्रिक:"),
    viewInDoc: getStr("View in Document", "दस्तावेज़ में देखें", "Document mein dekho", "દસ્તાવેજમાં જુઓ", "ஆவணத்தில் காண்க", "పత్రంలో చూడండి", "दस्तऐवजात पहा")
  };

  const severityConfig = {
    critical: {
      border: "border-l-red-500",
      badge: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
      label: getStr("Critical Risk", "महत्वपूर्ण जोखिम", "Critical Risk", "ગંભીર જોખમ", "முக்கியமான அபாயம்", "క్లిష్టమైన ప్రమాదం", "गंभीर जोखीम"),
      icon: "🔴",
      iconBg: "bg-red-50 dark:bg-red-500/10 shadow-none dark:shadow-[0_0_15px_rgba(239,68,68,0.2)]",
    },
    moderate: {
      border: "border-l-amber-500",
      badge: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      label: getStr("Moderate Risk", "मध्यम जोखिम", "Moderate Risk", "મધ્યમ જોખમ", "மிதமான அபாயம்", "మితమైన ప్రమాదం", "मध्यम जोखीम"),
      icon: "🟡",
      iconBg: "bg-amber-50 dark:bg-amber-500/10 shadow-none dark:shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    },
    informational: {
      border: "border-l-blue-500",
      badge: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      label: getStr("Review Recommended", "समीक्षा की सिफारिश की गई", "Review Karna Recommended Hai", "સમીક્ષાની ભલામણ કરવામાં આવે છે", "மதிப்பாய்வு பரிந்துரைக்கப்படுகிறது", "సమీక్ష సిఫార్సు చేయబడింది", "पुनरावलोकन सुचवले आहे"),
      icon: "🟢",
      iconBg: "bg-blue-50 dark:bg-blue-500/10 shadow-none dark:shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    },
  };

  const config = severityConfig[severity];

  return (
    <div
      id={`risk-${id}`}
      className={`rounded-xl border-y border-r border-y-border border-r-border dark:border-y-white/5 dark:border-r-white/5 border-l-4 bg-white dark:bg-[#0F172A]/80 p-5 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${config.border}`}
      style={{
        animation: `slideInRight 0.4s ease-out ${delay}ms both`,
      }}
    >
      {/* Header with icon and badge */}
      <div className="mb-3 flex items-start gap-3">
        <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg} text-xl`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h4 className="flex-1 leading-snug text-slate-800 dark:text-slate-200" style={{ fontWeight: 600 }}>
              {title}
            </h4>
            <span
              className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs ${config.badge}`}
              style={{ fontWeight: 600 }}
            >
              {config.label}
            </span>
          </div>
        </div>
      </div>

      {/* Simple explanation FIRST */}
      <div className="mb-3 rounded-md bg-slate-50 dark:bg-[#0B0F19]/50 p-3 border border-border dark:border-white/5">
        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground dark:text-slate-400">
          <AlertCircle className="h-3.5 w-3.5" />
          <span style={{ fontWeight: 600 }}>
            {t.whatThisMeans}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{description}</p>
      </div>

      {consequence && (
        <div className="mb-4 mt-2 overflow-hidden rounded-md border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-amber-500/5 shadow-[0_4px_15px_rgba(245,158,11,0.05)]">
          <div className="flex items-start gap-2.5 p-3">
            <span className="mt-0.5 text-base leading-none">⚠️</span>
            <div>
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-500" style={{ fontWeight: 800 }}>
                {t.warning}
              </span>
              <p className="text-sm text-amber-900 dark:text-amber-100" style={{ fontWeight: 500 }}>
                {consequence}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Technical details SECOND (if provided) */}
      {technicalDetails && (
        <div className="mb-3 text-xs text-muted-foreground dark:text-slate-400">
          <span style={{ fontWeight: 600 }}>
            {t.technical}
          </span> {technicalDetails}
        </div>
      )}

      {canViewInDocument && (
        <button
          onClick={() => onViewInDocument(id)}
          data-export-hidden="true"
          className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-indigo-600 dark:text-violet-400 transition-all hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-violet-500/10 dark:hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-[#0B0F19]"
          style={{ fontWeight: 600 }}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t.viewInDoc}
        </button>
      )}
    </div>
  );
}
