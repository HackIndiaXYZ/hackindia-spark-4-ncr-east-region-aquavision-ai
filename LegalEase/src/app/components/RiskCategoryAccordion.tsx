import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { ClauseCard } from "./ClauseCard";

interface Clause {
  id: string;
  title: string;
  description: string;
  consequence?: string;
  technicalDetails?: string;
  severity: "critical" | "moderate" | "informational";
}

interface RiskCategory {
  id: string;
  title: string;
  clauses: Clause[];
  isHighPriority?: boolean;
}

interface RiskCategoryAccordionProps {
  categories: RiskCategory[];
  onViewInDocument: (clauseId: string) => void;
  canViewInDocument?: boolean;
  forceExpandAll?: boolean;
  targetLanguage?: string;
}

export function RiskCategoryAccordion({
  categories,
  onViewInDocument,
  canViewInDocument = false,
  forceExpandAll = false,
  targetLanguage = "en",
}: RiskCategoryAccordionProps) {
  // Auto-expand high priority categories
  const defaultOpen = categories
    .filter((cat) => cat.isHighPriority)
    .map((cat) => cat.id);
  const expandedValues = categories.map((cat) => cat.id);

  // Get icon for category count based on severity
  const getCategoryIcon = (clauses: Clause[]) => {
    const hasCritical = clauses.some((c) => c.severity === "critical");
    const hasModerate = clauses.some((c) => c.severity === "moderate");

    if (hasCritical) return "🔴";
    if (hasModerate) return "🟡";
    return "🟢";
  };

  return (
    <Accordion.Root
      type="multiple"
      value={forceExpandAll ? expandedValues : undefined}
      defaultValue={defaultOpen}
      className="space-y-3"
    >
      {categories.map((category, categoryIndex) => {
        const icon = getCategoryIcon(category.clauses);

        return (
          <Accordion.Item
            key={category.id}
            value={category.id}
            className="overflow-hidden rounded-lg border border-border bg-white dark:border-white/5 dark:bg-[#13172E]/50 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] backdrop-blur-md"
            style={{
              animation: `slideInUp 0.4s ease-out ${categoryIndex * 100}ms both`,
            }}
          >
            <Accordion.Header>
              <Accordion.Trigger className="group flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-violet-500 md:p-5 dark:hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-slate-800 dark:text-slate-200" style={{ fontWeight: 600 }}>{category.title}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs text-muted-foreground border border-border dark:bg-[#0B0F19] dark:text-slate-400 dark:border-white/5" style={{ fontWeight: 600 }}>
                    {category.clauses.length}
                  </span>
                  {category.isHighPriority && (
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" style={{ fontWeight: 600 }}>
                      {targetLanguage === "hi" ? "प्राथमिकता" : targetLanguage === "mr" ? "प्राधान्य" : "Priority"}
                    </span>
                  )}
                </div>
                <ChevronDown className="h-5 w-5 text-muted-foreground dark:text-slate-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>

            <Accordion.Content className="overflow-hidden border-t border-border dark:border-white/5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="space-y-3 p-4 md:p-5">
                {category.clauses.map((clause, index) => (
                  <ClauseCard
                    key={clause.id}
                    {...clause}
                    onViewInDocument={onViewInDocument}
                    canViewInDocument={canViewInDocument}
                    delay={index * 100}
                    targetLanguage={targetLanguage}
                  />
                ))}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
