import type { ActionKey, PageKey, UserRole } from "@/lib/types";

export const roleLabels: Record<UserRole, string> = {
  employee: "ลูกทีม",
  leader: "หัวทีม",
  admin: "ผู้ดูแลระบบ",
  manager: "ผู้จัดการ",
  dev: "นักพัฒนา",
};

export const pagePermissions: Record<PageKey, UserRole[]> = {
  dashboard: ["employee", "leader", "admin", "manager", "dev"],
  attendance: ["employee", "leader", "admin", "manager", "dev"],
  calendar: ["leader", "admin", "manager", "dev"],
  workSummary: ["leader", "admin", "manager", "dev"],
  employees: ["admin", "manager", "dev"],
  users: ["manager", "dev"],
};

export const actionPermissions: Record<ActionKey, UserRole[]> = {
  viewOwnPlans: ["employee", "leader", "admin", "manager", "dev"],
  manageWorkPlans: ["admin", "manager", "dev"],
  recordAttendance: ["employee"],
  approveAttendance: ["leader", "admin", "manager", "dev"],
  viewAttendanceCalendar: ["leader", "admin", "manager", "dev"],
  manageWorkSummary: ["leader", "admin", "manager", "dev"],
  manageEmployees: ["admin", "manager", "dev"],
  manageUsers: ["manager", "dev"],
  viewReports: ["admin", "manager", "dev"],
};

export const permissionOverview = [
  {
    feature: "ดูแผนงานและแดชบอร์ด",
    roles: "employee, leader, admin, manager, dev",
    note: "employee เห็นเฉพาะของตัวเอง ส่วน role สูงขึ้นไปเห็นภาพรวมตามขอบเขตทีม/องค์กร",
  },
  {
    feature: "สร้าง/แก้ไข/ลบแผนงาน",
    roles: "admin, manager, dev",
    note: "ใช้กับหน้า Dashboard และปฏิทินแผนงานประจำวัน",
  },
  {
    feature: "ลงเวลาเข้า/ออก",
    roles: "employee",
    note: "ลงเวลาเฉพาะของตัวเอง แล้วเข้าสถานะรอหัวทีมยืนยัน",
  },
  {
    feature: "ยืนยันเวลาเข้า/ออก",
    roles: "leader, admin, manager, dev",
    note: "หัวทีมเป็นผู้อนุมัติหลัก และ role สูงกว่าสามารถช่วยตรวจสอบได้",
  },
  {
    feature: "ดูปฏิทินการมาทำงาน",
    roles: "leader, admin, manager, dev",
    note: "ดูย้อนหลังและ filter ตามทีม, หัวทีม, พนักงาน, ช่วงวันที่",
  },
  {
    feature: "จัดการสรุปวันทำงาน/สถานะจ่ายเงิน",
    roles: "leader, admin, manager, dev",
    note: "เปลี่ยนสถานะจ่ายเงินได้ และดูยอดสะสมแบบ 8 ชั่วโมง = 1 วัน",
  },
  {
    feature: "จัดการข้อมูลพนักงาน",
    roles: "admin, manager, dev",
    note: "แก้ข้อมูลส่วนตัวและข้อมูลสำคัญ เช่น ธนาคาร, เลขบัญชี, ทีม, หัวหน้า",
  },
  {
    feature: "จัดการบัญชีผู้ใช้ทั้งหมด",
    roles: "manager, dev",
    note: "สร้างผู้ใช้, ปิดการใช้งาน, กำหนด role, เตรียม flow reset password",
  },
];

export function canAccessPage(role: UserRole, page: PageKey) {
  return pagePermissions[page].includes(role);
}

export function canPerform(role: UserRole, action: ActionKey) {
  return actionPermissions[action].includes(role);
}
