import type { ReactNode } from "react";
import Link from "next/link";
import { BellDot, BookOpenText } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { MainNav } from "@/components/layout/main-nav";
import { StatusBadge } from "@/components/ui/status-badge";
import { roleLabels } from "@/lib/rbac";
import type { AppViewer } from "@/lib/types";

type AppShellProps = {
  user: AppViewer;
  children: ReactNode;
};

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl gap-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-4 space-y-4">
            <div className="app-shell-card p-5">
              <p className="text-sm font-semibold text-blue-700">
                ระบบเช็ควันทำงาน
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Daily Workforce
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                ระบบสำหรับลูกทีม หัวทีม และผู้ดูแล ที่ออกแบบให้ใช้งานง่ายบนมือถือ
                และพร้อมต่อยอดเข้าฐานข้อมูลจริง
              </p>
            </div>

            <div className="app-shell-card p-4">
              <MainNav role={user.role} />
            </div>

            <div className="app-shell-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {user.fullName}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{user.position}</p>
                </div>
                <StatusBadge label={roleLabels[user.role]} tone="blue" />
              </div>

              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between gap-4">
                  <dt>ทีม</dt>
                  <dd className="font-medium text-slate-900">{user.team}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt>สถานะ</dt>
                  <dd className="font-medium text-emerald-700">
                    {user.isDemoMode ? "โหมดเดโม" : "พร้อมใช้งาน"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col pb-24 lg:pb-8">
          <header className="app-shell-card sticky top-4 z-20 mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                {user.isDemoMode
                  ? "โหมดเดโมสำหรับสำรวจ UX"
                  : `กำลังใช้งานด้วยบัญชี ${user.username ?? user.fullName}`}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                ใช้งานง่ายบนมือถือ ปุ่มชัด อ่านเร็ว และแยกสิทธิ์ชัดเจนตาม role
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {user.isDemoMode ? (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  <BellDot className="h-4 w-4" />
                  เข้าสู่ระบบ
                </Link>
              ) : (
                <LogoutButton className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700" />
              )}

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                <BookOpenText className="h-4 w-4" />
                ดูหน้าหลัก
              </Link>
            </div>
          </header>

          {user.isDemoMode ? (
            <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
              ขณะนี้ระบบกำลังแสดงในโหมดเดโม เพราะยังไม่ได้ตั้งค่า
              <span className="mx-1 font-mono">DATABASE_URL</span>
              สำหรับเปิด session และเชื่อมฐานข้อมูลจริง
            </div>
          ) : null}

          <main className="flex-1 space-y-6">{children}</main>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-30 px-4 lg:hidden">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white/95 p-2 shadow-[var(--shadow)] backdrop-blur">
          <MainNav role={user.role} compact />
        </div>
      </div>
    </div>
  );
}
