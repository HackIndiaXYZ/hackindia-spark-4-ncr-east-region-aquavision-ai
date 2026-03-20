import { Download, Globe, Sparkles, RotateCcw } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

interface DashboardHeaderProps {
  filename?: string;
  onReset?: () => void;
  onDemoClick?: () => void;
  targetLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  isTranslating?: boolean;
}

export function DashboardHeader({
  filename,
  onReset,
  onDemoClick,
  targetLanguage = "en",
  onLanguageChange,
  isTranslating = false,
}: DashboardHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-14 border-b border-border bg-white shadow-sm md:h-16 print:hidden">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[#4f46e5]" style={{ fontWeight: 700 }}>
              Legal
            </span>
            <span style={{ fontWeight: 500 }}>-Ease</span>
          </div>
          <span className="hidden rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] text-[#4f46e5] md:inline-block" style={{ fontWeight: 600 }}>
            AI
          </span>
        </div>

        {/* Breadcrumb - centered on desktop, hidden on mobile */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 text-muted-foreground md:block">
          {filename || "No document loaded"}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* New Analysis Button - shown when a document is loaded */}
          {filename && onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1.5 text-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring md:px-3 md:py-2"
              style={{ fontWeight: 500 }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">New Analysis</span>
            </button>
          )}

          {/* Try Sample Contract Demo Button */}
          {onDemoClick && (
            <button
              onClick={onDemoClick}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1.5 text-sm text-[#4f46e5] transition-colors hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:ring-offset-2 md:px-3 md:py-2"
              style={{ fontWeight: 600 }}
            >
              <span className="hidden md:inline">Try Sample Contract</span>
              <span className="inline md:hidden">Demo</span>
            </button>
          )}

          {/* Language Switcher */}
          <Select.Root
            value={targetLanguage}
            onValueChange={onLanguageChange}
            disabled={isTranslating}
          >
            <Select.Trigger className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1.5 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 md:px-3 md:py-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Select.Value />
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden rounded-lg border border-border bg-white shadow-lg">
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="en"
                    className="cursor-pointer rounded px-3 py-2 text-foreground outline-none hover:bg-accent focus:bg-accent"
                  >
                    <Select.ItemText>EN</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="hi"
                    className="cursor-pointer rounded px-3 py-2 text-foreground outline-none hover:bg-accent focus:bg-accent"
                  >
                    <Select.ItemText>हिन्दी</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="ta"
                    className="cursor-pointer rounded px-3 py-2 text-foreground outline-none hover:bg-accent focus:bg-accent"
                  >
                    <Select.ItemText>தமிழ்</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="te"
                    className="cursor-pointer rounded px-3 py-2 text-foreground outline-none hover:bg-accent focus:bg-accent"
                  >
                    <Select.ItemText>తెలుగు</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {isTranslating && (
            <span className="hidden text-xs text-muted-foreground animate-pulse md:inline-block">
              Translating...
            </span>
          )}

          {/* Export Report Button - hidden on mobile */}
          <button
            onClick={() => window.print()}
            className="hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring md:flex"
          >
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>

          {/* Analyze Button */}
          <button
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 md:px-4"
            style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }}
          >
            <Sparkles className="h-4 w-4" />
            <span>Analyze</span>
          </button>
        </div>
      </div>
    </header>
  );
}
