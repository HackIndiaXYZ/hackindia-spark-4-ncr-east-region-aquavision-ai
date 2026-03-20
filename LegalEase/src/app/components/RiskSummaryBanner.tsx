import { AlertTriangle, ShieldAlert, CheckCircle } from "lucide-react";

interface RiskSummaryBannerProps {
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  primaryIssues: string[];
}

export function RiskSummaryBanner({
  riskLevel,
  riskScore,
  primaryIssues,
}: RiskSummaryBannerProps) {
  const config = {
    low: {
      icon: CheckCircle,
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
      textColor: "text-green-900",
      label: "LOW RISK",
      message: "This contract appears relatively safe with minor concerns.",
    },
    medium: {
      icon: AlertTriangle,
      bg: "bg-amber-50",
      border: "border-amber-200",
      iconColor: "text-amber-600",
      textColor: "text-amber-900",
      label: "MEDIUM RISK",
      message: "This contract has moderate concerns that should be reviewed.",
    },
    high: {
      icon: ShieldAlert,
      bg: "bg-red-50",
      border: "border-red-200",
      iconColor: "text-red-600",
      textColor: "text-red-900",
      label: "HIGH RISK",
      message: "This contract has significant risks that need immediate attention.",
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
          className={`text-xs uppercase tracking-[0.15em] ${style.textColor}`}
          style={{ fontWeight: 800 }}
        >
          Overall Risk Score
        </span>
      </div>

      <div
        className={`my-2 text-6xl md:text-7xl tracking-tighter ${style.iconColor}`}
        style={{ fontWeight: 900 }}
      >
        {riskScore}
        <span className="text-3xl opacity-50 md:text-4xl">/100</span>
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
          <strong style={{ fontWeight: 700 }}>Key concerns:</strong>{" "}
          <span style={{ fontWeight: 500 }}>{primaryIssues.join(", ")}</span>
        </div>
      )}
    </div>
  );
}
