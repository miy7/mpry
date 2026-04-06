import Link from "next/link";
import {
  BriefcaseBusiness,
  CircleDollarSign,
  ClipboardCheck,
  Users,
} from "lucide-react";
import { MonthGrid } from "@/components/ui/month-grid";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth/session";
import { formatThaiDate, formatThaiMonth } from "@/lib/format";
import {
  demoReferenceDate,
  todayPlans,
  workPlanMonthCells,
} from "@/lib/mock-data";
import { permissionOverview } from "@/lib/rbac";

export default async function DashboardPage() {
  await requirePageAccess("dashboard");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={formatThaiDate(demoReferenceDate)}
        title="แดชบอร์ดแผนงานรายวัน"
        description="สรุปแผนงานประจำวันแบบปฏิทินรายเดือน ดูรายละเอียดรายวันได้ง่าย เหมาะกับทั้งคนหน้างานและหัวหน้างาน โดยสิทธิ์สร้าง/แก้ไข/ลบแผนงานอยู่ที่ admin ขึ้นไป"
        actions={
          <>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              ดูรายละเอียดรายวัน
            </button>
            <button className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
              สร้างแผนงานใหม่
            </button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="แผนงานวันนี้"
          value="3 งาน"
          hint="รวมแผนงานของลูกทีมและหัวทีมที่ต้องดำเนินการในวันนี้"
          icon={<BriefcaseBusiness className="h-5 w-5" />}
        />
        <StatCard
          label="รอหัวทีมยืนยัน"
          value="6 รายการ"
          hint="รายการลงเวลาเข้า-ออกที่รอหัวทีมอนุมัติ"
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
        <StatCard
          label="ทีมที่กำลังทำงาน"
          value="3 ทีม"
          hint="ทีมที่มีแผนงาน active ในรอบวันปัจจุบัน"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="ยังไม่จ่ายเงิน"
          value="12 คน"
          hint="ใช้ติดตามสถานะจ่ายเงินในรอบเดือนอย่างรวดเร็ว"
          icon={<CircleDollarSign className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <MonthGrid
          monthLabel={formatThaiMonth(demoReferenceDate)}
          cells={workPlanMonthCells}
          legend={[
            { label: "มีแผนงาน", tone: "blue" },
            { label: "วันสำคัญ", tone: "green" },
            { label: "ตรวจรับ / เตือน", tone: "amber" },
          ]}
        />

        <div className="app-shell-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="section-title">สรุปงานของวันนี้</h2>
              <p className="section-description">
                การ์ดงานประจำวันสำหรับดูชื่อพนักงาน หัวทีม สถานที่ และหมายเหตุ
              </p>
            </div>
            <StatusBadge label="แก้ไขได้โดย admin+" tone="blue" />
          </div>

          <div className="mt-5 space-y-4">
            {todayPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{plan.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {plan.team} • {plan.timeRange}
                    </p>
                  </div>
                  <StatusBadge label="หน้างานวันนี้" tone="green" />
                </div>
                <dl className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
                  <div className="flex flex-col gap-1">
                    <dt className="font-medium text-slate-800">หัวทีม</dt>
                    <dd>{plan.leaderName}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="font-medium text-slate-800">ลูกทีม</dt>
                    <dd>{plan.memberNames.join(", ")}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="font-medium text-slate-800">สถานที่</dt>
                    <dd>{plan.location}</dd>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dt className="font-medium text-slate-800">หมายเหตุ</dt>
                    <dd>{plan.note}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="app-shell-card p-5">
          <h2 className="section-title">Permission Overview</h2>
          <p className="section-description">
            ตารางสรุปสิทธิ์หลักที่ใช้กำหนด route access และการกระทำในระบบ
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-3 font-medium">ฟีเจอร์</th>
                  <th className="px-3 py-3 font-medium">Role</th>
                  <th className="px-3 py-3 font-medium">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {permissionOverview.slice(0, 4).map((row) => (
                  <tr key={row.feature} className="align-top">
                    <td className="px-3 py-3 font-medium text-slate-900">{row.feature}</td>
                    <td className="px-3 py-3 text-slate-600">{row.roles}</td>
                    <td className="px-3 py-3 text-slate-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="app-shell-card p-5">
          <h2 className="section-title">ลิงก์ไปยังหน้าหลัก</h2>
          <p className="section-description">
            โครงระบบแยกหน้าใช้งานชัดเจน เพื่อให้ทีมพัฒนาแบ่งงานกันทำได้ง่าย
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/attendance",
                title: "ลงเวลาเข้า-ออก",
                description: "ปุ่มใหญ่ กดง่าย พร้อมสถานะรอยืนยัน / ยืนยันแล้ว / ไม่อนุมัติ",
              },
              {
                href: "/calendar",
                title: "Calendar การมาทำงาน",
                description: "ดูย้อนหลัง ค้นหา และกรองตามทีม หัวทีม หรือช่วงวันที่",
              },
              {
                href: "/work-summary",
                title: "สรุปวันทำงานและสถานะจ่ายเงิน",
                description: "คำนวณ 8 ชั่วโมง = 1 วัน และเปลี่ยนสถานะจ่ายเงินได้",
              },
              {
                href: "/employees",
                title: "ข้อมูลพนักงาน",
                description: "แยกข้อมูลพื้นฐาน, ธนาคาร, ทีม, หัวหน้า และสถานะการใช้งาน",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
