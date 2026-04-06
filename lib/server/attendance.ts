import "server-only";

import type { Prisma } from "@prisma/client";
import type { AppViewer, BadgeTone } from "@/lib/types";
import type {
  AttendanceApprovalItem,
  AttendanceCurrentState,
  AttendanceHistoryItem,
  AttendancePageData,
} from "@/lib/view-models";
import { isAuthEnabled } from "@/lib/auth/session";
import { attendanceRecords, demoReferenceDate } from "@/lib/mock-data";
import {
  formatThaiDate,
  formatThaiShortDate,
  formatThaiTime,
  formatWorkedDuration,
  getBangkokDateAtMidnight,
} from "@/lib/format";
import { getPrisma } from "@/lib/prisma";

type AttendanceWithRelations = Prisma.AttendanceGetPayload<{
  include: {
    employeeProfile: {
      include: {
        user: true;
        team: true;
      };
    };
    team: true;
    approval: {
      include: {
        approver: true;
      };
    };
  };
}>;

type AttendanceApprovalTarget = Prisma.AttendanceGetPayload<{
  include: {
    employeeProfile: true;
    team: true;
    approval: true;
  };
}>;

function getAttendanceStatusMeta(status: string): {
  label: string;
  tone: BadgeTone;
} {
  switch (status) {
    case "approved":
      return { label: "ยืนยันแล้ว", tone: "green" };
    case "rejected":
      return { label: "ไม่อนุมัติ", tone: "red" };
    case "pending_leader_approval":
    case "pending":
      return { label: "รอหัวทีมยืนยัน", tone: "amber" };
    case "draft":
    default:
      return { label: "รอบันทึกออกงาน", tone: "blue" };
  }
}

function mapDemoRecord(
  record: (typeof attendanceRecords)[number],
): AttendanceHistoryItem {
  const status = getAttendanceStatusMeta(record.status);

  return {
    id: record.id,
    employeeName: record.employeeName,
    teamName: record.team,
    workDateLabel: record.workDate,
    clockInLabel: record.clockIn,
    clockOutLabel: record.clockOut,
    totalDurationLabel: record.totalHours,
    statusLabel: status.label,
    statusTone: status.tone,
    approverName: record.approver,
    isLocked: record.status === "approved",
  };
}

function mapLiveRecord(record: AttendanceWithRelations): AttendanceHistoryItem {
  const status = getAttendanceStatusMeta(record.status);

  return {
    id: record.id,
    employeeName:
      record.employeeProfile.user.name ??
      `${record.employeeProfile.firstNameTh} ${record.employeeProfile.lastNameTh}`,
    teamName:
      record.team?.name ??
      record.employeeProfile.team?.name ??
      "ยังไม่ระบุทีม",
    workDateLabel: formatThaiShortDate(record.workDate),
    clockInLabel: formatThaiTime(record.clockInAt),
    clockOutLabel: formatThaiTime(record.clockOutAt),
    totalDurationLabel: formatWorkedDuration(record.totalMinutes),
    statusLabel: status.label,
    statusTone: status.tone,
    approverName:
      record.approval?.approver?.name ??
      record.approval?.approver?.username ??
      "-",
    note: record.note ?? undefined,
    isLocked: Boolean(record.lockedAt),
  };
}

function mapCurrentState(
  record: AttendanceWithRelations | null,
): AttendanceCurrentState {
  if (!record) {
    return {
      dateLabel: formatThaiDate(new Date()),
      clockInLabel: "-",
      clockOutLabel: "-",
      totalDurationLabel: "0 ชม.",
      statusLabel: "ยังไม่มีรายการวันนี้",
      statusTone: "slate",
      isLocked: false,
      canClockIn: true,
      canClockOut: false,
    };
  }

  const status = getAttendanceStatusMeta(record.status);

  return {
    dateLabel: formatThaiDate(record.workDate),
    clockInLabel: formatThaiTime(record.clockInAt),
    clockOutLabel: formatThaiTime(record.clockOutAt),
    totalDurationLabel: formatWorkedDuration(record.totalMinutes),
    statusLabel: status.label,
    statusTone: status.tone,
    note: record.note ?? undefined,
    approverName:
      record.approval?.approver?.name ??
      record.approval?.approver?.username ??
      undefined,
    isLocked: Boolean(record.lockedAt),
    canClockIn: !record.clockInAt && !record.lockedAt,
    canClockOut:
      Boolean(record.clockInAt) && !record.clockOutAt && !record.lockedAt,
  };
}

