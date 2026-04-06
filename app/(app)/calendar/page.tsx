import { Filter, Search } from "lucide-react";
import { MonthGrid } from "@/components/ui/month-grid";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth/session";
import {
  attendanceMonthCells,
  attendanceRecords,
  demoReferenceDate,
} from "@/lib/mock-data";
import { formatThaiMonth } from "@/lib/format";

export default async function AttendanceCalendarPage() {
  await requirePageAccess("calendar");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="เฉพาะหัวทีมขึ้นไป"
        title="Calendar การมาทำงาน"
        description="ดูว่าลูกทีมคนไหนมาทำงานวันไหนบ้าง พร้อมสถานะยืนยันจากหัวทีม และค้นหาย้อนหลังได้ทั้งแบบปฏิทินและตารางรายการ"
      />

      <section className="app-shell-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="section-title">ตัวกรองข้อมูล</h2>
            <p className="section-description">
              กรองตามทีม, หัวทีม, พนักงาน, เดือน และช่วงวันที่
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="field-shell flex min-w-56 items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <span className="text-slate-400">ค้นหาชื่อพนักงานหรือทีม</span>
            </div>
            <div className="field-shell flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-slate-400">เลือกช่วงวันที่</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge label="ทีมติดตั้ง A" tone="blue" />
          <StatusBadge label="หัวทีม: สิรภพ สายชล" tone="slate" />
          <StatusBadge label={formatThaiMonth(demoReferenceDate)} tone="green" />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <MonthGrid
          monthLabel={formatThaiMonth(demoReferenceDate)}
          cells={attendanceMonthCells}
          legend={[
            { label: "ยืนยันแล้ว", tone: "green" },
            { label: "รอยืนยัน", tone: "amber" },
            { label: "ไม่อนุมัติ", tone: "red" },
          ]}
        />

        <div className="app-shell-card p-5">
          <h2 className="section-title">สรุปสถานะรายวัน</h2>
          <p className="section-description">
            มองภาพรวมได้เร็วว่ามีรายการรอยืนยันหรือรายการผิดปกติวันไหนบ้าง
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-800">ยืนยันแล้ว</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-900">42</p>
              <p className="mt-2 text-sm text-emerald-700">รายการในช่วงเดือนปัจจุบัน</p>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">รอหัวทีมยืนยัน</p>
              <p className="mt-2 text-3xl font-semibold text-amber-900">6</p>
              <p className="mt-2 text-sm text-amber-700">ต้องติดตามภายในวันนี้</p>
            </div>
            <div className="rounded-3xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-800">ไม่อนุมัติ</p>
              <p className="mt-2 text-3xl font-semibold text-red-900">1</p>
              <p className="mt-2 text-sm text-red-700">มีรายการต้องให้ลูกทีมแก้ไข</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-100 p-4">
              <p className="text-sm font-semibold text-slate-700">ทีมที่ดูแล</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">3</p>
              <p className="mt-2 text-sm text-slate-600">พร้อม drill-down รายทีม</p>
            </div>
          </div>
        </div>
      </section>

      <section className="app-shell-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="section-title">ตารางย้อนหลัง</h2>
            <p className="section-description">
              ใช้ติดตามประวัติการมาทำงานย้อนหลังและตรวจสอบสถานะอนุมัติรายรายการ
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge label="เขียว = ยืนยันแล้ว" tone="green" />
            <StatusBadge label="แดง = ไม่อนุมัติ" tone="red" />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-3 font-medium">พนักงาน</th>
                <th className="px-3 py-3 font-medium">ทีม</th>
                <th className="px-3 py-3 font-medium">วันที่</th>
                <th className="px-3 py-3 font-medium">เข้างาน</th>
                <th className="px-3 py-3 font-medium">ออกงาน</th>
                <th className="px-3 py-3 font-medium">สถานะ</th>
                <th className="px-3 py-3 font-medium">หัวทีม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {attendanceRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {record.employeeName}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{record.team}</td>
                  <td className="px-3 py-3 text-slate-600">{record.workDate}</td>
                  <td className="px-3 py-3 text-slate-600">{record.clockIn}</td>
                  <td className="px-3 py-3 text-slate-600">{record.clockOut}</td>
                  <td className="px-3 py-3">
                    {record.status === "approved" ? (
                      <StatusBadge label="ยืนยันแล้ว" tone="green" />
                    ) : record.status === "rejected" ? (
                      <StatusBadge label="ไม่อนุมัติ" tone="red" />
                    ) : (
                      <StatusBadge label="รอยืนยัน" tone="amber" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{record.approver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
