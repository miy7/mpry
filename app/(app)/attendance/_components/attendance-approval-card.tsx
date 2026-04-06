"use client";

import { useActionState, useEffect } from "react";
import { CheckCheck, CircleOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { initialServerActionState } from "@/lib/form-state";
import type {
  AttendanceApprovalItem,
  ServerActionState,
} from "@/lib/view-models";
import { submitAttendanceApprovalAction } from "../actions";

type AttendanceApprovalCardProps = {
  item: AttendanceApprovalItem;
  mode: "live" | "demo";
};

function Feedback({ state }: { state: ServerActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm font-medium",
        state.status === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700",
      )}
    >
      {state.message}
    </div>
  );
}

export function AttendanceApprovalCard({
  item,
  mode,
}: AttendanceApprovalCardProps) {
  const [state, formAction, pending] = useActionState(
    submitAttendanceApprovalAction,
    initialServerActionState,
  );
  const isDisabled = mode === "demo" || pending;

  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast.success(state.message);
    }

    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
    >
      <input type="hidden" name="attendanceId" value={item.id} />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-slate-900">{item.employeeName}</p>
          <p className="mt-1 text-sm text-slate-500">
            {item.nickname ? `ชื่อเล่น ${item.nickname} • ` : ""}
            {item.teamName}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-800">วันที่</dt>
          <dd className="mt-1">{item.workDateLabel}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-800">รวมเวลา</dt>
          <dd className="mt-1">{item.totalDurationLabel}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-800">เวลาเข้างาน</dt>
          <dd className="mt-1">{item.clockInLabel}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-800">เวลาออกงาน</dt>
          <dd className="mt-1">{item.clockOutLabel}</dd>
        </div>
      </dl>

      {item.note ? (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          หมายเหตุพนักงาน: {item.note}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        <textarea
          name="note"
          className="field-shell min-h-24 w-full resize-none"
          placeholder="บันทึกหมายเหตุประกอบการอนุมัติหรือเหตุผลที่ไม่อนุมัติ"
          disabled={isDisabled}
        />
        <Feedback state={state} />
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="submit"
            name="decision"
            value="approved"
            disabled={isDisabled}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition",
              !isDisabled
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "cursor-not-allowed bg-slate-300",
            )}
          >
            <CheckCheck className="h-4 w-4" />
            อนุมัติ
          </button>
          <button
            type="submit"
            name="decision"
            value="rejected"
            disabled={isDisabled}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition",
              !isDisabled
                ? "bg-red-600 hover:bg-red-700"
                : "cursor-not-allowed bg-slate-300",
            )}
          >
            <CircleOff className="h-4 w-4" />
            ไม่อนุมัติ
          </button>
        </div>
      </div>
    </form>
  );
}
