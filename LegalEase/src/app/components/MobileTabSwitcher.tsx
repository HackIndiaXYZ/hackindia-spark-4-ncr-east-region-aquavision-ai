interface MobileTabSwitcherProps {
  activeTab: "document" | "analysis";
  onTabChange: (tab: "document" | "analysis") => void;
}

export function MobileTabSwitcher({
  activeTab,
  onTabChange,
}: MobileTabSwitcherProps) {
  return (
    <div className="flex border-b border-border bg-white md:hidden">
      <button
        onClick={() => onTabChange("document")}
        className={`flex-1 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring ${
          activeTab === "document"
            ? "border-b-2 border-[#4f46e5] text-[#4f46e5]"
            : "text-muted-foreground"
        }`}
        style={{ fontWeight: 500 }}
      >
        Document
      </button>
      <button
        onClick={() => onTabChange("analysis")}
        className={`flex-1 px-4 py-3 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring ${
          activeTab === "analysis"
            ? "border-b-2 border-[#4f46e5] text-[#4f46e5]"
            : "text-muted-foreground"
        }`}
        style={{ fontWeight: 500 }}
      >
        Analysis
      </button>
    </div>
  );
}
