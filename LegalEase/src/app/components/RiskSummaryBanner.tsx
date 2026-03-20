import { AlertTriangle, ShieldAlert, CheckCircle } from "lucide-react";

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
  const getStr = (en: string, hi: string, hinglish: string, gu: string, ta: string, te: string) => {
    if (targetLanguage === 'hi') return hi;
    if (targetLanguage === 'hinglish') return hinglish;
    if (targetLanguage === 'gu') return gu;
    if (targetLanguage === 'ta') return ta;
    if (targetLanguage === 'te') return te;
    return en;
  };

  const t = {
    heroQuestion: getStr("How Risky is This Contract?", "यह अनुबंध कितना जोखिम भरा है?", "यह अनुबंध कितना जोखिम भरा है?", "આ કરાર કેટલો જોખમી છે?", "இந்த ஒப்பந்தம் எவ்வளவு ஆபத்தானது?", "ఈ ఒప్పందం ఎంత ప్రమాదకరం?"),
    scoreSubtext: getStr("Higher score = more risk", "अधिक स्कोर = अधिक जोखिम", "अधिक स्कोर = अधिक जोखिम", "ઉચ્ચ સ્કોર = વધુ જોખમ", "அதிக மதிப்பெண் = அதிக அபாயம்", "అధిక స్కోరు = అధిక ప్రమాదం"),
    keyConcerns: getStr("Key concerns:", "मुख्य चिंताएं:", "मुख्य चिंताएं:", "મુખ્ય ચિંતાઓ:", "முக்கிய கவலைகள்:", "ముఖ్య ఆందోళనలు:")
  };

  const config = {
    low: {
      icon: CheckCircle,
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-900",
      label: getStr("LOW RISK", "कम जोखिम", "कम जोखिम", "ઓછું જોખમ", "குறைந்த அபாயம்", "తక్కువ ప్రమాదం"),
      message: getStr("This contract appears relatively safe with minor concerns.", "यह अनुबंध मामूली चिंताओं के साथ अपेक्षाकृत सुरक्षित प्रतीत होता है।", "यह अनुबंध मामूली चिंताओं के साथ अपेक्षाकृत सुरक्षित प्रतीत होता है।", "આ કરાર નાની ચિંતાઓ સાથે પ્રમાણમાં સુરક્ષિત જણાય છે.", "இந்த ஒப்பந்தம் ஒப்பீட்டளவில் பாதுகாப்பானதாகத் தெரிகிறது.", "ఈ ఒప్పందం సాపేక్షంగా సురక్షితంగా ఉన్నట్లు కనిపిస్తోంది."),
    },
    medium: {
      icon: AlertTriangle,
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconColor: "text-amber-600",
      textColor: "text-amber-900",
      label: getStr("MEDIUM RISK", "मध्यम जोखिम", "मध्यम जोखिम", "મધ્યમ જોખમ", "மிதமான அபாயம்", "మితమైన ప్రమాదం"),
      message: getStr("This contract has moderate concerns that should be reviewed.", "इस अनुबंध में मध्यम चिंताएं हैं जिनकी समीक्षा की जानी चाहिए।", "इस अनुबंध में मध्यम चिंताएं हैं जिनकी समीक्षा की जानी चाहिए।", "આ કરારમાં મધ્યમ ચિંતાઓ છે.", "இந்த ஒப்பந்தத்தில் மிதமான கவலைகள் உள்ளன, அவை மதிப்பாய்வு செய்யப்பட வேண்டும்.", "ఈ ఒప్పందంలో కొన్ని మితమైన ఆందోళనలు ఉన్నాయి."),
    },
    high: {
      icon: ShieldAlert,
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-900",
      label: getStr("HIGH RISK", "उच्च जोखिम", "उच्च जोखिम", "ઉચ્ચ જોખમ", "உயர் அபாயம்", "అధిక ప్రమాదం"),
      message: getStr("This contract has significant risks that need immediate attention.", "इस अनुबंध में महत्वपूर्ण जोखिम हैं जिन पर तुरंत ध्यान देने की आवश्यकता है।", "इस अनुबंध में महत्वपूर्ण जोखिम हैं जिन पर तुरंत ध्यान देने की आवश्यकता है।", "આ કરારમાં નોંધપાત્ર જોખમો છે.", "இந்த ஒப்பந்தத்தில் குறிப்பிடத்தக்க அபாயங்கள் உள்ளன, அவை உடனடியாக கவனிக்கப்பட வேண்டும்.", "ఈ ఒప్పందంలో వెంటనే గమనించాల్సిన ముఖ్యమైన ప్రమాదాలు ఉన్నాయి."),
    },
  };

  const style = config[riskLevel];
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border-b-4 flex flex-col items-center justify-center p-6 text-center md:p-8`}
      style={{
        animation: "slideDown 0.4s ease-out",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${style.iconColor}`} />
        <span
          className={`text-sm uppercase tracking-[0.1em] ${style.textColor}`}
          style={{ fontWeight: 800 }}
        >
          {t.heroQuestion}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div
          className={`mt-3 text-6xl md:text-7xl tracking-tighter ${style.iconColor}`}
          style={{ fontWeight: 900 }}
        >
          {riskScore}
          <span className="text-3xl opacity-50 md:text-4xl">/100</span>
        </div>
        <span className={`text-xs mt-1 mb-3 opacity-80 ${style.textColor}`}>
          {t.scoreSubtext}
        </span>
      </div>

      <div
        className={`mb-4 inline-block rounded-full px-4 py-1 text-sm ${style.bg} border ${style.border} ${style.textColor}`}
        style={{ fontWeight: 700, letterSpacing: "0.05em" }}
      >
        {style.label}
      </div>

      <p className={`mb-3 max-w-md ${style.textColor}`} style={{ fontWeight: 500 }}>
        {style.message}
      </p>

      {primaryIssues.length > 0 && (
        <div className={`mt-2 rounded-lg bg-white/50 px-4 py-3 text-sm shadow-sm backdrop-blur-sm ${style.textColor}`}>
          <strong style={{ fontWeight: 700 }}>
            {t.keyConcerns}
          </strong>{" "}
          <span style={{ fontWeight: 500 }}>{primaryIssues.join(", ")}</span>
        </div>
      )}
    </div>
  );
}
