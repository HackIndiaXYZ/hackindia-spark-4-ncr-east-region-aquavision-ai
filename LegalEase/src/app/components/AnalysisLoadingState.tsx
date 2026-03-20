import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  { id: 1, label: "Reading document...", duration: 800 },
  { id: 2, label: "Analyzing clauses...", duration: 1200 },
  { id: 3, label: "Detecting risks...", duration: 1000 },
  { id: 4, label: "Generating report...", duration: 800 },
];

interface AnalysisLoadingStateProps {
  onComplete: () => void;
}

export function AnalysisLoadingState({ onComplete }: AnalysisLoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (currentStep < steps.length) {
      const step = steps[currentStep];
      const stepProgress = (currentStep / steps.length) * 100;
      
      // Animate progress within the step
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          const target = ((currentStep + 1) / steps.length) * 100;
          const increment = (target - stepProgress) / 20;
          return Math.min(prev + increment, target);
        });
      }, step.duration / 20);

      timeout = setTimeout(() => {
        clearInterval(progressInterval);
        if (currentStep === steps.length - 1) {
          setProgress(100);
          setTimeout(onComplete, 300);
        } else {
          setCurrentStep(currentStep + 1);
        }
      }, step.duration);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, [currentStep, onComplete]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            <Loader2 className="h-10 w-10 animate-spin text-white" />
          </div>
        </div>

        {/* Main Message */}
        <div>
          <h2 className="mb-2 text-2xl" style={{ fontWeight: 700 }}>
            Analyzing Contract
          </h2>
          <p className="text-muted-foreground">
            AI is reviewing your document for potential risks
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
              }}
            />
          </div>

          {/* Current Step */}
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 text-sm transition-all ${
                  index === currentStep
                    ? "text-[#4f46e5] scale-105"
                    : index < currentStep
                    ? "text-muted-foreground line-through"
                    : "text-muted-foreground opacity-40"
                }`}
                style={{
                  fontWeight: index === currentStep ? 600 : 400,
                }}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep
                      ? "bg-[#4f46e5] animate-pulse"
                      : index < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
                {step.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
