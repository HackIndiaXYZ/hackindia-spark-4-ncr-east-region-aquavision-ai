import { useEffect, useState } from "react";

interface RiskIndicatorBarProps {
  score: number; // 0-100
  animate?: boolean;
}

export function RiskIndicatorBar({ score, animate = false }: RiskIndicatorBarProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (animate) {
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const increment = score / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setDisplayScore(Math.min(Math.round(currentStep * increment), score));
        
        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [score, animate]);

  // Calculate position (0-100%)
  const position = displayScore;

  // Determine which zone the score falls into
  let zoneLabel = "Low Risk";
  let zoneColor = "bg-[#10b981]";
  let zoneBadgeColor = "bg-green-100 text-green-700";
  
  if (displayScore > 66) {
    zoneLabel = "High Risk";
    zoneColor = "bg-[#ef4444]";
    zoneBadgeColor = "bg-red-100 text-red-700";
  } else if (displayScore > 33) {
    zoneLabel = "Medium Risk";
    zoneColor = "bg-[#f59e0b]";
    zoneBadgeColor = "bg-amber-100 text-amber-700";
  }

  return (
    <div className="space-y-4">
      {/* Score Display */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Overall Risk Score</div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-3xl md:text-4xl"
              style={{ 
                fontWeight: 700,
                color: displayScore > 66 ? "#ef4444" : displayScore > 33 ? "#f59e0b" : "#10b981"
              }}
            >
              {displayScore}
            </span>
            <span className="text-lg text-muted-foreground">/100</span>
          </div>
        </div>
        <div
          className={`rounded-full px-4 py-2 ${zoneBadgeColor}`}
          style={{ fontWeight: 600 }}
        >
          {zoneLabel}
        </div>
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-xs text-muted-foreground md:text-sm">
        <span style={{ fontWeight: 500 }}>0 - Low</span>
        <span style={{ fontWeight: 500 }}>33 - Medium</span>
        <span style={{ fontWeight: 500 }}>66 - High</span>
      </div>

      {/* Gradient Bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
        {/* Animated gradient fill */}
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${position}%`,
            background: position > 66 
              ? "linear-gradient(to right, #f59e0b 0%, #ef4444 100%)"
              : position > 33
              ? "linear-gradient(to right, #10b981 0%, #f59e0b 100%)"
              : "#10b981",
          }}
        />

        {/* Marker */}
        {displayScore > 0 && (
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-500"
            style={{ left: `${position}%` }}
          >
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full border-3 border-white ${zoneColor} shadow-lg`}
            >
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
