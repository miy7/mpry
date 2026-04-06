import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="app-shell-card w-full max-w-xl p-8 text-center">
        <p className="text-sm font-medium text-red-700">403 Forbidden</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          คุณยังไม่มีสิทธิ์เข้าถึงหน้านี้
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          ระบบ RBAC ควรตรวจสอบสิทธิ์ทั้งในหน้า, route handler และ server action
          ก่อนอนุญาตให้เข้าถึงข้อมูลหรือทำรายการสำคัญ
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            กลับไปหน้าแดชบอร์ด
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            เปลี่ยนบัญชีผู้ใช้
          </Link>
        </div>
      </div>
    </div>
  );
}
