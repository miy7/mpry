import { ClipboardCheck, CircleCheckBig, CircleOff } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth/session";
import { formatThaiDate } from "@/lib/format";
import { getAttendancePageData } from "@/lib/server/attendance";
import { AttendanceApprovalCard } from "./_components/attendance-approval-card";
import { AttendancePunchPanel } from "./_components/attendance-punch-panel";

export default async function AttendancePage() {
  const viewer = await requirePageAccess("attendance");
  const data = await getAttendancePageData(viewer);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={formatThaiDate(new Date())}
        title="ลงเวลาทำงานเข้า-ออก"
        description="ลูกทีมสามารถบันทึกเวลาเข้าและออกงานของตัวเองได้ทันทีจากมือถือ เมื่อบันทึกเวลาออกแล้วรายการจะเข้าสู่สถานะรอหัวทีมยืนยัน ส่วนหัวทีมและผู้ดูแลสามารถอนุมัติหรือไม่อนุมัติได้จากหน้าเดียวกัน"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="รายการล่าสุดในมุมมองนี้"
          value={`${data.summary.totalRecords} รายการ`}
          hint="นับจากประวัติที่แสดงในหน้าปัจจุบัน"
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
        <StatCard
          label="รอหัวทีมยืนยัน"
          value={`${data.summary.pendingCount} รายการ`}
          hint="รายการที่บันทึกออกงานแล้วและกำลังรออนุมัติ"
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
        <StatCard
          label="ยืนยันแล้ว"
          value={`${data.summary.approvedCount} รายการ`}
          hint="รายการที่ถูกอนุมัติและล็อกข้อมูลเรียบร้อยแล้ว"
          icon={<CircleCheckBig className="h-5 w-5" />}
        />
        <StatCard
          label="ไม่อนุมัติ"
          value={`${data.summary.rejectedCount} รายการ`}
          hint="รายการที่ถูกตีกลับเพื่อให้ตรวจสอบหรือแก้ไข"
          icon={<CircleOff className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <AttendancePunchPanel
          mode={data.mode}
          viewerRole={viewer.role}
          todayState={data.todayState}
        />

        <div className="app-shell-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="section-title">คิวรอยืนยันจากหัวทีม</h2>
              <p className="section-description">
                แสดงรายการที่ลงเวลาออกงานแล้วและต้องการการยืนยันซ้ำจากหัวทีมหรือผู้ดูแลระบบ
              </p>
            </div>
            <StatusBadge
              label={
                data.pendingApprovals.length > 0
                  ? `${data.pendingApprovals.length} รายการ`
                  : "ไม่มีคิวค้าง"
              }
              tone={data.pendingApprovals.length > 0 ? "amber" : "green"}
            />
          </div>

          {data.pendingApprovals.length > 0 ? (
            <div className="mt-5 space-y-4">
              {data.pendingApprovals.map((item) => (
                <AttendanceApprovalCard
                  key={item.id}
                  item={item}
                  mode={data.mode}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
              ตอนนี้ยังไม่มีรายการที่รออนุมัติในขอบเขตที่บัญชีนี้ดูแลอยู่
            </div>
          )}
        </div>
      </section>

      <section className="app-shell-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="section-title">ประวัติลงเวลาและสถานะล่าสุด</h2>
            <p className="section-description">
              พนักงานเห็นประวัติของตนเอง ส่วนหัวทีมและผู้ดูแลจะเห็นรายการตามขอบเขตสิทธิ์ที่ระบบกำหนด
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge label="รอยืนยัน" tone="amber" />
            <StatusBadge label="ยืนยันแล้ว" tone="green" />
            <StatusBadge label="ไม่อนุมัติ" tone="red" />
          </div>
        </div>

        {data.records.length > 0 ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-3 font-medium">พนักงาน</th>
                  <th className="px-3 py-3 font-medium">ทีม</th>
                  <th className="px-3 py-3 font-medium">วันที่</th>
                  <th className="px-3 py-3 font-medium">เข้า</th>
                  <th className="px-3 py-3 font-medium">ออก</th>
                  <th className="px-3 py-3 font-medium">รวมเวลา</th>
                  <th className="px-3 py-3 font-medium">สถานะ</th>
                  <th className="px-3 py-3 font-medium">ผู้อนุมัติ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.records.map((record) => (
                  <tr key={record.id}>
                    <td className="px-3 py-3 font-medium text-slate-900">
                      {record.employeeName}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{record.teamName}</td>
                    <td className="px-3 py-3 text-slate-600">{record.workDateLabel}</td>
                    <td className="px-3 py-3 text-slate-600">{record.clockInLabel}</td>
                    <td className="px-3 py-3 text-slate-600">{record.clockOutLabel}</td>
                    <td className="px-3 py-3 text-slate-600">
                      {record.totalDurationLabel}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge
                        label={record.statusLabel}
                        tone={record.statusTone}
                      />
                    </td>
                    <td className="px-3 py-3 text-slate-600">
                      {record.approverName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
            ยังไม่มีประวัติลงเวลาในมุมมองนี้
          </div>
        )}
      </section>
    </div>
  );
}
