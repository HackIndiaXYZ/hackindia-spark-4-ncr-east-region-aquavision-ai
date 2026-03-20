import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const defaultSteps = [
  "Uploading PDF...",
  "Extracting text...",
  "Analyzing clauses...",
  "Calculating risk score...",
  "Preparing dashboard...",
];

interface AnalysisLoadingStateProps {
  steps?: string[];
}

export function AnalysisLoadingState({
  steps = defaultSteps,
}: AnalysisLoadingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (steps.length === 0) {
      return;
    }

    setCurrentStep(0);
    setProgress(10);

    const interval = setInterval(() => {
      setCurrentStep((previousStep) => {
        const nextStep =
          previousStep < steps.length - 1 ? previousStep + 1 : previousStep;
        const nextProgress = Math.min(
          25 + (nextStep / Math.max(steps.length - 1, 1)) * 70,
          95,
        );
        setProgress(nextProgress);
        return nextStep;
      });
    }, 900);

    return () => {
      clearInterval(interval);
    };
  }, [steps]);

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
                key={step}
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
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
