import { cn } from "@/lib/cn";
import type { BadgeTone } from "@/lib/types";

const toneStyles: Record<BadgeTone, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-700",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-red-200 bg-red-50 text-red-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  slate: "border-slate-200 bg-slate-100 text-slate-700",
};

type StatusBadgeProps = {
  label: string;
  tone?: BadgeTone;
  className?: string;
};

export function StatusBadge({
  label,
  tone = "slate",
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        toneStyles[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
