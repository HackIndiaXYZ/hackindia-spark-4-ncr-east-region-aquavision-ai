import { Download, Globe, Sparkles } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";

interface DashboardHeaderProps {
  filename?: string;
}

export function DashboardHeader({ filename }: DashboardHeaderProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-14 border-b border-border bg-white shadow-sm md:h-16">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-[#4f46e5]" style={{ fontWeight: 500 }}>
              AI
            </span>
            <span style={{ fontWeight: 500 }}>ContractPro</span>
          </div>
        </div>

        {/* Breadcrumb - centered on desktop, hidden on mobile */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 text-muted-foreground md:block">
          {filename || "No document loaded"}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Switcher */}
          <Select.Root defaultValue="en">
            <Select.Trigger className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1.5 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring md:px-3 md:py-2">
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
                    value="es"
                    className="cursor-pointer rounded px-3 py-2 text-foreground outline-none hover:bg-accent focus:bg-accent"
                  >
                    <Select.ItemText>ES</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="fr"
                    className="cursor-pointer rounded px-3 py-2 text-foreground outline-none hover:bg-accent focus:bg-accent"
                  >
                    <Select.ItemText>FR</Select.ItemText>
                  </Select.Item>
                  <Select.Item
                    value="de"
                    className="cursor-pointer rounded px-3 py-2 text-foreground outline-none hover:bg-accent focus:bg-accent"
                  >
                    <Select.ItemText>DE</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {/* Export Report Button - hidden on mobile */}
          <button className="hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring md:flex">
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
