import { useEffect, useState } from "react";

interface RiskIndicatorBarProps {
  score: number; // 0-100
  animate?: boolean;
  targetLanguage?: string;
}

export function RiskIndicatorBar({ score, animate = false, targetLanguage = "en" }: RiskIndicatorBarProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

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
    overallRisk: getStr("Overall Risk Score", "कुल जोखिम स्कोर", "Overall Risk Score", "એકંદર જોખમ સ્કોર", "ஒட்டுமொத்த அபாய மதிப்பெண்", "మొత్తం ప్రమాద స్కోరు", "एकूण जोखीम स्कोर"),
    lowRisk: getStr("Low Risk", "कम जोखिम", "Kam Risk", "ઓછું જોખમ", "குறைந்த அபாயம்", "తక్కువ ప్రమాదం", "कमी जोखीम"),
    mediumRisk: getStr("Medium Risk", "मध्यम जोखिम", "Medium Risk", "મધ્યમ જોખમ", "மிதமான அபாயம்", "మితమైన ప్రమాదం", "मध्यम जोखीम"),
    highRisk: getStr("High Risk", "उच्च जोखिम", "High Risk", "ઉચ્ચ જોખમ", "உயர் அபாயம்", "అధిక ప్రమాదం", "उच्च जोखीम"),
    low: getStr("Low", "कम", "Kam", "ઓછું", "குறைவு", "తక్కువ", "कमी"),
    medium: getStr("Medium", "मध्यम", "Medium", "મધ્યમ", "நடுத்தரம்", "మధ్యస్థం", "मध्यम"),
    high: getStr("High", "उच्च", "High", "ઉચ્ચ", "உயர்", "అధిక", "उच्च"),
  };

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
  let zoneLabel = t.lowRisk;
  let zoneColor = "bg-[#10b981]";
  let zoneBadgeColor = "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30";
  
  if (displayScore > 66) {
    zoneLabel = t.highRisk;
    zoneColor = "bg-[#ef4444]";
    zoneBadgeColor = "bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30";
  } else if (displayScore > 33) {
    zoneLabel = t.mediumRisk;
    zoneColor = "bg-[#f59e0b]";
    zoneBadgeColor = "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30";
  }

  return (
    <div className="space-y-4">
      {/* Score Display */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 text-xs text-muted-foreground dark:text-slate-400">{t.overallRisk}</div>
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
            <span className="text-lg text-muted-foreground dark:text-slate-500">/100</span>
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
      <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-slate-400 md:text-sm">
        <span style={{ fontWeight: 500 }}>0 - {t.low}</span>
        <span style={{ fontWeight: 500 }}>33 - {t.medium}</span>
        <span style={{ fontWeight: 500 }}>66 - {t.high}</span>
      </div>

      {/* Gradient Bar */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
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
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-[#0B0F19] ${zoneColor} shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
            >
              <div className="h-2 w-2 rounded-full bg-white dark:bg-[#0B0F19]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
