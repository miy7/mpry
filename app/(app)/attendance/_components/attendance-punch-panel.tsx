"use client";

import { useActionState, useEffect } from "react";
import { ScanLine, TimerReset } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { initialServerActionState } from "@/lib/form-state";
import type {
  AttendanceCurrentState,
  ServerActionState,
} from "@/lib/view-models";
import { StatusBadge } from "@/components/ui/status-badge";
import { clockInAction, clockOutAction } from "../actions";

type AttendancePunchPanelProps = {
  mode: "live" | "demo";
  viewerRole: string;
  todayState: AttendanceCurrentState | null;
};

function ActionMessage({ state }: { state: ServerActionState }) {
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

export function AttendancePunchPanel({
  mode,
  viewerRole,
  todayState,
}: AttendancePunchPanelProps) {
  const [clockInState, clockInFormAction, clockInPending] = useActionState(
    clockInAction,
    initialServerActionState,
  );
  const [clockOutState, clockOutFormAction, clockOutPending] = useActionState(
    clockOutAction,
    initialServerActionState,
  );

  const canUseClock =
    mode === "live" && viewerRole === "employee" && todayState !== null;
  const canClockIn = canUseClock && Boolean(todayState?.canClockIn);
  const canClockOut = canUseClock && Boolean(todayState?.canClockOut);

  useEffect(() => {
    if (clockInState.status === "success" && clockInState.message) {
      toast.success(clockInState.message);
    }

    if (clockInState.status === "error" && clockInState.message) {
      toast.error(clockInState.message);
    }
  }, [clockInState]);

  useEffect(() => {
    if (clockOutState.status === "success" && clockOutState.message) {
      toast.success(clockOutState.message);
    }

    if (clockOutState.status === "error" && clockOutState.message) {
      toast.error(clockOutState.message);
    }
  }, [clockOutState]);

  return (
    <div className="app-shell-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">บันทึกเวลาเข้า-ออก</h2>
          <p className="section-description">
            ปุ่มใหญ่กดง่ายสำหรับมือถือ พร้อมล็อกการแก้ไขหลังอนุมัติแล้ว
          </p>
        </div>
        <StatusBadge
          label={viewerRole === "employee" ? "ลูกทีมใช้งานหลัก" : "มุมมองติดตาม"}
          tone="blue"
        />
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          สถานะล่าสุดของวันนี้
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge
            label={`เข้า ${todayState?.clockInLabel ?? "-"}`}
            tone={todayState?.clockInLabel && todayState.clockInLabel !== "-" ? "green" : "slate"}
          />
          <StatusBadge
            label={`ออก ${todayState?.clockOutLabel ?? "-"}`}
            tone={todayState?.clockOutLabel && todayState.clockOutLabel !== "-" ? "green" : "slate"}
          />
          <StatusBadge
            label={todayState?.statusLabel ?? "ยังไม่มีรายการวันนี้"}
            tone={todayState?.statusTone ?? "slate"}
          />
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {todayState?.note
            ? `หมายเหตุล่าสุด: ${todayState.note}`
            : viewerRole === "employee"
              ? "เมื่อบันทึกเวลาออกงานแล้ว รายการจะเข้าสู่สถานะรอหัวทีมยืนยันอัตโนมัติ"
              : "สิทธิ์ลงเวลาใช้งานได้เฉพาะบทบาทลูกทีม ส่วนหัวทีมและผู้ดูแลใช้หน้านี้เพื่อตรวจสอบและอนุมัติ"}
        </p>
      </div>

      <div className="mt-5 grid gap-4">
        <form action={clockInFormAction} className="space-y-3">
          <textarea
            name="note"
            className="field-shell min-h-24 w-full resize-none"
            placeholder="หมายเหตุเข้างาน เช่น เข้าหน้างานโดยตรง"
            disabled={!canUseClock || clockInPending}
          />
          <ActionMessage state={clockInState} />
          <button
            type="submit"
            disabled={!canClockIn || clockInPending}
            className={cn(
              "flex min-h-24 w-full items-center justify-center gap-3 rounded-[28px] px-5 py-6 text-lg font-semibold text-white shadow-sm transition",
              canClockIn && !clockInPending
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "cursor-not-allowed bg-slate-300",
            )}
          >
            <ScanLine className="h-5 w-5" />
            {clockInPending ? "กำลังบันทึกเวลาเข้า..." : "บันทึกเวลาเข้างาน"}
          </button>
        </form>

        <form action={clockOutFormAction} className="space-y-3">
          <textarea
            name="note"
            className="field-shell min-h-24 w-full resize-none"
            placeholder="หมายเหตุออกงาน เช่น ปิดงานเรียบร้อยหรือแจ้งปัญหา"
            disabled={!canUseClock || clockOutPending}
          />
          <ActionMessage state={clockOutState} />
          <button
            type="submit"
            disabled={!canClockOut || clockOutPending}
            className={cn(
              "flex min-h-24 w-full items-center justify-center gap-3 rounded-[28px] px-5 py-6 text-lg font-semibold text-white shadow-sm transition",
              canClockOut && !clockOutPending
                ? "bg-slate-900 hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-300",
            )}
          >
            <TimerReset className="h-5 w-5" />
            {clockOutPending ? "กำลังบันทึกเวลาออก..." : "บันทึกเวลาออกงาน"}
          </button>
        </form>
      </div>

      {todayState?.approverName ? (
        <p className="mt-4 text-sm leading-6 text-slate-500">
          ผู้ยืนยันที่ระบบผูกไว้:{" "}
          <span className="font-semibold text-slate-900">
            {todayState.approverName}
          </span>
        </p>
      ) : null}
    </div>
  );
}
