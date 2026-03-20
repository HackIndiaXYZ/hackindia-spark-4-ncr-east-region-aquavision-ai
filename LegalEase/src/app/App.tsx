import { useEffect, useMemo, useState, useRef } from "react";

import { analyzeDocument } from "@/lib/analyze-document";
import { translateDocument } from "@/lib/translate-document";
import type { AnalysisResult } from "@/types/analysis";
import { toast } from "sonner";

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
  const [originalAnalysis, setOriginalAnalysis] = useState<AnalysisResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisMode, setAnalysisMode] = useState<"demo" | "live" | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"document" | "analysis">("document");
  const [activeHighlight, setActiveHighlight] = useState<string | undefined>();
  const [translationsCache, setTranslationsCache] = useState<Record<string, AnalysisResult>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const hasDocument = selectedFile !== null;
  const showResults = analysis !== null;
  const highlights = useMemo(
    () => (analysisMode === "demo" ? deriveHighlights(analysis) : []),
    [analysis, analysisMode],
  );
  const canListen = targetLanguage === "en" || targetLanguage === "hi";
  const canViewInDocument = analysisMode === "demo";

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      if (navigator.language.startsWith("hi")) {
        setTargetLanguage("hi");
      }
    }
  }, []);

  const handleListen = async () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      return;
    }

    if (!analysis) return;

    try {
      setIsSynthesizing(true);
      const issues = analysis.risks.filter(r => r.level === 'high' || r.level === 'medium').map((r) => r.title).join(". ");
      const textToRead = `Overall Risk Score is ${analysis.riskScore} out of 100. Summary: ${analysis.summary}. What could go wrong: ${analysis.consequences.join(". ")}. Key loopholes and risks found: ${issues}.`;
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textToRead, targetLanguage })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate text-to-speech");
      }

      const data = await response.json();
      
      if (!data.audios || !data.audios.length) {
        throw new Error("No audio returned from API");
      }

      let currentAudioIndex = 0;
      
      const playNextChunk = () => {
        if (!isPlaying && currentAudioIndex > 0) return; // Stopped manually

        if (currentAudioIndex >= data.audios.length) {
          setIsPlaying(false);
          return;
        }

        const audio = new Audio(`data:audio/wav;base64,${data.audios[currentAudioIndex]}`);
        audioRef.current = audio;
        
        audio.onended = () => {
          currentAudioIndex++;
          playNextChunk();
        };

        audio.play().catch((e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
        });
      };

      setIsPlaying(true);
      playNextChunk();
    } catch (err) {
      console.error(err);
      setIsPlaying(false);
      toast.error(err instanceof Error ? err.message : "Text-to-Speech failed.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF file.");
      return;
    }

    setSelectedFile(file);
    setOriginalAnalysis(null);
    setAnalysis(null);
    setAnalysisMode(null);
    setTargetLanguage("en");
    setError(null);
    setActiveHighlight(undefined);
    setActiveTab("document");
    setIsAnalyzing(true);
    setTranslationsCache({});

    try {
      const result = await analyzeDocument(file, true);
      setOriginalAnalysis(result.data);
      setAnalysis(result.data);
      setAnalysisMode(result.mode);
      setTranslationsCache({ en: result.data });

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

  const handleLanguageChange = async (lang: string) => {
    setTargetLanguage(lang);
    if (!originalAnalysis) return;

    // Check if we already have the translation cached
    if (translationsCache[lang]) {
      setAnalysis(translationsCache[lang]);
      return;
    }

    // Reset error if switching languages manually (fallback)
    setError(null);
    setIsTranslating(true);

    try {
      const result = await translateDocument(
        originalAnalysis,
        lang as any
      );
      setAnalysis(result.data as AnalysisResult);
      setTranslationsCache((prev) => ({ ...prev, [lang]: result.data as AnalysisResult }));
      // We keep the original analysis mode (whether it was demo or live)
    } catch (err) {
      console.error("Translation error:", err);
      // On error, we could show a toast, but for now we just fallback to the previous state
      setError("Failed to translate the document. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setOriginalAnalysis(null);
    setAnalysis(null);
    setAnalysisMode(null);
    setTargetLanguage("en");
    setError(null);
    setActiveHighlight(undefined);
    setActiveTab("document");
    setIsAnalyzing(false);
    setIsTranslating(false);
    setTranslationsCache({});
  };

  const handleViewInDocument = (clauseId: string) => {
    setActiveHighlight(clauseId);
    setActiveTab("document");

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      setActiveHighlight(undefined);
    }, 2500);
  };

  const handleDemoTopBar = () => {
    const demoFile = new File(
      ["dummy content"],
      "Acme_Corp_Service_Agreement.pdf",
      { type: "application/pdf" }
    );
    handleUpload(demoFile);
  };

  const handleHighlightClick = (clauseId: string) => {
    setActiveTab("analysis");

    setTimeout(() => {
      const element = document.getElementById(`risk-${clauseId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const handleExport = () => {
    try {
      // Small timeout to ensure any state changes (if we had any print-specific ones) are flushed
      setTimeout(() => {
        window.print();
        toast.success("Ready to save as PDF!");
      }, 100);
    } catch (err) {
      console.error("Export failed", err);
      toast.error("Failed to prepare report.");
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-200 print:h-auto print:overflow-visible transition-colors duration-300">
      <DashboardHeader
        filename={selectedFile?.name || (analysisMode === "demo" ? "Acme_Corp_Service_Agreement.pdf" : undefined)}
        onReset={handleReset}
        targetLanguage={targetLanguage}
        onLanguageChange={handleLanguageChange}
        isTranslating={isTranslating}
        onExport={handleExport}
        isExporting={isExporting}
        isPlaying={isPlaying}
        isSynthesizing={isSynthesizing}
        onListen={analysis ? handleListen : undefined}
        isListenDisabled={!canListen}
        listenUnavailableReason="Audio narration is currently available in English and Hindi."
      />

      {showResults && (
        <div className="mt-14 flex-shrink-0 md:mt-16 print:hidden">
          <MobileTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      <div
        className="flex flex-1 overflow-hidden print:overflow-visible print:block print:h-auto"
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
              <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300 shadow-sm backdrop-blur-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {showResults && !isAnalyzing && (
          <div className="hidden h-full w-full md:flex print:block print:h-auto print:w-full">
            <div className="h-full w-[40%] border-r border-border dark:border-white/10 print:hidden">
              <PDFViewer
                file={selectedFile}
                analysisMode={analysisMode}
                highlights={highlights}
                activeHighlight={activeHighlight}
                onHighlightClick={handleHighlightClick}
              />
            </div>
            <div className="h-full w-[60%] bg-slate-50 dark:bg-[#0B0F19] print:w-full overflow-y-auto custom-scrollbar">
              <RiskAnalysisPanel
                analysis={analysis}
                analysisMode={analysisMode}
                onViewInDocument={handleViewInDocument}
                canViewInDocument={canViewInDocument}
                showAnimations
                targetLanguage={targetLanguage}
              />
            </div>
          </div>
        )}

        {showResults && !isAnalyzing && (
          <div className="hidden h-full w-full flex-col sm:flex md:hidden">
            <div className="h-1/2 border-b border-border dark:border-white/10">
              <PDFViewer
                file={selectedFile}
                analysisMode={analysisMode}
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
                canViewInDocument={canViewInDocument}
                showAnimations
                targetLanguage={targetLanguage}
              />
            </div>
          </div>
        )}

        {showResults && !isAnalyzing && (
          <div className="h-full w-full sm:hidden">
            {activeTab === "document" ? (
              <div className="h-full">
                <PDFViewer
                  file={selectedFile}
                  analysisMode={analysisMode}
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
                  canViewInDocument={canViewInDocument}
                  showAnimations
                  targetLanguage={targetLanguage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
