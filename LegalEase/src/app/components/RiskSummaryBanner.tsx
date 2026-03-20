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
      className={`${style.bg} ${style.border} border-l-4 p-4 md:p-5`}
      style={{
        animation: "slideDown 0.4s ease-out",
      }}
    >
      <div className="flex items-start gap-3 md:gap-4">
        <Icon className={`h-6 w-6 flex-shrink-0 ${style.iconColor} md:h-7 md:w-7`} />
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className={`text-xs ${style.textColor}`}
              style={{ fontWeight: 700, letterSpacing: "0.05em" }}
            >
              {style.label}
            </span>
            <span className={`text-xl ${style.iconColor}`} style={{ fontWeight: 700 }}>
              {riskScore}/100
            </span>
          </div>
          <p className={`mb-2 ${style.textColor}`} style={{ fontWeight: 600 }}>
            {style.message}
          </p>
          {primaryIssues.length > 0 && (
            <p className={`text-sm ${style.textColor}`}>
              <strong>Key concerns:</strong> {primaryIssues.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
