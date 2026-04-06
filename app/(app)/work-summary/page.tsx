import { Calculator, CreditCard, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth/session";
import { payrollRows } from "@/lib/mock-data";

export default async function WorkSummaryPage() {
  await requirePageAccess("workSummary");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="สำหรับหัวทีมขึ้นไป"
        title="สรุปวันทำงานและสถานะการจ่ายเงิน"
        description="ใช้ดูยอดวันทำงานสะสม ชั่วโมงรวม และจำนวนวันคำนวณจากเกณฑ์ 8 ชั่วโมง = 1 วัน พร้อมเปลี่ยนสถานะการจ่ายเงินเป็น จ่ายแล้ว / ยังไม่จ่าย"
        actions={
          <>
            <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
              เลือกช่วงวันที่
            </button>
            <button className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
              ส่งออกสรุปประจำเดือน
            </button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="ชั่วโมงรวม"
          value="495.5 ชม."
          hint="รวมชั่วโมงของพนักงานตามเงื่อนไข filter ปัจจุบัน"
          icon={<Calculator className="h-5 w-5" />}
        />
        <StatCard
          label="Equivalent Day"
          value="61.94 วัน"
          hint="คำนวณจากสูตร 8 ชั่วโมง = 1 วันทำงาน"
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="จ่ายแล้ว"
          value="1 คน"
          hint="แยกสีเขียวเพื่อให้เห็นรายการที่ปิดงวดแล้วทันที"
          icon={<CreditCard className="h-5 w-5" />}
        />
        <StatCard
          label="ยังไม่จ่าย"
          value="2 คน"
          hint="เน้นสีแดงและปุ่ม action เพื่อให้ตามงานหน้านี้ได้เร็ว"
          icon={<Wallet className="h-5 w-5" />}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="app-shell-card p-5">
          <h2 className="section-title">หลักการคำนวณ</h2>
          <p className="section-description">
            ให้ระบบคำนวณชั่วโมงรวมและแปลงเป็นเศษวันอย่างชัดเจน
          </p>
          <div className="mt-5 space-y-4">
            {[
              "ทำงานครบ 8 ชั่วโมง = 1 วันทำงาน",
              "ถ้าไม่ครบ 8 ชั่วโมง ให้สะสมชั่วโมงต่อเนื่องได้",
              "แสดงทั้งจำนวนวันที่มาจริง, ชั่วโมงรวม, และ equivalent day",
              "สามารถกรองตามคน, ทีม, และรายเดือนเพื่อใช้จ่ายเงินปลายงวด",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="app-shell-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="section-title">ตารางสรุปรายคน</h2>
              <p className="section-description">
                หน้าที่ใช้บ่อย ควรเปิดมาแล้วอ่านออกทันทีบนมือถือและ desktop
              </p>
            </div>
            <div className="flex gap-2">
              <StatusBadge label="จ่ายแล้ว" tone="green" />
              <StatusBadge label="ยังไม่จ่าย" tone="red" />
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="px-3 py-3 font-medium">พนักงาน</th>
                  <th className="px-3 py-3 font-medium">ทีม</th>
                  <th className="px-3 py-3 font-medium">ชั่วโมงรวม</th>
                  <th className="px-3 py-3 font-medium">วันทำงานจริง</th>
                  <th className="px-3 py-3 font-medium">Equivalent Day</th>
                  <th className="px-3 py-3 font-medium">สถานะจ่ายเงิน</th>
                  <th className="px-3 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payrollRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-3 font-medium text-slate-900">
                      {row.employeeName}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{row.team}</td>
                    <td className="px-3 py-3 text-slate-600">{row.totalHours}</td>
                    <td className="px-3 py-3 text-slate-600">{row.totalDays}</td>
                    <td className="px-3 py-3 text-slate-600">{row.equivalentDays}</td>
                    <td className="px-3 py-3">
                      {row.paymentStatus === "paid" ? (
                        <StatusBadge label="จ่ายแล้ว" tone="green" />
                      ) : (
                        <StatusBadge label="ยังไม่จ่าย" tone="red" />
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <button
                        className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
                          row.paymentStatus === "paid"
                            ? "border border-slate-200 bg-white text-slate-700"
                            : "bg-slate-900 text-white"
                        }`}
                      >
                        {row.paymentStatus === "paid"
                          ? "ย้อนเป็นยังไม่จ่าย"
                          : "เปลี่ยนเป็นจ่ายแล้ว"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
