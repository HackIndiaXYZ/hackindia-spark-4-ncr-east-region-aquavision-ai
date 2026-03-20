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
  const config = {
    low: {
      icon: CheckCircle,
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-900",
      label: targetLanguage === "hi" ? "कम जोखिम" : "LOW RISK",
      message: targetLanguage === "hi" ? "यह अनुबंध मामूली चिंताओं के साथ अपेक्षाकृत सुरक्षित प्रतीत होता है।" : "This contract appears relatively safe with minor concerns.",
    },
    medium: {
      icon: AlertTriangle,
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconColor: "text-amber-600",
      textColor: "text-amber-900",
      label: targetLanguage === "hi" ? "मध्यम जोखिम" : "MEDIUM RISK",
      message: targetLanguage === "hi" ? "इस अनुबंध में मध्यम चिंताएं हैं जिनकी समीक्षा की जानी चाहिए।" : "This contract has moderate concerns that should be reviewed.",
    },
    high: {
      icon: ShieldAlert,
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-900",
      label: targetLanguage === "hi" ? "उच्च जोखिम" : "HIGH RISK",
      message: targetLanguage === "hi" ? "इस अनुबंध में महत्वपूर्ण जोखिम हैं जिन पर तुरंत ध्यान देने की आवश्यकता है।" : "This contract has significant risks that need immediate attention.",
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
          {targetLanguage === "hi" ? "यह अनुबंध कितना जोखिम भरा है?" : "How Risky is This Contract?"}
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
          {targetLanguage === "hi" ? "अधिक स्कोर = अधिक जोखिम" : "Higher score = more risk"}
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
            {targetLanguage === "hi" ? "मुख्य चिंताएं:" : "Key concerns:"}
          </strong>{" "}
          <span style={{ fontWeight: 500 }}>{primaryIssues.join(", ")}</span>
        </div>
      )}
    </div>
  );
}
