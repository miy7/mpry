import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="app-shell-card w-full max-w-xl p-8 text-center">
        <p className="text-sm font-medium text-blue-700">401 Unauthorized</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          กรุณาเข้าสู่ระบบก่อนใช้งาน
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          หน้านี้สำหรับผู้ใช้ที่ผ่านการยืนยันตัวตนแล้ว หากคุณยังไม่ได้เข้าสู่ระบบ
          กรุณาไปที่หน้าเข้าสู่ระบบก่อน
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
          >
            ไปหน้าเข้าสู่ระบบ
          </Link>
          <Link
            href="/dashboard"
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            กลับหน้าแดชบอร์ด
          </Link>
        </div>
      </div>
    </div>
  );
}
