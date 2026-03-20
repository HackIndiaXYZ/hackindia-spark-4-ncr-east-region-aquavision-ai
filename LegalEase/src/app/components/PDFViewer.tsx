import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Info } from "lucide-react";
import { useEffect, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Highlight {
  id: string;
  page: number;
  severity: "critical" | "moderate" | "informational";
  title: string;
  description: string;
  position: { top: string; left: string; width: string; height: string };
}

interface PDFViewerProps {
  file?: File | null;
  analysisMode?: "demo" | "live" | null;
  highlights: Highlight[];
  activeHighlight?: string;
  onHighlightClick?: (id: string) => void;
}

export function PDFViewer({
  file,
  analysisMode,
  highlights,
  activeHighlight,
  onHighlightClick,
}: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [hoveredHighlight, setHoveredHighlight] = useState<string | undefined>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const totalPages = 6;

  useEffect(() => {
    if (file && analysisMode !== "demo") {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPdfUrl(null);
    }
  }, [file, analysisMode]);

  const pageHighlights = highlights.filter((h) => h.page === currentPage);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-400/40 hover:bg-red-400/60 border-red-500";
      case "moderate":
        return "bg-amber-300/40 hover:bg-amber-300/60 border-amber-500";
      case "informational":
        return "bg-blue-300/40 hover:bg-blue-300/60 border-blue-500";
      default:
        return "bg-amber-300/40 hover:bg-amber-300/60 border-amber-500";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return "🔴";
      case "moderate":
        return "🟡";
      case "informational":
        return "🟢";
      default:
        return "🟡";
    }
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      {/* Outer container with relative positioning for fixed controls */}
      <div className="relative h-full w-full bg-gray-100">
        {/* Scrolling content area */}
        <div className={`custom-scrollbar h-full pb-20 ${pdfUrl ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className="min-h-full p-4 md:p-8" style={{ height: pdfUrl ? '100%' : 'auto' }}>
            <div
              className={`mx-auto bg-white shadow-lg ${pdfUrl ? 'h-full' : ''}`}
              style={{
                width: `${zoom}%`,
                maxWidth: pdfUrl ? '100%' : '800px',
                minHeight: pdfUrl ? '100%' : '1000px',
                transition: 'width 0.2s ease',
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(0, 0, 0, 0.02)",
              }}
            >
              {pdfUrl ? (
                <object
                  data={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
                  type="application/pdf"
                  className="h-full w-full"
                >
                  <div className="flex h-full items-center justify-center bg-gray-100 p-8 text-center text-muted-foreground">
                    <div>
                      <p className="mb-2">Your browser does not support inline PDFs.</p>
                      <a
                        href={pdfUrl}
                        download={file?.name || "document.pdf"}
                        className="text-indigo-600 underline hover:text-indigo-800"
                      >
                        Download the file
                      </a>
                      {" "}to view it.
                    </div>
                  </div>
                </object>
              ) : (
                <div className="relative p-8 md:p-12">
                  {/* Sample contract content */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="mb-2 text-2xl" style={{ fontWeight: 600 }}>
                      Service Agreement
                    </h2>
                    <p className="text-muted-foreground">
                      Effective Date: March 19, 2026
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p>
                      This Service Agreement ("Agreement") is entered into between{" "}
                      <strong>TechCorp Inc.</strong> ("Provider") and{" "}
                      <strong>Client Company LLC</strong> ("Client").
                    </p>

                    <div className="space-y-3">
                      <h3 className="mt-6" style={{ fontWeight: 600 }}>
                        1. Scope of Services
                      </h3>
                      <p>
                        Provider agrees to deliver software development services as
                        outlined in Exhibit A, including but not limited to custom
                        application development, API integrations, and ongoing
                        technical support.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="mt-6" style={{ fontWeight: 600 }}>
                        2. Term and Termination
                      </h3>
                      <div className="relative">
                        <p>
                          This Agreement shall commence on the date first written
                          above and continue for a period of twelve (12) months.{" "}
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <span
                                className={`relative inline-block cursor-pointer rounded px-1 transition-all ${getSeverityColor("moderate")} ${
                                  activeHighlight === "term-1" ? "animate-pulse ring-2 ring-amber-500" : ""
                                }`}
                                onClick={() => onHighlightClick?.("term-1")}
                                onMouseEnter={() => setHoveredHighlight("term-1")}
                                onMouseLeave={() => setHoveredHighlight(undefined)}
                              >
                                Either party may terminate with 30 days written notice.
                              </span>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="z-50 max-w-xs rounded-lg border border-border bg-white p-3 shadow-lg"
                                sideOffset={5}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{getSeverityIcon("moderate")}</span>
                                    <span className="text-xs text-amber-700" style={{ fontWeight: 700 }}>
                                      MODERATE RISK
                                    </span>
                                  </div>
                                  <p className="text-sm" style={{ fontWeight: 600 }}>
                                    Short Termination Notice Period
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    30-day notice may be insufficient for complex project transitions.
                                  </p>
                                </div>
                                <Tooltip.Arrow className="fill-white" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="mt-6" style={{ fontWeight: 600 }}>
                        3. Compensation
                      </h3>
                      <p>
                        Client agrees to pay Provider a monthly fee of $15,000 USD,
                        payable within 30 days of invoice receipt.{" "}
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <span
                              className={`relative inline-block cursor-pointer rounded px-1 transition-all ${getSeverityColor("moderate")} ${
                                activeHighlight === "payment-1" ? "animate-pulse ring-2 ring-amber-500" : ""
                              }`}
                              onClick={() => onHighlightClick?.("payment-1")}
                            >
                              Late payments shall incur a 2% monthly interest charge.
                            </span>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="z-50 max-w-xs rounded-lg border border-border bg-white p-3 shadow-lg"
                              sideOffset={5}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{getSeverityIcon("moderate")}</span>
                                  <span className="text-xs text-amber-700" style={{ fontWeight: 700 }}>
                                    MODERATE RISK
                                  </span>
                                </div>
                                <p className="text-sm" style={{ fontWeight: 600 }}>
                                  High Late Payment Interest
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  2% monthly (24% APR) is above market standard.
                                </p>
                              </div>
                              <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="mt-6" style={{ fontWeight: 600 }}>
                        4. Intellectual Property
                      </h3>
                      <p>
                        All deliverables created under this Agreement shall be the
                        exclusive property of Client upon full payment.{" "}
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <span
                              className={`relative inline-block cursor-pointer rounded px-1 transition-all ${getSeverityColor("moderate")} ${
                                activeHighlight === "ip-1" ? "animate-pulse ring-2 ring-amber-500" : ""
                              }`}
                              onClick={() => onHighlightClick?.("ip-1")}
                            >
                              Provider retains rights to pre-existing materials and
                              general methodologies.
                            </span>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="z-50 max-w-xs rounded-lg border border-border bg-white p-3 shadow-lg"
                              sideOffset={5}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{getSeverityIcon("moderate")}</span>
                                  <span className="text-xs text-amber-700" style={{ fontWeight: 700 }}>
                                    MODERATE RISK
                                  </span>
                                </div>
                                <p className="text-sm" style={{ fontWeight: 600 }}>
                                  Ambiguous IP Ownership
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Vague definition of pre-existing materials could cause disputes.
                                </p>
                              </div>
                              <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="mt-6" style={{ fontWeight: 600 }}>
                        5. Confidentiality
                      </h3>
                      <p>
                        Both parties agree to maintain confidentiality of proprietary
                        information disclosed during the term of this Agreement and
                        for three (3) years thereafter.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="mt-6" style={{ fontWeight: 600 }}>
                        6. Liability and Indemnification
                      </h3>
                      <p>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <span
                              className={`relative inline-block cursor-pointer rounded px-1 transition-all ${getSeverityColor("critical")} ${
                                activeHighlight === "liability-1" ? "animate-pulse ring-2 ring-red-500" : ""
                              }`}
                              onClick={() => onHighlightClick?.("liability-1")}
                            >
                              Provider's liability shall be limited to the amount paid by
                              Client in the preceding six (6) months.
                            </span>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="z-50 max-w-xs rounded-lg border border-border bg-white p-3 shadow-lg"
                              sideOffset={5}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{getSeverityIcon("critical")}</span>
                                  <span className="text-xs text-red-700" style={{ fontWeight: 700 }}>
                                    CRITICAL RISK
                                  </span>
                                </div>
                                <p className="text-sm" style={{ fontWeight: 600 }}>
                                  Asymmetric Liability Terms
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Provider's liability is capped while yours is not, creating imbalanced risk.
                                </p>
                              </div>
                              <Tooltip.Arrow className="fill-white" />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>{" "}
                        Provider shall indemnify Client against third-party claims
                        arising from Provider's negligence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Helpful hint - part of scrolling content */}
            {!pdfUrl && (
              <div className="mx-auto mt-6 max-w-md rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900 shadow-sm">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 flex-shrink-0" />
                  <span>Hover over highlighted text to see risk details</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FIXED Navigation Controls - positioned absolutely, stays at bottom */}
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-10">
          {/* Gradient fade to indicate more content */}
          <div className="h-12 bg-gradient-to-t from-gray-100 via-gray-100/80 to-transparent" />
          
          <div className="pointer-events-auto flex items-center justify-between border-t border-border bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm md:justify-center md:gap-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg p-2 transition-colors hover:bg-accent disabled:opacity-40 disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <span className="min-w-[80px] text-center text-muted-foreground md:min-w-[120px]">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg p-2 transition-colors hover:bg-accent disabled:opacity-40 disabled:hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="rounded-lg p-2 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>

              <span className="min-w-[50px] text-center text-muted-foreground">
                {zoom}%
              </span>

              <button
                onClick={() => setZoom(Math.min(200, zoom + 10))}
                className="rounded-lg p-2 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
