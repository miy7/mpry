import "server-only";

import type { Prisma } from "@prisma/client";
import type { AppViewer, BadgeTone } from "@/lib/types";
import type {
  EmployeeFormValues,
  EmployeeListItem,
  EmployeesPageData,
} from "@/lib/view-models";
import { isAuthEnabled } from "@/lib/auth/session";
import { getBangkokDateKey, maskBankAccount } from "@/lib/format";
import { demoUsers } from "@/lib/mock-data";
import { getPrisma } from "@/lib/prisma";

type EmployeeProfileWithRelations = Prisma.EmployeeProfileGetPayload<{
  include: {
    user: true;
    team: true;
    leader: true;
  };
}>;

type EmployeeFilters = {
  q?: string;
  teamId?: string;
  status?: "all" | "active" | "inactive" | "suspended";
  employeeId?: string;
};

function getEmployeeStatusMeta(status: string): {
  label: string;
  tone: BadgeTone;
} {
  switch (status) {
    case "active":
      return {
        label: "ใช้งานอยู่",
        tone: "green",
      };
    case "suspended":
      return {
        label: "ระงับชั่วคราว",
        tone: "red",
      };
    case "inactive":
    default:
      return {
        label: "ปิดการใช้งาน",
        tone: "slate",
      };
  }
}

function mapEmployeeListItem(
  employee: EmployeeProfileWithRelations,
): EmployeeListItem {
  const statusMeta = getEmployeeStatusMeta(employee.user.status);

  return {
    id: employee.id,
    userId: employee.userId,
    employeeCode: employee.employeeCode,
    fullName:
      employee.user.name ??
      `${employee.firstNameTh} ${employee.lastNameTh}`,
    nickname: employee.nickname ?? undefined,
    phone: employee.phone ?? employee.user.phone ?? undefined,
    bankName: employee.bankName ?? undefined,
    bankAccountMasked: maskBankAccount(employee.bankAccountNo),
    positionTitle: employee.positionTitle,
    teamName: employee.team?.name ?? "ยังไม่ระบุทีม",
    teamId: employee.teamId ?? undefined,
    leaderName: employee.leader?.name ?? undefined,
    leaderId: employee.leaderId ?? undefined,
    role: employee.user.role,
    status: employee.user.status,
    statusLabel: statusMeta.label,
    statusTone: statusMeta.tone,
    isActive: employee.isActive,
    startedAtLabel: employee.startedAt
      ? getBangkokDateKey(employee.startedAt)
      : undefined,
  };
}

function mapEmployeeFormValues(
  employee: EmployeeProfileWithRelations,
): EmployeeFormValues {
  return {
    id: employee.id,
    userId: employee.userId,
    employeeCode: employee.employeeCode,
    username: employee.user.username,
    email: employee.user.email ?? "",
    firstNameTh: employee.firstNameTh,
    lastNameTh: employee.lastNameTh,
    nickname: employee.nickname ?? "",
    phone: employee.phone ?? employee.user.phone ?? "",
    bankAccountNo: employee.bankAccountNo ?? "",
    bankName: employee.bankName ?? "",
    positionTitle: employee.positionTitle,
    teamId: employee.teamId ?? "",
    leaderId: employee.leaderId ?? "",
    status: employee.user.status,
    startedAt: employee.startedAt ? getBangkokDateKey(employee.startedAt) : "",
    note: employee.note ?? "",
    roleLabel: employee.user.role,
  };
}

function buildDemoEmployeesPageData(
  viewer: AppViewer,
  filters: EmployeesPageData["filters"],
): EmployeesPageData {
  const employeeRows: EmployeeListItem[] = demoUsers.map((user) => {
    const status = getEmployeeStatusMeta(
      user.status === "active" ? "active" : "inactive",
    );

    return {
      id: user.id,
      userId: user.id,
      employeeCode: user.id.toUpperCase(),
      fullName: user.fullName,
      nickname: user.nickname,
      phone: user.phone,
      bankName: user.bankName,
      bankAccountMasked: user.bankAccountMasked,
      positionTitle: user.position,
      teamName: user.team,
      teamId: undefined,
      leaderName: user.leaderName,
      leaderId: undefined,
      role: user.role,
      status: user.status,
      statusLabel: status.label,
      statusTone: status.tone,
      isActive: user.status === "active",
      startedAtLabel: undefined,
    };
  });

  void viewer;

  return {
    mode: "demo",
    filters,
    counts: {
      total: employeeRows.length,
      active: employeeRows.filter((employee) => employee.status === "active")
        .length,
      inactive: employeeRows.filter((employee) => employee.status === "inactive")
        .length,
      suspended: 0,
    },
    employees: employeeRows,
    teams: [],
    leaders: [],
    selectedEmployee: null,
  };
}

function buildEmployeeWhere(
  filters: EmployeesPageData["filters"],
): Prisma.EmployeeProfileWhereInput {
  const q = filters.q.trim();

  return {
    ...(filters.teamId
      ? {
          teamId: filters.teamId,
        }
      : {}),
    ...(filters.status !== "all"
      ? {
          user: {
            is: {
              status: filters.status,
            },
          },
        }
      : {}),
    ...(q
      ? {
          OR: [
            {
              employeeCode: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              firstNameTh: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              lastNameTh: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              nickname: {
                contains: q,
                mode: "insensitive",
              },
            },
            {
              user: {
                is: {
                  username: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              user: {
                is: {
                  email: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              team: {
                is: {
                  name: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        }
      : {}),
  };
}

export async function getEmployeesPageData(
  viewer: AppViewer,
  filters: EmployeeFilters,
): Promise<EmployeesPageData> {
  const normalizedFilters: EmployeesPageData["filters"] = {
    q: filters.q?.trim() ?? "",
    teamId: filters.teamId ?? "",
    status: filters.status ?? "all",
  };

  if (!isAuthEnabled()) {
    return buildDemoEmployeesPageData(viewer, normalizedFilters);
  }

  const prisma = getPrisma();
  const where = buildEmployeeWhere(normalizedFilters);

  const [employees, teams, leaders, selectedEmployee] = await Promise.all([
    prisma.employeeProfile.findMany({
      where,
      include: {
        user: true,
        team: true,
        leader: true,
      },
      orderBy: [
        {
          isActive: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
      take: 50,
    }),
    prisma.team.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.user.findMany({
      where: {
        status: "active",
        role: {
          in: ["leader", "admin", "manager", "dev"],
        },
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        username: true,
      },
    }),
    filters.employeeId
      ? prisma.employeeProfile.findUnique({
          where: {
            id: filters.employeeId,
          },
          include: {
            user: true,
            team: true,
            leader: true,
          },
        })
      : Promise.resolve(null),
  ]);

  const mappedEmployees = employees.map(mapEmployeeListItem);

  return {
    mode: "live",
    filters: normalizedFilters,
    counts: {
      total: mappedEmployees.length,
      active: mappedEmployees.filter((employee) => employee.status === "active")
        .length,
      inactive: mappedEmployees.filter(
        (employee) => employee.status === "inactive",
      ).length,
      suspended: mappedEmployees.filter(
        (employee) => employee.status === "suspended",
      ).length,
    },
    employees: mappedEmployees,
    teams: teams.map((team) => ({
      id: team.id,
      label: team.name,
    })),
    leaders: leaders.map((leader) => ({
      id: leader.id,
      label: leader.name ?? leader.username,
    })),
    selectedEmployee: selectedEmployee
      ? mapEmployeeFormValues(selectedEmployee)
      : null,
  };
}
