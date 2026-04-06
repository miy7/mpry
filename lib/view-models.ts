import type { BadgeTone, UserRole } from "@/lib/types";

export type FieldErrors = Partial<Record<string, string[]>>;

export type ServerActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  issuedAt?: number;
};

export type AttendanceCurrentState = {
  dateLabel: string;
  clockInLabel: string;
  clockOutLabel: string;
  totalDurationLabel: string;
  statusLabel: string;
  statusTone: BadgeTone;
  note?: string;
  approverName?: string;
  isLocked: boolean;
  canClockIn: boolean;
  canClockOut: boolean;
};

export type AttendanceHistoryItem = {
  id: string;
  employeeName: string;
  teamName: string;
  workDateLabel: string;
  clockInLabel: string;
  clockOutLabel: string;
  totalDurationLabel: string;
  statusLabel: string;
  statusTone: BadgeTone;
  approverName: string;
  note?: string;
  isLocked: boolean;
};

export type AttendanceApprovalItem = {
  id: string;
  employeeName: string;
  nickname?: string;
  teamName: string;
  workDateLabel: string;
  clockInLabel: string;
  clockOutLabel: string;
  totalDurationLabel: string;
  note?: string;
  approverName?: string;
};

export type AttendancePageData = {
  mode: "live" | "demo";
  viewerRole: UserRole;
  todayState: AttendanceCurrentState | null;
  records: AttendanceHistoryItem[];
  pendingApprovals: AttendanceApprovalItem[];
  summary: {
    totalRecords: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
};

export type EmployeeListItem = {
  id: string;
  userId: string;
  employeeCode: string;
  fullName: string;
  nickname?: string;
  phone?: string;
  bankName?: string;
  bankAccountMasked?: string;
  positionTitle: string;
  teamName: string;
  teamId?: string;
  leaderName?: string;
  leaderId?: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  statusLabel: string;
  statusTone: BadgeTone;
  isActive: boolean;
  startedAtLabel?: string;
};

export type EmployeeFormOption = {
  id: string;
  label: string;
};

export type EmployeeFormValues = {
  id?: string;
  userId?: string;
  employeeCode: string;
  username: string;
  email: string;
  firstNameTh: string;
  lastNameTh: string;
  nickname: string;
  phone: string;
  bankAccountNo: string;
  bankName: string;
  positionTitle: string;
  teamId: string;
  leaderId: string;
  status: "active" | "inactive" | "suspended";
  startedAt: string;
  note: string;
  roleLabel?: string;
};

export type EmployeesPageData = {
  mode: "live" | "demo";
  filters: {
    q: string;
    teamId: string;
    status: "all" | "active" | "inactive" | "suspended";
  };
  counts: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
  };
  employees: EmployeeListItem[];
  teams: EmployeeFormOption[];
  leaders: EmployeeFormOption[];
  selectedEmployee: EmployeeFormValues | null;
};
