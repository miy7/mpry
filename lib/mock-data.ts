import type {
  AttendanceRecord,
  DemoUser,
  MonthCell,
  PayrollRow,
  UserRole,
  WorkPlanCard,
} from "@/lib/types";

export const demoReferenceDate = new Date("2026-04-06T09:10:00+07:00");
export const demoCurrentRole: UserRole = "manager";

export const demoUsers: DemoUser[] = [
  {
    id: "u-1",
    fullName: "กิตติชัย พรหมมา",
    nickname: "ตั้ม",
    username: "employee01",
    email: "employee01@company.local",
    role: "employee",
    team: "ทีมติดตั้ง A",
    status: "active",
    phone: "08x-xxx-2101",
    bankName: "กสิกรไทย",
    bankAccountMasked: "xxx-x-32109-x",
    leaderName: "สิรภพ สายชล",
    position: "ช่างติดตั้งรายวัน",
  },
  {
    id: "u-2",
    fullName: "มณีรัตน์ วงศ์สวัสดิ์",
    nickname: "แป้ง",
    username: "employee02",
    email: "employee02@company.local",
    role: "employee",
    team: "ทีมติดตั้ง A",
    status: "active",
    phone: "09x-xxx-8871",
    bankName: "กรุงไทย",
    bankAccountMasked: "xxx-0-55219-x",
    leaderName: "สิรภพ สายชล",
    position: "ธุรการหน้างาน",
  },
  {
    id: "u-3",
    fullName: "สิรภพ สายชล",
    nickname: "บอส",
    username: "leader01",
    email: "leader@company.local",
    role: "leader",
    team: "ทีมติดตั้ง A",
    status: "active",
    phone: "08x-xxx-6654",
    position: "หัวหน้าทีมติดตั้ง",
  },
  {
    id: "u-4",
    fullName: "วิชชุดา สายทอง",
    nickname: "นุ่น",
    username: "admin01",
    email: "admin@company.local",
    role: "admin",
    team: "สำนักงานกลาง",
    status: "active",
    phone: "08x-xxx-4411",
    position: "HR / Admin",
  },
  {
    id: "u-5",
    fullName: "ธนาเทพ ชัยกิจ",
    nickname: "โต้ง",
    username: "manager01",
    email: "manager@company.local",
    role: "manager",
    team: "สำนักงานใหญ่",
    status: "active",
    phone: "09x-xxx-9010",
    position: "ผู้จัดการปฏิบัติการ",
  },
  {
    id: "u-6",
    fullName: "ภาคิน ภู่ผลา",
    nickname: "โปร",
    username: "dev01",
    email: "dev@company.local",
    role: "dev",
    team: "Product & Tech",
    status: "active",
    phone: "08x-xxx-7432",
    position: "Developer",
  },
];

export const seedCredentials = {
  password: "Pass@1234",
  usernames: [
    "employee01",
    "employee02",
    "leader01",
    "admin01",
    "manager01",
    "dev01",
  ],
};

export const todayPlans: WorkPlanCard[] = [
  {
    id: "wp-1",
    title: "ติดตั้งระบบไฟชั้น 2",
    team: "ทีมติดตั้ง A",
    leaderName: "สิรภพ สายชล",
    memberNames: ["กิตติชัย พรหมมา", "มณีรัตน์ วงศ์สวัสดิ์"],
    location: "อาคารสำนักงานใหญ่ พระราม 9",
    note: "เข้าหน้างานก่อน 09:00 และบันทึกภาพก่อน-หลังงาน",
    timeRange: "08:30 - 17:30",
  },
  {
    id: "wp-2",
    title: "ตรวจรับงานปรับปรุงไซต์คลังสินค้า",
    team: "ทีมเซอร์วิส B",
    leaderName: "ณรงค์เดช สุขใจ",
    memberNames: ["ปริญญา จุลพงษ์", "ศุภชัย แดงดี"],
    location: "คลังสินค้าบางนา",
    note: "มีเอกสารส่งมอบหน้างานและ checklist ความปลอดภัย",
    timeRange: "09:00 - 18:00",
  },
  {
    id: "wp-3",
    title: "ประชุมวางแผนงานประจำสัปดาห์",
    team: "สำนักงานใหญ่",
    leaderName: "ธนาเทพ ชัยกิจ",
    memberNames: ["วิชชุดา สายทอง", "ภาคิน ภู่ผลา"],
    location: "ห้องประชุม 3 / ออนไลน์",
    note: "สรุปกำลังคน, ตารางไซต์งาน และสถานะจ่ายเงินสิ้นเดือน",
    timeRange: "13:30 - 15:00",
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "at-1",
    employeeName: "กิตติชัย พรหมมา",
    team: "ทีมติดตั้ง A",
    workDate: "06 เม.ย. 2569",
    clockIn: "08:24",
    clockOut: "17:35",
    totalHours: "9.18 ชม.",
    status: "pending",
    approver: "สิรภพ สายชล",
  },
  {
    id: "at-2",
    employeeName: "มณีรัตน์ วงศ์สวัสดิ์",
    team: "ทีมติดตั้ง A",
    workDate: "05 เม.ย. 2569",
    clockIn: "08:40",
    clockOut: "17:10",
    totalHours: "8.50 ชม.",
    status: "approved",
    approver: "สิรภพ สายชล",
  },
  {
    id: "at-3",
    employeeName: "ปริญญา จุลพงษ์",
    team: "ทีมเซอร์วิส B",
    workDate: "05 เม.ย. 2569",
    clockIn: "09:10",
    clockOut: "15:00",
    totalHours: "5.83 ชม.",
    status: "rejected",
    approver: "ณรงค์เดช สุขใจ",
  },
  {
    id: "at-4",
    employeeName: "ศุภชัย แดงดี",
    team: "ทีมเซอร์วิส B",
    workDate: "04 เม.ย. 2569",
    clockIn: "08:55",
    clockOut: "17:12",
    totalHours: "8.28 ชม.",
    status: "approved",
    approver: "ณรงค์เดช สุขใจ",
  },
];

