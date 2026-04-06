"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { initialServerActionState } from "@/lib/form-state";
import type {
  EmployeeFormOption,
  EmployeeFormValues,
} from "@/lib/view-models";
import { saveEmployeeAction } from "../actions";

type EmployeeFormProps = {
  mode: "live" | "demo";
  selectedEmployee: EmployeeFormValues | null;
  teams: EmployeeFormOption[];
  leaders: EmployeeFormOption[];
};

function FieldError({
  errors,
  name,
}: {
  errors?: Partial<Record<string, string[]>>;
  name: string;
}) {
  const message = errors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>;
}

export function EmployeeForm({
  mode,
  selectedEmployee,
  teams,
  leaders,
}: EmployeeFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    saveEmployeeAction,
    initialServerActionState,
  );
  const isEditing = Boolean(selectedEmployee?.id);
  const isDemo = mode === "demo";

  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast.success(state.message);

      if (!isEditing) {
        formRef.current?.reset();
      }
    }

    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [isEditing, state]);

  return (
    <form
      key={selectedEmployee?.id ?? "new-employee"}
      ref={formRef}
      action={formAction}
      className="app-shell-card p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">
            {isEditing ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มข้อมูลพนักงาน"}
          </h2>
          <p className="section-description">
            ฟอร์มนี้จะสร้างหรืออัปเดตทั้งข้อมูลบัญชีผู้ใช้พื้นฐานและโปรไฟล์พนักงาน
          </p>
        </div>
        {isEditing ? (
          <Link
            href="/employees"
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            เพิ่มคนใหม่
          </Link>
        ) : null}
      </div>

      <input type="hidden" name="employeeId" value={selectedEmployee?.id ?? ""} />

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            รหัสพนักงาน
          </label>
          <input
            name="employeeCode"
            defaultValue={selectedEmployee?.employeeCode ?? ""}
            className="field-shell w-full"
            placeholder="เช่น EMP-1201"
            disabled={isDemo || pending}
          />
          <FieldError errors={state.fieldErrors} name="employeeCode" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            ชื่อผู้ใช้
          </label>
          <input
            name="username"
            defaultValue={selectedEmployee?.username ?? ""}
            className="field-shell w-full"
            placeholder="เช่น employee03"
            disabled={isDemo || pending}
          />
          <FieldError errors={state.fieldErrors} name="username" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            ชื่อจริง
          </label>
          <input
            name="firstNameTh"
            defaultValue={selectedEmployee?.firstNameTh ?? ""}
            className="field-shell w-full"
            placeholder="ชื่อจริง"
            disabled={isDemo || pending}
          />
          <FieldError errors={state.fieldErrors} name="firstNameTh" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            นามสกุล
          </label>
          <input
            name="lastNameTh"
            defaultValue={selectedEmployee?.lastNameTh ?? ""}
            className="field-shell w-full"
            placeholder="นามสกุล"
            disabled={isDemo || pending}
          />
          <FieldError errors={state.fieldErrors} name="lastNameTh" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            ชื่อเล่น
          </label>
          <input
            name="nickname"
            defaultValue={selectedEmployee?.nickname ?? ""}
            className="field-shell w-full"
            placeholder="ชื่อเล่น"
            disabled={isDemo || pending}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            เบอร์โทร
          </label>
          <input
            name="phone"
            defaultValue={selectedEmployee?.phone ?? ""}
            className="field-shell w-full"
            placeholder="08x-xxx-xxxx"
            disabled={isDemo || pending}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            อีเมล
          </label>
          <input
            name="email"
            defaultValue={selectedEmployee?.email ?? ""}
            className="field-shell w-full"
            placeholder="employee@company.local"
            disabled={isDemo || pending}
          />
          <FieldError errors={state.fieldErrors} name="email" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            ตำแหน่ง
          </label>
          <input
            name="positionTitle"
            defaultValue={selectedEmployee?.positionTitle ?? ""}
            className="field-shell w-full"
            placeholder="เช่น ช่างติดตั้งรายวัน"
            disabled={isDemo || pending}
          />
          <FieldError errors={state.fieldErrors} name="positionTitle" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            ทีม
          </label>
          <select
            name="teamId"
            defaultValue={selectedEmployee?.teamId ?? ""}
            className="field-shell w-full"
            disabled={isDemo || pending}
          >
            <option value="">ยังไม่ระบุทีม</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            หัวหน้าที่ดูแล
          </label>
          <select
            name="leaderId"
            defaultValue={selectedEmployee?.leaderId ?? ""}
            className="field-shell w-full"
            disabled={isDemo || pending}
          >
            <option value="">ยังไม่ระบุหัวหน้า</option>
            {leaders.map((leader) => (
              <option key={leader.id} value={leader.id}>
                {leader.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            สถานะการใช้งาน
          </label>
          <select
            name="status"
            defaultValue={selectedEmployee?.status ?? "active"}
            className="field-shell w-full"
            disabled={isDemo || pending}
          >
            <option value="active">ใช้งานอยู่</option>
            <option value="inactive">ปิดการใช้งาน</option>
            <option value="suspended">ระงับชั่วคราว</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            วันที่เริ่มงาน
          </label>
          <input
            type="date"
            name="startedAt"
            defaultValue={selectedEmployee?.startedAt ?? ""}
            className="field-shell w-full"
            disabled={isDemo || pending}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            เลขบัญชี
          </label>
          <input
            name="bankAccountNo"
            defaultValue={selectedEmployee?.bankAccountNo ?? ""}
            className="field-shell w-full"
            placeholder="เลขบัญชีธนาคาร"
            disabled={isDemo || pending}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            ธนาคาร
          </label>
          <input
            name="bankName"
            defaultValue={selectedEmployee?.bankName ?? ""}
            className="field-shell w-full"
            placeholder="เช่น กสิกรไทย"
            disabled={isDemo || pending}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          หมายเหตุ
        </label>
        <textarea
          name="note"
          defaultValue={selectedEmployee?.note ?? ""}
          className="field-shell min-h-28 w-full resize-none"
          placeholder="หมายเหตุเพิ่มเติม เช่น ข้อมูลการเข้าหน้างานหรือข้อควรระวัง"
          disabled={isDemo || pending}
        />
        <FieldError errors={state.fieldErrors} name="note" />
      </div>

      {!isEditing ? (
        <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          เมื่อสร้างพนักงานใหม่ ระบบจะตั้งรหัสผ่านเริ่มต้นเป็น{" "}
          <span className="font-mono">Pass@1234</span> เพื่อให้ใช้งานได้ทันที
          และสามารถวางแผน flow เปลี่ยนรหัสผ่านภายหลังได้
        </div>
      ) : selectedEmployee?.roleLabel ? (
        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
          บัญชีนี้มี role ปัจจุบันเป็น{" "}
          <span className="font-semibold text-slate-900">
            {selectedEmployee.roleLabel}
          </span>{" "}
          หากต้องการเปลี่ยนสิทธิ์ระดับระบบ ให้จัดการต่อจากหน้ารายชื่อผู้ใช้
        </div>
      ) : null}

      {state.status !== "idle" && state.message ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${
            state.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isDemo || pending}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white ${
            !isDemo && !pending
              ? "bg-slate-900"
              : "cursor-not-allowed bg-slate-300"
          }`}
        >
          {pending
            ? "กำลังบันทึกข้อมูล..."
            : isEditing
              ? "บันทึกการแก้ไข"
              : "เพิ่มพนักงาน"}
        </button>
        <Link
          href="/employees"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
        >
          ล้างฟอร์ม
        </Link>
      </div>
    </form>
  );
}
