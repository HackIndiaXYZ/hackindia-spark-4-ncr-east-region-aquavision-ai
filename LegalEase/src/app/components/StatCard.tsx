interface StatCardProps {
  label: string;
  value: string | number;
  colorClass?: string;
  valueLabel?: string;
}

export function StatCard({ label, value, colorClass, valueLabel }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-lg bg-white p-4 shadow-sm md:gap-3 md:p-5">
      <div className="text-xs text-muted-foreground md:text-sm">{label}</div>
      <div className="flex items-end gap-2">
        <div
          className={`text-2xl md:text-3xl ${colorClass || "text-foreground"}`}
          style={{ fontWeight: 700 }}
        >
          {value}
        </div>
        {valueLabel && (
          <div
            className={`mb-1 rounded-full px-2 py-0.5 text-xs ${colorClass || ""}`}
            style={{ fontWeight: 500 }}
          >
            {valueLabel}
          </div>
        )}
      </div>
    </div>
  );
}
