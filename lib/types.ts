export type UserRole = "employee" | "leader" | "admin" | "manager" | "dev";

export type PageKey =
  | "dashboard"
  | "attendance"
  | "calendar"
  | "workSummary"
  | "employees"
  | "users";

export type ActionKey =
  | "viewOwnPlans"
  | "manageWorkPlans"
  | "recordAttendance"
  | "approveAttendance"
  | "viewAttendanceCalendar"
  | "manageWorkSummary"
  | "manageEmployees"
  | "manageUsers"
  | "viewReports";

export type BadgeTone = "blue" | "green" | "red" | "amber" | "slate";

export type DemoUser = {
  id: string;
  fullName: string;
  nickname: string;
  username?: string;
  email?: string;
  role: UserRole;
  team: string;
  teamId?: string;
  profileId?: string;
  leaderId?: string;
  status: "active" | "inactive";
  phone: string;
  bankName?: string;
  bankAccountMasked?: string;
  leaderName?: string;
  position: string;
};

export type AppViewer = DemoUser & {
  isDemoMode?: boolean;
};

export type WorkPlanCard = {
  id: string;
  title: string;
  team: string;
  leaderName: string;
  memberNames: string[];
  location: string;
  note: string;
  timeRange: string;
};

export type AttendanceRecord = {
  id: string;
  employeeName: string;
  team: string;
  workDate: string;
  clockIn: string;
  clockOut: string;
  totalHours: string;
  status: "pending" | "approved" | "rejected";
  approver: string;
};

export type PayrollRow = {
  id: string;
  employeeName: string;
  team: string;
  totalHours: number;
  totalDays: number;
  equivalentDays: number;
  paymentStatus: "paid" | "unpaid";
  periodLabel: string;
};

export type MonthCell = {
  key: string;
  label?: string;
  primary?: string;
  secondary?: string;
  tone?: BadgeTone;
  isToday?: boolean;
  isEmpty?: boolean;
};
