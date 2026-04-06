import Link from "next/link";
import {
  Building2,
  Landmark,
  Phone,
  UserSquare2,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth/session";
import { getEmployeesPageData } from "@/lib/server/employees";
import { EmployeeForm } from "./_components/employee-form";
import { EmployeeStatusToggle } from "./_components/employee-status-toggle";

type EmployeesPageProps = {
  searchParams: Promise<{
    q?: string;
    team?: string;
    status?: string;
    employeeId?: string;
  }>;
};

function normalizeStatus(value?: string) {
  if (value === "active" || value === "inactive" || value === "suspended") {
    return value;
  }

  return "all";
}

export default async function EmployeesPage({
  searchParams,
}: EmployeesPageProps) {
  const viewer = await requirePageAccess("employees");
  const params = await searchParams;
  const data = await getEmployeesPageData(viewer, {
    q: params.q,
    teamId: params.team,
    status: normalizeStatus(params.status),
    employeeId: params.employeeId,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="admin ขึ้นไป"
        title="ข้อมูลพนักงาน"
        description="จัดการข้อมูลพื้นฐานของพนักงานแบบใช้งานจริง ทั้งรายการ, ค้นหา, เพิ่ม/แก้ไข, และปิดการใช้งาน โดยแยกฟอร์มให้ใช้งานง่ายทั้งมือถือและเดสก์ท็อป"
        actions={
          <>
            <Link
              href="/employees"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
            >
              ล้างตัวกรอง
            </Link>
            <Link
              href="/employees"
              className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              เพิ่มข้อมูลพนักงาน
            </Link>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="พนักงานในรายการนี้"
          value={`${data.counts.total} คน`}
          hint="นับตามตัวกรองที่เลือกอยู่ตอนนี้"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="ใช้งานอยู่"
          value={`${data.counts.active} คน`}
          hint="บัญชีที่พร้อมเข้าสู่ระบบและใช้งานต่อได้ทันที"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="ปิดการใช้งาน"
          value={`${data.counts.inactive} คน`}
          hint="ใช้ soft disable แทนการลบจริงเพื่อรักษาประวัติ"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="ระงับชั่วคราว"
          value={`${data.counts.suspended} คน`}
          hint="แยกกรณีพักสิทธิ์ออกจากการปิดใช้งานถาวร"
          icon={<Users className="h-5 w-5" />}
        />
      </section>

      <section className="app-shell-card p-5">
        <form className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <input
            name="q"
            defaultValue={data.filters.q}
            className="field-shell w-full"
            placeholder="ค้นหาชื่อ, รหัสพนักงาน, ชื่อผู้ใช้, อีเมล"
          />
          <select
            name="team"
            defaultValue={data.filters.teamId}
            className="field-shell w-full"
          >
            <option value="">ทุกทีม</option>
            {data.teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.label}
              </option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={data.filters.status}
            className="field-shell w-full"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="active">ใช้งานอยู่</option>
            <option value="inactive">ปิดการใช้งาน</option>
            <option value="suspended">ระงับชั่วคราว</option>
          </select>
          <button
            type="submit"
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            ค้นหา
          </button>
        </form>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="app-shell-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="section-title">รายการพนักงาน</h2>
                <p className="section-description">
                  แสดงเป็นการ์ดเพื่ออ่านง่ายบนมือถือ พร้อมปุ่มแก้ไขและเปลี่ยนสถานะอย่างรวดเร็ว
                </p>
              </div>
              <StatusBadge
                label={data.mode === "demo" ? "โหมดเดโม" : "เชื่อมฐานข้อมูลจริง"}
                tone={data.mode === "demo" ? "amber" : "green"}
              />
            </div>

            {data.employees.length > 0 ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {data.employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {employee.fullName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {employee.employeeCode}
                          {employee.nickname ? ` • ชื่อเล่น ${employee.nickname}` : ""}
                        </p>
                      </div>
                      <StatusBadge
                        label={employee.statusLabel}
                        tone={employee.statusTone}
                      />
                    </div>

                    <dl className="mt-4 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{employee.phone ?? "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span>
                          {employee.teamName} • {employee.positionTitle}
                        </span>
                      </div>
                      {employee.bankName ? (
                        <div className="flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-slate-400" />
                          <span>
                            {employee.bankName}
                            {employee.bankAccountMasked
                              ? ` • ${employee.bankAccountMasked}`
                              : ""}
                          </span>
                        </div>
                      ) : null}
                      {employee.leaderName ? (
                        <div className="flex items-center gap-2">
                          <UserSquare2 className="h-4 w-4 text-slate-400" />
                          <span>หัวหน้า: {employee.leaderName}</span>
                        </div>
                      ) : null}
                    </dl>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/employees?employeeId=${employee.id}`}
                        className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                      >
                        แก้ไขข้อมูล
                      </Link>
                      <EmployeeStatusToggle
                        employeeId={employee.id}
                        currentStatus={employee.status}
                        disabled={employee.userId === viewer.id}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
                ยังไม่พบข้อมูลพนักงานตามตัวกรองที่เลือก
              </div>
            )}
          </div>

          <div className="app-shell-card p-5">
            <h2 className="section-title">ตารางสรุปรายการ</h2>
            <p className="section-description">
              ใช้ดูข้อมูลแบบรวบรัดเมื่ออยากตรวจหลายคนพร้อมกัน
            </p>

            {data.employees.length > 0 ? (
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="px-3 py-3 font-medium">รหัส</th>
                      <th className="px-3 py-3 font-medium">ชื่อ</th>
                      <th className="px-3 py-3 font-medium">ทีม</th>
                      <th className="px-3 py-3 font-medium">สถานะ</th>
                      <th className="px-3 py-3 font-medium">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data.employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-3 py-3 text-slate-600">
                          {employee.employeeCode}
                        </td>
                        <td className="px-3 py-3">
                          <div className="font-medium text-slate-900">
                            {employee.fullName}
                          </div>
                          <div className="text-slate-500">
                            {employee.positionTitle}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-slate-600">
                          {employee.teamName}
                        </td>
                        <td className="px-3 py-3">
                          <StatusBadge
                            label={employee.statusLabel}
                            tone={employee.statusTone}
                          />
                        </td>
                        <td className="px-3 py-3">
                          <Link
                            href={`/employees?employeeId=${employee.id}`}
                            className="text-sm font-semibold text-blue-700"
                          >
                            เปิดแก้ไข
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </div>

        <EmployeeForm
          mode={data.mode}
          selectedEmployee={data.selectedEmployee}
          teams={data.teams}
          leaders={data.leaders}
        />
      </section>
    </div>
  );
}
