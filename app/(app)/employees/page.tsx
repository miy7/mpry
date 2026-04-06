import { Building2, Landmark, Phone, UserSquare2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { requirePageAccess } from "@/lib/auth/session";
import { demoUsers } from "@/lib/mock-data";

const employeeCards = demoUsers.filter((user) =>
  ["employee", "leader", "admin"].includes(user.role),
);

export default async function EmployeesPage() {
  await requirePageAccess("employees");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="admin ขึ้นไป"
        title="ข้อมูลพนักงาน"
        description="เก็บข้อมูลพื้นฐานของพนักงาน เช่น ชื่อ, ชื่อเล่น, เบอร์โทร, เลขบัญชี, ธนาคาร, ตำแหน่ง, ทีม, หัวหน้าที่ดูแล และสถานะการใช้งาน โดยคำนึงถึงความปลอดภัยของข้อมูล"
        actions={
          <button className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
            เพิ่มข้อมูลพนักงาน
          </button>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="app-shell-card p-5">
          <h2 className="section-title">รายการพนักงาน</h2>
          <p className="section-description">
            แสดงได้ทั้งแบบการ์ดและตาราง พร้อมข้อมูลที่ต้องใช้บ่อยจริงในบริษัท
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {employeeCards.map((user) => (
              <div
                key={user.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{user.fullName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      ชื่อเล่น {user.nickname} • {user.position}
                    </p>
                  </div>
                  <StatusBadge
                    label={user.status === "active" ? "ใช้งานอยู่" : "ปิดการใช้งาน"}
                    tone={user.status === "active" ? "green" : "slate"}
                  />
                </div>

                <dl className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span>{user.team}</span>
                  </div>
                  {user.bankName ? (
                    <div className="flex items-center gap-2">
                      <Landmark className="h-4 w-4 text-slate-400" />
                      <span>
                        {user.bankName} • {user.bankAccountMasked}
                      </span>
                    </div>
                  ) : null}
                  {user.leaderName ? (
                    <div className="flex items-center gap-2">
                      <UserSquare2 className="h-4 w-4 text-slate-400" />
                      <span>หัวหน้า: {user.leaderName}</span>
                    </div>
                  ) : null}
                </dl>
              </div>
            ))}
          </div>
        </div>

        <div className="app-shell-card p-5">
          <h2 className="section-title">ฟอร์มข้อมูลพนักงาน</h2>
          <p className="section-description">
            ใช้ฟอร์มเรียบง่าย ตัวอักษรชัด และแบ่งกลุ่มข้อมูลชัดเจน
          </p>

          <div className="mt-5 grid gap-4">
            <input className="field-shell" placeholder="ชื่อจริง" />
            <input className="field-shell" placeholder="ชื่อเล่น" />
            <input className="field-shell" placeholder="เบอร์โทร" />
            <input className="field-shell" placeholder="เลขบัญชี" />
            <input className="field-shell" placeholder="ธนาคาร" />
            <input className="field-shell" placeholder="ตำแหน่ง" />
            <input className="field-shell" placeholder="ทีม" />
            <input className="field-shell" placeholder="หัวหน้าที่ดูแล" />
            <div className="flex gap-3">
              <button className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                บันทึกข้อมูล
              </button>
              <button className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
                ยกเลิก
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">ข้อควรระวังด้านข้อมูลส่วนบุคคล</p>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              ข้อมูลบัญชีธนาคารและเบอร์โทรควรถูกจำกัดการมองเห็นตาม role และส่งไปยัง client
              เฉพาะฟิลด์ที่จำเป็นจริง
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
