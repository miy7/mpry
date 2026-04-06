import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  icon?: ReactNode;
};

export function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <div className="app-shell-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        {icon ? (
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">{icon}</div>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{hint}</p>
    </div>
  );
}
