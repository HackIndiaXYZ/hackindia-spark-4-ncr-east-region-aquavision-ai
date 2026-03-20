import { RiskSummaryBanner } from "./RiskSummaryBanner";
import { RiskIndicatorBar } from "./RiskIndicatorBar";
import { RiskCategoryAccordion } from "./RiskCategoryAccordion";

interface RiskAnalysisPanelProps {
  onViewInDocument: (clauseId: string) => void;
  showAnimations?: boolean;
}

export function RiskAnalysisPanel({ onViewInDocument, showAnimations = false }: RiskAnalysisPanelProps) {
  const riskScore = 72;
  const riskLevel = riskScore > 66 ? "high" : riskScore > 33 ? "medium" : "low";

  const riskCategories = [
    {
      id: "liability",
      title: "Liability & Indemnification",
      isHighPriority: true,
      clauses: [
        {
          id: "liability-1",
          title: "Asymmetric Liability Terms",
          description:
            "You could be on the hook for unlimited damages, but the provider caps their liability at just 6 months of fees. This creates an unfair imbalance of risk.",
          technicalDetails:
            "Provider's liability limited to 6 months of payments while client liability is unlimited per Section 6.1",
          severity: "critical" as const,
        },
        {
          id: "indemnify-1",
          title: "One-Sided Indemnification",
          description:
            "You must protect the provider from any legal claims, but they don't offer you the same protection. If something goes wrong, you're covering the costs alone.",
          technicalDetails:
            "Client indemnifies provider for all third-party claims without reciprocal protection per Section 6.3",
          severity: "critical" as const,
        },
      ],
    },
    {
      id: "termination",
      title: "Termination & Exit Terms",
      isHighPriority: true,
      clauses: [
        {
          id: "term-1",
          title: "Short Termination Notice Period",
          description:
            "You only get 30 days to wrap things up if you cancel. For complex projects, this might not be enough time for a smooth handover.",
          technicalDetails:
            "30-day termination notice per Section 2.3 may be insufficient for project transitions",
          severity: "moderate" as const,
        },
        {
          id: "term-2",
          title: "Early Termination Penalties",
          description:
            "If you need to end the contract early, you'll pay 3 months of fees as a penalty. This could trap you in a bad arrangement.",
          technicalDetails:
            "Liquidated damages equal to 3 months fees for early termination without cause per Section 2.4",
          severity: "moderate" as const,
        },
      ],
    },
    {
      id: "payment",
      title: "Payment Terms",
      clauses: [
        {
          id: "payment-1",
          title: "High Late Payment Interest",
          description:
            "Late payments cost you 2% per month (24% per year). This is higher than typical contracts and can add up quickly if you're ever delayed.",
          technicalDetails:
            "2% monthly interest rate (24% APR) exceeds typical market rates per Section 3.2",
          severity: "moderate" as const,
        },
        {
          id: "payment-2",
          title: "Automatic Price Increases",
          description:
            "Prices go up automatically every year with no limit and no chance to negotiate. You might be stuck with unexpected cost increases.",
          technicalDetails:
            "Annual price escalation clause without cap or negotiation per Section 3.3",
          severity: "informational" as const,
        },
      ],
    },
    {
      id: "ip",
      title: "Intellectual Property",
      clauses: [
        {
          id: "ip-1",
          title: "Unclear Ownership Rights",
          description:
            "The contract doesn't clearly define what 'pre-existing materials' means. This could lead to fights later about who owns what was created.",
          technicalDetails:
            "Ambiguous definition of pre-existing materials in Section 4.1 could create ownership disputes",
          severity: "moderate" as const,
        },
      ],
    },
  ];

  const totalClauses = riskCategories.reduce(
    (sum, cat) => sum + cat.clauses.length,
    0
  );

  const primaryIssues = [
    "Asymmetric liability terms",
    "One-sided indemnification",
  ];

  return (
    // Single scrolling container for entire panel
    <div className="custom-scrollbar h-full overflow-y-auto bg-gray-50">
      {/* All content scrolls together as one unit */}
      <div className="min-h-full">
        {/* Risk Summary Banner */}
        <div className="border-b border-border">
          <RiskSummaryBanner
            riskLevel={riskLevel}
            riskScore={riskScore}
            primaryIssues={primaryIssues}
          />
        </div>

        {/* Risk Score Section */}
        <div className="border-b border-border bg-white p-4 md:p-6">
          <RiskIndicatorBar score={riskScore} animate={showAnimations} />
        </div>

        {/* Quick Stats */}
        <div className="border-b border-border bg-white px-4 py-3 md:px-6 md:py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Clauses Reviewed</div>
              <div className="text-2xl" style={{ fontWeight: 700 }}>
                45
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Issues Found</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl text-red-600" style={{ fontWeight: 700 }}>
                  {totalClauses}
                </div>
                <div className="text-sm text-muted-foreground">
                  ({riskCategories.filter(c => c.isHighPriority).length} priority)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Breakdown - now part of the same scroll */}
        <div className="p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base md:text-lg" style={{ fontWeight: 600 }}>
              Risk Breakdown
            </h3>
            <div className="text-xs text-muted-foreground">
              High priority items are expanded
            </div>
          </div>
          <RiskCategoryAccordion
            categories={riskCategories}
            onViewInDocument={onViewInDocument}
          />
        </div>
      </div>
    </div>
  );
}
