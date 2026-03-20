import { useMemo, useState } from "react";

import { analyzeDocument } from "@/lib/analyze-document";
import type { AnalysisResult } from "@/types/analysis";

import { AnalysisLoadingState } from "./components/AnalysisLoadingState";
import { DashboardHeader } from "./components/DashboardHeader";
import { MobileTabSwitcher } from "./components/MobileTabSwitcher";
import { PDFViewer } from "./components/PDFViewer";
import { RiskAnalysisPanel } from "./components/RiskAnalysisPanel";
import { UploadZone } from "./components/UploadZone";

const loadingSteps = [
  "Uploading PDF...",
  "Extracting text...",
  "Analyzing clauses...",
  "Calculating risk score...",
  "Preparing dashboard...",
];

// Generate staggered positions for PDF highlight overlays from analysis risks
function deriveHighlights(analysis: AnalysisResult | null) {
  if (!analysis || analysis.risks.length === 0) return [];

  const severityMap = {
    high: "critical" as const,
    medium: "moderate" as const,
    low: "moderate" as const,
  };

  return analysis.risks.map((risk, index) => ({
    id: risk.id,
    page: 1,
    severity: severityMap[risk.level],
    title: risk.title,
    description: risk.description,
    position: {
      top: `${30 + index * 12}%`,
      left: "10%",
      width: `${70 + Math.round(Math.random() * 10)}%`,
      height: "3%",
    },
  }));
}

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisMode, setAnalysisMode] = useState<"demo" | "live" | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"document" | "analysis">("document");
  const [activeHighlight, setActiveHighlight] = useState<string | undefined>();

  const hasDocument = selectedFile !== null;
  const showResults = analysis !== null;
  const highlights = useMemo(() => deriveHighlights(analysis), [analysis]);

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file for the demo.");
      return;
    }

    setSelectedFile(file);
    setAnalysis(null);
    setAnalysisMode(null);
    setError(null);
    setActiveHighlight(undefined);
    setActiveTab("document");
    setIsAnalyzing(true);

    try {
      const result = await analyzeDocument(file);
      setAnalysis(result.data);
      setAnalysisMode(result.mode);
    } catch (analysisError) {
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "Analysis failed. Please try again.",
      );
      setSelectedFile(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalysis(null);
    setAnalysisMode(null);
    setError(null);
    setActiveHighlight(undefined);
    setActiveTab("document");
    setIsAnalyzing(false);
  };

  const handleViewInDocument = (clauseId: string) => {
    setActiveHighlight(clauseId);
    setActiveTab("document");

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      setActiveHighlight(undefined);
    }, 2500);
  };

  const handleHighlightClick = (clauseId: string) => {
    setActiveTab("analysis");

    setTimeout(() => {
      const element = document.getElementById(`risk-${clauseId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader
        filename={
          hasDocument ? analysis?.documentName || selectedFile?.name : undefined
        }
        onReset={handleReset}
      />

      {showResults && (
        <div className="mt-14 flex-shrink-0 md:mt-16">
          <MobileTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      <div
        className="flex flex-1 overflow-hidden"
        style={{ marginTop: showResults ? "0" : "3.5rem" }}
      >
        {isAnalyzing && (
          <div className="h-full w-full">
            <AnalysisLoadingState steps={loadingSteps} />
          </div>
        )}

        {!hasDocument && !isAnalyzing && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4 md:p-8">
            <div className="h-full w-full">
              <UploadZone onUpload={handleUpload} />
            </div>

            {error && (
              <div className="w-full max-w-lg rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 shadow-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {showResults && !isAnalyzing && (
          <div className="hidden h-full w-full md:flex">
            <div className="h-full w-[55%] border-r border-border">
              <PDFViewer
                highlights={highlights}
                activeHighlight={activeHighlight}
                onHighlightClick={handleHighlightClick}
              />
            </div>

            <div className="h-full w-[45%]">
              <RiskAnalysisPanel
                analysis={analysis}
                analysisMode={analysisMode}
                onViewInDocument={handleViewInDocument}
                showAnimations
              />
            </div>
          </div>
        )}

        {showResults && !isAnalyzing && (
          <div className="hidden h-full w-full flex-col sm:flex md:hidden">
            <div className="h-1/2 border-b border-border">
              <PDFViewer
                highlights={highlights}
                activeHighlight={activeHighlight}
                onHighlightClick={handleHighlightClick}
              />
            </div>

            <div className="h-1/2">
              <RiskAnalysisPanel
                analysis={analysis}
                analysisMode={analysisMode}
                onViewInDocument={handleViewInDocument}
                showAnimations
              />
            </div>
          </div>
        )}

        {showResults && !isAnalyzing && (
          <div className="h-full w-full sm:hidden">
            {activeTab === "document" ? (
              <div className="h-full">
                <PDFViewer
                  highlights={highlights}
                  activeHighlight={activeHighlight}
                  onHighlightClick={handleHighlightClick}
                />
              </div>
            ) : (
              <div className="h-full">
                <RiskAnalysisPanel
                  analysis={analysis}
                  analysisMode={analysisMode}
                  onViewInDocument={handleViewInDocument}
                  showAnimations
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
