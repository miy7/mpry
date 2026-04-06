"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { initialServerActionState } from "@/lib/form-state";
import { toggleEmployeeStatusAction } from "../actions";

type EmployeeStatusToggleProps = {
  employeeId: string;
  currentStatus: "active" | "inactive" | "suspended";
  disabled?: boolean;
};

export function EmployeeStatusToggle({
  employeeId,
  currentStatus,
  disabled = false,
}: EmployeeStatusToggleProps) {
  const [state, formAction, pending] = useActionState(
    toggleEmployeeStatusAction,
    initialServerActionState,
  );
  const nextStatus = currentStatus === "active" ? "inactive" : "active";
  const label =
    currentStatus === "active" ? "ปิดการใช้งาน" : "เปิดการใช้งาน";

  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast.success(state.message);
    }

    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="employeeId" value={employeeId} />
      <input type="hidden" name="nextStatus" value={nextStatus} />
      <button
        type="submit"
        disabled={disabled || pending}
        className={`rounded-2xl border px-3 py-2 text-xs font-semibold ${
          !disabled && !pending
            ? "border-slate-200 bg-white text-slate-700"
            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
        }`}
      >
        {pending ? "กำลังบันทึก..." : label}
      </button>
    </form>
  );
}
