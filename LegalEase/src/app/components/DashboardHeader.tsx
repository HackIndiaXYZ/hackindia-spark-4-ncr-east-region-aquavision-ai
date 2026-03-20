import { Download, Globe, Sparkles, RotateCcw, Moon, Sun, Lock, Volume2, Square } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface DashboardHeaderProps {
  filename?: string;
  onReset?: () => void;
  targetLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  isTranslating?: boolean;
  onExport?: () => void;
  isExporting?: boolean;
  isPlaying?: boolean;
  isSynthesizing?: boolean;
  onListen?: () => void;
  isListenDisabled?: boolean;
  listenUnavailableReason?: string;
}

export function DashboardHeader({
  filename,
  onReset,
  targetLanguage = "en",
  onLanguageChange,
  isTranslating = false,
  onExport,
  isExporting = false,
  isPlaying = false,
  isSynthesizing = false,
  onListen,
  isListenDisabled = false,
  listenUnavailableReason = "Audio narration is currently unavailable.",
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-14 border-b border-border bg-white/90 dark:border-white/5 dark:bg-[#0B0F19]/90 backdrop-blur-md shadow-sm md:h-16 print:hidden">
      <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1 text-xl md:text-2xl tracking-tighter">
            <span className="text-zinc-900 dark:text-violet-400" style={{ fontWeight: 700 }}>
              Legal
            </span>
            <span className="text-zinc-600 dark:text-slate-200" style={{ fontWeight: 500 }}>-Ease</span>
          </div>
          <span className="hidden rounded-full border border-violet-200 bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 px-2 py-0.5 text-[10px] text-violet-700 dark:text-violet-300 md:inline-block" style={{ fontWeight: 600 }}>
            AI
          </span>
        </div>

        {/* Breadcrumb - flexibly centered, hidden on mobile */}
        <div className="hidden flex-1 justify-center overflow-hidden px-4 md:flex">
          {filename && (
            <div className="flex items-center max-w-sm rounded-full bg-slate-100/80 px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/50 dark:bg-slate-800/50 dark:text-slate-300 dark:ring-white/10">
              <span className="truncate" title={filename}>
                {filename}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center rounded-lg border border-border bg-white dark:border-white/5 dark:bg-[#171C2E] p-2 text-muted-foreground transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-slate-400 dark:hover:bg-[#1E253A] dark:hover:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          )}

          {/* New Analysis Button - shown when a document is loaded */}
          {filename && onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-white dark:border-white/5 dark:bg-[#171C2E] px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 md:px-3 md:py-2 dark:text-slate-300 dark:hover:bg-[#1E253A]"
              style={{ fontWeight: 500 }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">New Analysis</span>
            </button>
          )}

          {/* Privacy Status */}
          <div
            className="flex items-center justify-center rounded-lg border border-emerald-500/50 bg-emerald-50 p-2 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 cursor-default"
            title="Basic PII masking before AI analysis"
            aria-label="Basic PII masking before AI analysis"
          >
            <Lock className="h-4 w-4" />
          </div>

          {/* TTS Listen Button */}
          {onListen && (
            <button
              onClick={onListen}
              disabled={isSynthesizing || isListenDisabled}
              className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-[13px] transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 md:px-3 md:py-2 ${
                isPlaying
                  ? "border-violet-500/50 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300"
                  : "border-border bg-white text-foreground dark:border-white/5 dark:bg-[#171C2E] dark:text-slate-300 dark:hover:bg-[#1E253A]"
              } disabled:opacity-50 disabled:cursor-wait`}
              style={{ fontWeight: 600 }}
              title={
                isListenDisabled
                  ? listenUnavailableReason
                  : isPlaying
                    ? "Stop listening"
                    : "Listen to summary"
              }
            >
              {isSynthesizing ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : isPlaying ? (
                <Square className="h-4 w-4 fill-current" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              <span className="hidden md:inline">
                {isSynthesizing ? "Loading..." : isPlaying ? "Stop" : "Listen"}
              </span>
            </button>
          )}

          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <Select.Root
            value={targetLanguage}
            onValueChange={onLanguageChange}
            disabled={isTranslating}
          >
            <Select.Trigger className="flex items-center gap-1.5 rounded-lg border border-border bg-white dark:border-white/5 dark:bg-[#171C2E] px-2 py-1.5 text-[13px] text-foreground transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-[#0B0F19] disabled:opacity-50 md:px-3 md:py-2 dark:text-slate-300 dark:hover:bg-[#1E253A]">
              <Globe className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
              <Select.Value />
              <ChevronDown className="h-3 w-3 text-muted-foreground dark:text-slate-400" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content position="popper" sideOffset={4} className="overflow-hidden rounded-lg border border-border bg-white dark:border-white/10 dark:bg-[#171C2E] shadow-xl text-foreground dark:text-slate-200 z-50 min-w-[140px]">
                <Select.Viewport className="p-1">
                  <Select.Item
                    value="en"
                    className="cursor-pointer rounded px-3 py-2 outline-none hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:data-[highlighted]:bg-white/10"
                  >
                    <Select.ItemText>English</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="hinglish"
                    className="cursor-pointer rounded px-3 py-2 outline-none hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:data-[highlighted]:bg-white/10"
                  >
                    <Select.ItemText>Hinglish</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="hi"
                    className="cursor-pointer rounded px-3 py-2 outline-none hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:data-[highlighted]:bg-white/10"
                  >
                    <Select.ItemText>हिन्दी (Hindi)</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="gu"
                    className="cursor-pointer rounded px-3 py-2 outline-none hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:data-[highlighted]:bg-white/10"
                  >
                    <Select.ItemText>ગુજરાતી (Gujarati)</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="ta"
                    className="cursor-pointer rounded px-3 py-2 outline-none hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:data-[highlighted]:bg-white/10"
                  >
                    <Select.ItemText>தமிழ் (Tamil)</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="te"
                    className="cursor-pointer rounded px-3 py-2 outline-none hover:bg-gray-100 focus:bg-gray-100 data-[highlighted]:bg-gray-100 dark:hover:bg-white/10 dark:focus:bg-white/10 dark:data-[highlighted]:bg-white/10"
                  >
                    <Select.ItemText>తెలుగు (Telugu)</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          </div>

          {isTranslating && (
            <span className="hidden text-xs text-violet-400 animate-pulse md:inline-block">
              Translating...
            </span>
          )}

          {/* Export Report Button - hidden on mobile */}
          {filename && (
            <button
              onClick={onExport || (() => window.print())}
              disabled={isExporting || (!onExport && typeof window === "undefined")}
              className="hidden items-center gap-2 rounded-lg border border-border bg-white dark:border-white/5 dark:bg-[#171C2E] px-3 py-2 text-[13px] text-foreground transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 md:flex dark:text-slate-300 dark:hover:bg-[#1E253A] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
              ) : (
                <Download className="h-4 w-4 text-muted-foreground dark:text-slate-400" />
              )}
              <span style={{ fontWeight: 500 }}>{isExporting ? "Exporting..." : "Export Report"}</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
