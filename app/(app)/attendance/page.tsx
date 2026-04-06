import { CircleCheckBig, CircleOff, ScanLine, TimerReset } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth/session";
import { attendanceRecords, demoReferenceDate } from "@/lib/mock-data";
import { formatThaiDate } from "@/lib/format";

export default async function AttendancePage() {
  await requirePageAccess("attendance");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={formatThaiDate(demoReferenceDate)}
        title="ลงเวลาทำงานเข้า-ออก"
        description="หน้าสำหรับลูกทีมลงเวลาเข้างานและออกงานประจำวัน จากนั้นรายการจะเข้าสถานะรอหัวทีมยืนยัน เมื่ออนุมัติแล้วควรล็อกข้อมูลสำคัญเพื่อป้องกันการแก้ไขย้อนหลัง"
      />

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="app-shell-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="section-title">ปุ่มลงเวลาหลัก</h2>
              <p className="section-description">
                ออกแบบให้กดง่ายบนมือถือ ปุ่มใหญ่ สีชัด และอ่านสถานะได้ทันที
              </p>
            </div>
            <StatusBadge label="employee ใช้งานหลัก" tone="blue" />
          </div>

          <div className="mt-5 grid gap-4">
            <button className="flex min-h-28 items-center justify-center gap-3 rounded-[28px] bg-emerald-600 px-5 py-6 text-lg font-semibold text-white shadow-sm">
              <ScanLine className="h-5 w-5" />
              บันทึกเวลาเข้างาน
            </button>
            <button className="flex min-h-28 items-center justify-center gap-3 rounded-[28px] bg-slate-900 px-5 py-6 text-lg font-semibold text-white shadow-sm">
              <TimerReset className="h-5 w-5" />
              บันทึกเวลาออกงาน
            </button>
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">สถานะล่าสุดของวันนี้</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge label="เข้างานแล้ว 08:24" tone="green" />
              <StatusBadge label="ออกงานแล้ว 17:35" tone="green" />
              <StatusBadge label="รอหัวทีมยืนยัน" tone="amber" />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              เมื่อหัวทีมยืนยันแล้ว ให้ล็อกเวลาเข้าออกและบันทึกเวลาอนุมัติไว้ใน
              AttendanceApproval
            </p>
          </div>
        </div>

        <div className="app-shell-card p-5">
          <h2 className="section-title">Workflow ที่ระบบต้องรองรับ</h2>
          <p className="section-description">
            Flow หลักสำหรับลูกทีมและหัวทีมตามที่กำหนดไว้ใน requirement
          </p>
          <div className="mt-5 space-y-4">
            {[
              {
                step: "1. ลูกทีมกดลงเวลาเข้างาน",
                detail: "ระบบบันทึกวันที่และเวลาอัตโนมัติ พร้อมผูกกับผู้ใช้ที่ล็อกอินอยู่",
              },
              {
                step: "2. ลูกทีมกดลงเวลาออกงาน",
                detail: "ระบบคำนวณชั่วโมงรวมเบื้องต้นเพื่อใช้สรุปวันทำงาน",
              },
              {
                step: "3. เข้าสถานะรอหัวทีมยืนยัน",
                detail: "Attendance.status = pending_leader_approval และส่งเข้า queue ของหัวทีม",
              },
              {
                step: "4. หัวทีมกดยืนยันหรือไม่อนุมัติ",
                detail: "บันทึกลง AttendanceApproval พร้อม reason หากไม่อนุมัติ",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.step}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="app-shell-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="section-title">ประวัติลงเวลาและการอนุมัติ</h2>
            <p className="section-description">
              แสดงประวัติของตัวเอง และใช้เป็นมุมมองตัวอย่างสำหรับหัวทีมตรวจสอบได้
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge label="รอยืนยัน" tone="amber" />
            <StatusBadge label="ยืนยันแล้ว" tone="green" />
            <StatusBadge label="ไม่อนุมัติ" tone="red" />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-3 py-3 font-medium">พนักงาน</th>
                <th className="px-3 py-3 font-medium">วันที่</th>
                <th className="px-3 py-3 font-medium">เข้างาน</th>
                <th className="px-3 py-3 font-medium">ออกงาน</th>
                <th className="px-3 py-3 font-medium">รวมเวลา</th>
                <th className="px-3 py-3 font-medium">สถานะ</th>
                <th className="px-3 py-3 font-medium">ผู้อนุมัติ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {attendanceRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-3 py-3 font-medium text-slate-900">
                    {record.employeeName}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{record.workDate}</td>
                  <td className="px-3 py-3 text-slate-600">{record.clockIn}</td>
                  <td className="px-3 py-3 text-slate-600">{record.clockOut}</td>
                  <td className="px-3 py-3 text-slate-600">{record.totalHours}</td>
                  <td className="px-3 py-3">
                    {record.status === "approved" ? (
                      <StatusBadge label="ยืนยันแล้ว" tone="green" />
                    ) : record.status === "rejected" ? (
                      <StatusBadge label="ไม่อนุมัติ" tone="red" />
                    ) : (
                      <StatusBadge label="รอหัวทีมยืนยัน" tone="amber" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-slate-600">{record.approver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="app-shell-card p-5">
          <CircleCheckBig className="h-5 w-5 text-emerald-700" />
          <p className="mt-3 text-base font-semibold text-slate-900">
            Approved Lock
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            ถ้าหัวทีมอนุมัติแล้ว ควรล็อกเวลาเข้าออก และเปิดให้แก้ได้เฉพาะ admin ขึ้นไป
          </p>
        </div>
        <div className="app-shell-card p-5">
          <CircleOff className="h-5 w-5 text-red-700" />
          <p className="mt-3 text-base font-semibold text-slate-900">
            Rejection Reason
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            ถ้าไม่อนุมัติ ต้องบันทึกเหตุผล เช่น เวลาขาด, ลงผิดวัน หรือข้อมูลงานไม่ตรง
          </p>
        </div>
        <div className="app-shell-card p-5">
          <ScanLine className="h-5 w-5 text-blue-700" />
          <p className="mt-3 text-base font-semibold text-slate-900">
            Mobile-first
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            หน้าใช้งานจริงควรเปิดจากโทรศัพท์ได้สะดวก ใช้ปุ่มเต็มความกว้างและตัวอักษรชัด
          </p>
        </div>
      </section>
    </div>
  );
}