function buildDemoAttendancePageData(viewer: AppViewer): AttendancePageData {
  const records = attendanceRecords.map(mapDemoRecord);
  const statusSummary = records.reduce(
    (result, record) => {
      if (record.statusTone === "amber") {
        result.pendingCount += 1;
      }

      if (record.statusTone === "green") {
        result.approvedCount += 1;
      }

      if (record.statusTone === "red") {
        result.rejectedCount += 1;
      }

      return result;
    },
    {
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
    },
  );

  const pendingApprovals: AttendanceApprovalItem[] =
    viewer.role === "employee"
      ? []
      : records
          .filter((record) => record.statusTone === "amber")
          .slice(0, 3)
          .map((record) => ({
            id: record.id,
            employeeName: record.employeeName,
            teamName: record.teamName,
            workDateLabel: record.workDateLabel,
            clockInLabel: record.clockInLabel,
            clockOutLabel: record.clockOutLabel,
            totalDurationLabel: record.totalDurationLabel,
            approverName: record.approverName,
          }));

  return {
    mode: "demo",
    viewerRole: viewer.role,
    todayState:
      viewer.role === "employee"
        ? {
            dateLabel: formatThaiDate(demoReferenceDate),
            clockInLabel: "08:24",
            clockOutLabel: "17:35",
            totalDurationLabel: "9.18 ชม.",
            statusLabel: "รอหัวทีมยืนยัน",
            statusTone: "amber",
            isLocked: false,
            canClockIn: false,
            canClockOut: false,
            approverName: "หัวทีมตัวอย่าง",
            note: "ตัวอย่างข้อมูลจากโหมดเดโม",
          }
        : null,
    records,
    pendingApprovals,
    summary: {
      totalRecords: records.length,
      ...statusSummary,
    },
  };
}

function buildHistoryWhere(viewer: AppViewer): Prisma.AttendanceWhereInput {
  if (viewer.role === "employee") {
    return {
      employeeProfile: {
        userId: viewer.id,
      },
    };
  }

  if (viewer.role === "leader") {
    return {
      OR: [
        {
          employeeProfile: {
            leaderId: viewer.id,
          },
        },
        {
          team: {
            leaderId: viewer.id,
          },
        },
        {
          approval: {
            approverId: viewer.id,
          },
        },
      ],
    };
  }

  return {};
}

export async function getAttendancePageData(
  viewer: AppViewer,
): Promise<AttendancePageData> {
  if (!isAuthEnabled()) {
    return buildDemoAttendancePageData(viewer);
  }

  const prisma = getPrisma();
  const historyWhere = buildHistoryWhere(viewer);
  const todayWorkDate = getBangkokDateAtMidnight();

  const [todayRecord, records, pendingApprovals] = await Promise.all([
    viewer.role === "employee" && viewer.profileId
      ? prisma.attendance.findUnique({
          where: {
            employeeProfileId_workDate: {
              employeeProfileId: viewer.profileId,
              workDate: todayWorkDate,
            },
          },
          include: {
            employeeProfile: {
              include: {
                user: true,
                team: true,
              },
            },
            team: true,
            approval: {
              include: {
                approver: true,
              },
            },
          },
        })
      : Promise.resolve(null),
    prisma.attendance.findMany({
      where: historyWhere,
      include: {
        employeeProfile: {
          include: {
            user: true,
            team: true,
          },
        },
        team: true,
        approval: {
          include: {
            approver: true,
          },
        },
      },
      orderBy: [
        {
          workDate: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 12,
    }),
    viewer.role === "employee"
      ? Promise.resolve([])
      : prisma.attendance.findMany({
          where: {
            ...historyWhere,
            status: "pending_leader_approval",
          },
          include: {
            employeeProfile: {
              include: {
                user: true,
                team: true,
              },
            },
            team: true,
            approval: {
              include: {
                approver: true,
              },
            },
          },
          orderBy: [
            {
              workDate: "desc",
            },
            {
              createdAt: "desc",
            },
          ],
          take: 6,
        }),
  ]);

  const mappedRecords = records.map(mapLiveRecord);
  const summary = mappedRecords.reduce(
    (result, record) => {
      if (record.statusTone === "amber") {
        result.pendingCount += 1;
      }

      if (record.statusTone === "green") {
        result.approvedCount += 1;
      }

      if (record.statusTone === "red") {
        result.rejectedCount += 1;
      }

      return result;
    },
    {
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
    },
  );

  return {
    mode: "live",
    viewerRole: viewer.role,
    todayState: viewer.role === "employee" ? mapCurrentState(todayRecord) : null,
    records: mappedRecords,
    pendingApprovals: pendingApprovals.map((record) => ({
      id: record.id,
      employeeName:
        record.employeeProfile.user.name ??
        `${record.employeeProfile.firstNameTh} ${record.employeeProfile.lastNameTh}`,
      nickname: record.employeeProfile.nickname ?? undefined,
      teamName:
        record.team?.name ??
        record.employeeProfile.team?.name ??
        "ยังไม่ระบุทีม",
      workDateLabel: formatThaiShortDate(record.workDate),
      clockInLabel: formatThaiTime(record.clockInAt),
      clockOutLabel: formatThaiTime(record.clockOutAt),
      totalDurationLabel: formatWorkedDuration(record.totalMinutes),
      note: record.note ?? undefined,
      approverName:
        record.approval?.approver?.name ??
        record.approval?.approver?.username ??
        undefined,
    })),
    summary: {
      totalRecords: mappedRecords.length,
      ...summary,
    },
  };
}

export function canViewerApproveAttendance(
  viewer: AppViewer,
  attendance: AttendanceApprovalTarget,
) {
  if (viewer.role === "admin" || viewer.role === "manager" || viewer.role === "dev") {
    return true;
  }

  if (viewer.role !== "leader") {
    return false;
  }

  return Boolean(
    attendance.employeeProfile.leaderId === viewer.id ||
      attendance.team?.leaderId === viewer.id ||
      attendance.approval?.approverId === viewer.id,
  );
}
