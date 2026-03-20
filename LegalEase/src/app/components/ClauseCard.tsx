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
}: ClauseCardProps) {
  const severityConfig = {
    critical: {
      border: "border-l-[#ef4444]",
      badge: "bg-red-100 text-[#ef4444]",
      label: "Critical Risk",
      icon: "🔴",
      iconBg: "bg-red-100",
    },
    moderate: {
      border: "border-l-[#f59e0b]",
      badge: "bg-amber-100 text-[#f59e0b]",
      label: "Moderate Risk",
      icon: "🟡",
      iconBg: "bg-amber-100",
    },
    informational: {
      border: "border-l-[#3b82f6]",
      badge: "bg-blue-100 text-[#3b82f6]",
      label: "Review Recommended",
      icon: "🟢",
      iconBg: "bg-blue-100",
    },
  };

  const config = severityConfig[severity];

  return (
    <div
      id={`risk-${id}`}
      className={`rounded-lg border-l-4 bg-white p-4 shadow-sm transition-all hover:shadow-md ${config.border}`}
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
          <span style={{ fontWeight: 600 }}>What this means:</span>
        </div>
        <p className="text-sm leading-relaxed">{description}</p>
      </div>

      {consequence && (
        <div className="mb-3 rounded-md border border-amber-100 bg-amber-50 p-3 text-sm text-amber-950">
          <span style={{ fontWeight: 600 }}>Real-world impact:</span>{" "}
          {consequence}
        </div>
      )}

      {/* Technical details SECOND (if provided) */}
      {technicalDetails && (
        <div className="mb-3 text-xs text-muted-foreground">
          <span style={{ fontWeight: 600 }}>Technical:</span> {technicalDetails}
        </div>
      )}

      {/* Action button */}
      <button
        onClick={() => onViewInDocument(id)}
        className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-[#4f46e5] transition-all hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2"
        style={{ fontWeight: 600 }}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        View in Document
      </button>
    </div>
  );
}
