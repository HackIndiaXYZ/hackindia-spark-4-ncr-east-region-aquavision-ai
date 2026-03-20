import { useState } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { MobileTabSwitcher } from "./components/MobileTabSwitcher";
import { UploadZone } from "./components/UploadZone";
import { PDFViewer } from "./components/PDFViewer";
import { RiskAnalysisPanel } from "./components/RiskAnalysisPanel";
import { AnalysisLoadingState } from "./components/AnalysisLoadingState";

export default function App() {
  const [hasDocument, setHasDocument] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<"document" | "analysis">("document");
  const [activeHighlight, setActiveHighlight] = useState<string | undefined>();

  const handleUpload = () => {
    setHasDocument(true);
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const handleViewInDocument = (clauseId: string) => {
    setActiveHighlight(clauseId);
    setActiveTab("document");

    // Scroll to top to ensure visibility
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Clear highlight after animation
    setTimeout(() => {
      setActiveHighlight(undefined);
    }, 2500);
  };

  const handleHighlightClick = (clauseId: string) => {
    setActiveTab("analysis");
    // Small delay to allow tab switch animation
    setTimeout(() => {
      const element = document.getElementById(`risk-${clauseId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const highlights = [
    {
      id: "term-1",
      page: 1,
      severity: "moderate" as const,
      title: "Short Termination Notice Period",
      description: "30-day notice may be insufficient for complex project transitions.",
      position: { top: "35%", left: "10%", width: "80%", height: "3%" },
    },
    {
      id: "payment-1",
      page: 1,
      severity: "moderate" as const,
      title: "High Late Payment Interest",
      description: "2% monthly (24% APR) is above market standard.",
      position: { top: "47%", left: "10%", width: "75%", height: "3%" },
    },
    {
      id: "ip-1",
      page: 1,
      severity: "moderate" as const,
      title: "Ambiguous IP Ownership",
      description: "Vague definition of pre-existing materials could cause disputes.",
      position: { top: "59%", left: "10%", width: "70%", height: "3%" },
    },
    {
      id: "liability-1",
      page: 1,
      severity: "critical" as const,
      title: "Asymmetric Liability Terms",
      description: "Provider's liability is capped while yours is not.",
      position: { top: "75%", left: "10%", width: "80%", height: "3%" },
    },
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Fixed Header */}
      <DashboardHeader filename={hasDocument ? "service-agreement.pdf" : undefined} />

      {/* Mobile Tab Switcher - only visible on mobile when results are shown */}
      {showResults && (
        <div className="flex-shrink-0 mt-14 md:mt-16">
          <MobileTabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      )}

      {/* Main Content Area - proper height calculation */}
      <div className="flex flex-1 overflow-hidden" style={{ marginTop: showResults ? '0' : '3.5rem' }}>
        {/* Loading State */}
        {isAnalyzing && (
          <div className="h-full w-full">
            <AnalysisLoadingState onComplete={handleAnalysisComplete} />
          </div>
        )}

        {/* Upload State */}
        {!hasDocument && !isAnalyzing && (
          <div className="h-full w-full">
            <UploadZone onUpload={handleUpload} />
          </div>
        )}

        {/* Results - Desktop Layout: Side-by-side columns */}
        {showResults && !isAnalyzing && (
          <div className="hidden h-full w-full md:flex">
            {/* Left Panel - PDF Viewer (55%) - single scroll container */}
            <div className="h-full w-[55%] border-r border-border">
              <PDFViewer
                highlights={highlights}
                activeHighlight={activeHighlight}
                onHighlightClick={handleHighlightClick}
              />
            </div>

            {/* Right Panel - Risk Analysis (45%) - independent scroll */}
            <div className="h-full w-[45%]">
              <RiskAnalysisPanel
                onViewInDocument={handleViewInDocument}
                showAnimations={true}
              />
            </div>
          </div>
        )}

        {/* Results - Tablet Layout: Stacked vertically */}
        {showResults && !isAnalyzing && (
          <div className="hidden h-full w-full flex-col sm:flex md:hidden">
            {/* PDF Viewer on top */}
            <div className="h-1/2 border-b border-border">
              <PDFViewer
                highlights={highlights}
                activeHighlight={activeHighlight}
                onHighlightClick={handleHighlightClick}
              />
            </div>

            {/* Risk Analysis below */}
            <div className="h-1/2">
              <RiskAnalysisPanel
                onViewInDocument={handleViewInDocument}
                showAnimations={true}
              />
            </div>
          </div>
        )}

        {/* Results - Mobile Layout: Tab-based switching */}
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
                  onViewInDocument={handleViewInDocument}
                  showAnimations={true}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}