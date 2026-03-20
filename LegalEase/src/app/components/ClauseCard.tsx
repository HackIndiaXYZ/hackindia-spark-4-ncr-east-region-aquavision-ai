import { ExternalLink, AlertCircle } from "lucide-react";

interface ClauseCardProps {
  id: string;
  title: string;
  description: string;
  consequence?: string;
  technicalDetails?: string;
  severity: "critical" | "moderate" | "informational";
  onViewInDocument: (id: string) => void;
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
  delay = 0,
  targetLanguage = "en",
}: ClauseCardProps) {
  const getStr = (en: string, hi: string, hinglish: string, gu: string, ta: string, te: string) => {
    if (targetLanguage === 'hi') return hi;
    if (targetLanguage === 'hinglish') return hinglish;
    if (targetLanguage === 'gu') return gu;
    if (targetLanguage === 'ta') return ta;
    if (targetLanguage === 'te') return te;
    return en;
  };

  const t = {
    whatThisMeans: getStr("What this means:", "इसका क्या मतलब है:", "इसका क्या मतलब है:", "આનો અર્થ શું છે:", "இதன் பொருள் என்ன:", "దీని అర్థం ఏమిటి:"),
    warning: getStr("Warning: Real-world consequence", "चेतावनी: वास्तविक दुनिया का परिणाम", "चेतावनी: वास्तविक दुनिया का परिणाम", "ચેતવણી: વાસ્તવિક દુનિયાનું પરિણામ", "எச்சரிக்கை: நிஜ உலக விளைவு", "హెచ్చరిక: వాస్తవ ప్రపంచ పరిణామం"),
    technical: getStr("Technical:", "तकनीकी:", "तकनीकी:", "તકનીકી:", "தொழில்நுட்பம்:", "సాంకేతిక:"),
    viewInDoc: getStr("View in Document", "दस्तावेज़ में देखें", "दस्तावेज़ में देखें", "દસ્તાવેજમાં જુઓ", "ஆவணத்தில் காண்க", "పత్రంలో చూడండి")
  };

  const severityConfig = {
    critical: {
      border: "border-l-[#ef4444]",
      badge: "bg-red-100 text-[#ef4444]",
      label: getStr("Critical Risk", "महत्वपूर्ण जोखिम", "महत्वपूर्ण जोखिम", "ગંભીર જોખમ", "முக்கியமான அபாயம்", "క్లిష్టమైన ప్రమాదం"),
      icon: "🔴",
      iconBg: "bg-red-100",
    },
    moderate: {
      border: "border-l-[#f59e0b]",
      badge: "bg-amber-100 text-[#f59e0b]",
      label: getStr("Moderate Risk", "मध्यम जोखिम", "मध्यम जोखिम", "મધ્યમ જોખમ", "மிதமான அபாயம்", "మితమైన ప్రమాదం"),
      icon: "🟡",
      iconBg: "bg-amber-100",
    },
    informational: {
      border: "border-l-[#3b82f6]",
      badge: "bg-blue-100 text-[#3b82f6]",
      label: getStr("Review Recommended", "समीक्षा की सिफारिश की गई", "समीक्षा की सिफारिश की गई", "સમીક્ષાની ભલામણ કરવામાં આવે છે", "மதிப்பாய்வு பரிந்துரைக்கப்படுகிறது", "సమీక్ష సిఫార్సు చేయబడింది"),
      icon: "🟢",
      iconBg: "bg-blue-100",
    },
  };

  const config = severityConfig[severity];

  return (
    <div
      id={`risk-${id}`}
      className={`rounded-xl border-l-4 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${config.border}`}
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
            <h4 className="flex-1 leading-snug" style={{ fontWeight: 600 }}>
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
      <div className="mb-3 rounded-md bg-gray-50 p-3">
        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <AlertCircle className="h-3.5 w-3.5" />
          <span style={{ fontWeight: 600 }}>
            {t.whatThisMeans}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{description}</p>
      </div>

      {consequence && (
        <div className="mb-4 mt-2 overflow-hidden rounded-md border border-amber-200 bg-gradient-to-r from-amber-500/10 to-amber-500/5 shadow-sm">
          <div className="flex items-start gap-2.5 p-3">
            <span className="mt-0.5 text-base leading-none">⚠️</span>
            <div>
              <span className="mb-1 block text-[10px] uppercase tracking-wider text-amber-900" style={{ fontWeight: 800 }}>
                {t.warning}
              </span>
              <p className="text-sm text-amber-950" style={{ fontWeight: 500 }}>
                {consequence}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Technical details SECOND (if provided) */}
      {technicalDetails && (
        <div className="mb-3 text-xs text-muted-foreground">
          <span style={{ fontWeight: 600 }}>
            {t.technical}
          </span> {technicalDetails}
        </div>
      )}

      {/* Action button */}
      <button
        onClick={() => onViewInDocument(id)}
        className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-[#4f46e5] transition-all hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2"
        style={{ fontWeight: 600 }}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        {t.viewInDoc}
      </button>
    </div>
  );
}
