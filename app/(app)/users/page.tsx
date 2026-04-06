import { KeyRound, ShieldCheck, Users2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth/session";
import { demoUsers } from "@/lib/mock-data";
import { roleLabels } from "@/lib/rbac";

export default async function UsersPage() {
  await requirePageAccess("users");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="manager และ dev"
        title="จัดการรายชื่อทั้งหมดของทุกคน"
        description="ใช้บริหารบัญชีผู้ใช้งานทั้งหมดในระบบ เช่น ลูกทีม, หัวทีม, admin, manager และ dev พร้อมกำหนด role, ปิดการใช้งาน และเตรียม flow reset password"
        actions={
          <button className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
            เพิ่มผู้ใช้ใหม่
          </button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="app-shell-card p-5">
          <Users2 className="h-5 w-5 text-slate-700" />
          <p className="mt-3 text-3xl font-semibold text-slate-950">{demoUsers.length}</p>
          <p className="mt-2 text-sm text-slate-500">บัญชีทั้งหมดในระบบ</p>
        </div>
        <div className="app-shell-card p-5">
          <ShieldCheck className="h-5 w-5 text-blue-700" />
          <p className="mt-3 text-3xl font-semibold text-slate-950">5 role</p>
          <p className="mt-2 text-sm text-slate-500">employee, leader, admin, manager, dev</p>
        </div>
        <div className="app-shell-card p-5">
          <KeyRound className="h-5 w-5 text-amber-700" />
          <p className="mt-3 text-3xl font-semibold text-slate-950">พร้อมต่อยอด</p>
          <p className="mt-2 text-sm text-slate-500">สามารถเพิ่ม reset password ภายหลังได้</p>
        </div>
        <div className="app-shell-card p-5">
          <ShieldCheck className="h-5 w-5 text-emerald-700" />
          <p className="mt-3 text-3xl font-semibold text-slate-950">RBAC ชัดเจน</p>
          <p className="mt-2 text-sm text-slate-500">route access และ action access แยกกัน</p>
        </div>
      </section>

      <section className="app-shell-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="section-title">ค้นหาและกรองตาม role</h2>
            <p className="section-description">
              สำหรับหน้าใช้งานจริง ควรมี search, role filter, active filter และ action menu
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["employee", "leader", "admin", "manager", "dev"].map((role) => (
              <StatusBadge
                key={role}
                label={roleLabels[role as keyof typeof roleLabels]}
                tone="slate"
              />
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-3 font-medium">ชื่อ</th>
                <th className="px-3 py-3 font-medium">Role</th>
                <th className="px-3 py-3 font-medium">ทีม</th>
                <th className="px-3 py-3 font-medium">สถานะ</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {demoUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-900">{user.fullName}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.phone}</p>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge label={roleLabels[user.role]} tone="blue" />
                  </td>
                  <td className="px-3 py-3 text-slate-600">{user.team}</td>
                  <td className="px-3 py-3">
                    <StatusBadge
                      label={user.status === "active" ? "ใช้งานอยู่" : "ปิดการใช้งาน"}
                      tone={user.status === "active" ? "green" : "slate"}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                        แก้ไข
                      </button>
                      <button className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700">
                        ปิดการใช้งาน
                      </button>
                      <button className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                        reset password
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
