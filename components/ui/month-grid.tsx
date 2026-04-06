import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/cn";
import type { BadgeTone, MonthCell } from "@/lib/types";

const weekDays = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];

type MonthGridProps = {
  monthLabel: string;
  cells: MonthCell[];
  legend?: { label: string; tone: BadgeTone }[];
};

export function MonthGrid({ monthLabel, cells, legend }: MonthGridProps) {
  return (
    <div className="app-shell-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="section-title">{monthLabel}</h2>
          <p className="section-description">
            มุมมองรายเดือนเพื่อดูแผนงานหรือการมาทำงานแบบรวบรัด
          </p>
        </div>
        {legend ? (
          <div className="flex flex-wrap gap-2">
            {legend.map((item) => (
              <StatusBadge key={item.label} label={item.label} tone={item.tone} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
        {weekDays.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell) => (
          <div
            key={cell.key}
            className={cn(
              "min-h-24 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left",
              cell.isEmpty && "border-dashed bg-transparent",
              cell.isToday && "border-blue-300 bg-blue-50",
            )}
          >
            {cell.isEmpty ? null : (
              <>
                <p className="text-sm font-semibold text-slate-900">{cell.label}</p>
                {cell.primary ? (
                  <p className="mt-3 text-xs font-medium text-slate-700">
                    {cell.primary}
                  </p>
                ) : null}
                {cell.secondary ? (
                  <p className="mt-1 text-xs text-slate-500">{cell.secondary}</p>
                ) : null}
                {cell.tone ? (
                  <div className="mt-3">
                    <StatusBadge label="มีรายการ" tone={cell.tone} />
                  </div>
                ) : null}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
