import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { StatusBadge } from "@/components/ui/status-badge";
import { demoUsers } from "@/lib/mock-data";
import { roleLabels } from "@/lib/rbac";
import { getServerAuthSession, isAuthEnabled } from "@/lib/auth/session";

export default async function LoginPage() {
  const authEnabled = isAuthEnabled();
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="app-shell-card p-6 sm:p-8">
          <StatusBadge
            label={authEnabled ? "ล็อกอินใช้งานจริง" : "โหมดเดโม / ยังไม่เปิดล็อกอินจริง"}
            tone={authEnabled ? "green" : "amber"}
          />

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
            เข้าสู่ระบบเช็ควันทำงาน
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            ระบบนี้รองรับล็อกอินด้วย Credentials ผ่าน NextAuth และ Prisma
            พร้อมส่ง role เข้า session เพื่อใช้ทำ RBAC ทั้งหน้าและ action
            ฝั่งเซิร์ฟเวอร์
          </p>

          <LoginForm authEnabled={authEnabled} />

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <p className="text-sm font-semibold text-slate-900">
                สิ่งที่ระบบชุดนี้ทำครบแล้ว
              </p>
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              <li>ล็อกอินด้วย username/email + password</li>
              <li>เก็บ role ใน session เพื่อใช้กำหนดสิทธิ์รายหน้า</li>
              <li>มีปุ่มออกจากระบบจากหน้าแอปหลัก</li>
              <li>กันหน้าตาม role และ redirect เมื่อสิทธิ์ไม่พอ</li>
            </ul>
          </div>
        </section>

        <section className="app-shell-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">
            ตัวอย่างบัญชีเริ่มต้นสำหรับ seed
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            ใช้เพื่อทดสอบ permission ของแต่ละ role และ flow การทำงานตามหน้าที่
          </p>

          <div className="mt-6 space-y-3">
            {demoUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{user.fullName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {user.username} • {user.position} • {user.team}
                    </p>
                  </div>
                  <StatusBadge label={roleLabels[user.role]} tone="slate" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              เข้าหน้าเดโมทันที
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