export const payrollRows: PayrollRow[] = [
  {
    id: "pay-1",
    employeeName: "กิตติชัย พรหมมา",
    team: "ทีมติดตั้ง A",
    totalHours: 176,
    totalDays: 21,
    equivalentDays: 22,
    paymentStatus: "unpaid",
    periodLabel: "เมษายน 2569",
  },
  {
    id: "pay-2",
    employeeName: "มณีรัตน์ วงศ์สวัสดิ์",
    team: "ทีมติดตั้ง A",
    totalHours: 168.5,
    totalDays: 20,
    equivalentDays: 21.06,
    paymentStatus: "paid",
    periodLabel: "เมษายน 2569",
  },
  {
    id: "pay-3",
    employeeName: "ปริญญา จุลพงษ์",
    team: "ทีมเซอร์วิส B",
    totalHours: 151,
    totalDays: 18,
    equivalentDays: 18.88,
    paymentStatus: "unpaid",
    periodLabel: "เมษายน 2569",
  },
];

function buildMonthCells(marks: Record<number, Omit<MonthCell, "key" | "label">>) {
  const year = 2026;
  const month = 3;
  const date = new Date(Date.UTC(year, month, 1));
  const firstDay = date.getUTCDay();
  const mondayIndex = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getUTCDate();

  const cells: MonthCell[] = [];

  for (let blank = 0; blank < mondayIndex; blank += 1) {
    cells.push({ key: `blank-${blank}`, isEmpty: true });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const mark = marks[day];
    cells.push({
      key: `day-${day}`,
      label: String(day),
      isToday: day === 6,
      ...mark,
    });
  }

  return cells;
}

export const workPlanMonthCells = buildMonthCells({
  2: { primary: "2 แผนงาน", secondary: "บางนา", tone: "blue" },
  6: { primary: "3 แผนงาน", secondary: "วันนี้", tone: "green" },
  9: { primary: "ประชุม", secondary: "ทีมใหญ่", tone: "slate" },
  14: { primary: "4 แผนงาน", secondary: "ลาดกระบัง", tone: "blue" },
  19: { primary: "ตรวจรับงาน", secondary: "หัวทีมครบ", tone: "amber" },
  24: { primary: "วันจ่ายเงิน", secondary: "สิ้นงวด", tone: "green" },
});

export const attendanceMonthCells = buildMonthCells({
  1: { primary: "ยืนยัน 12", secondary: "ครบทีม", tone: "green" },
  3: { primary: "รอ 4", secondary: "รอหัวทีม", tone: "amber" },
  6: { primary: "รอ 6", secondary: "กำลังลงเวลา", tone: "blue" },
  8: { primary: "ไม่อนุมัติ 1", secondary: "เวลาไม่ครบ", tone: "red" },
  15: { primary: "ยืนยัน 9", secondary: "ย้อนหลัง", tone: "green" },
  26: { primary: "ปิดงวด", secondary: "พร้อมคำนวณเงิน", tone: "slate" },
});
