"use server";

import "server-only";

import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAppViewer, isAuthEnabled } from "@/lib/auth/session";
import { buildActionError, buildActionSuccess } from "@/lib/form-state";
import { getPrisma } from "@/lib/prisma";
import { canPerform } from "@/lib/rbac";
import type { ServerActionState } from "@/lib/view-models";

const defaultUserPassword = "Pass@1234";

const employeeSchema = z.object({
  employeeId: z.string().optional(),
  employeeCode: z
    .string()
    .trim()
    .min(2, "กรุณากรอกรหัสพนักงาน"),
  username: z
    .string()
    .trim()
    .min(3, "กรุณากรอกชื่อผู้ใช้")
    .regex(/^[a-zA-Z0-9._-]+$/, "ชื่อผู้ใช้ใช้ได้เฉพาะตัวอักษรอังกฤษ ตัวเลข . _ -"),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || z.email().safeParse(value).success,
      "อีเมลไม่ถูกต้อง",
    ),
  firstNameTh: z
    .string()
    .trim()
    .min(1, "กรุณากรอกชื่อจริง"),
  lastNameTh: z
    .string()
    .trim()
    .min(1, "กรุณากรอกนามสกุล"),
  nickname: z
    .string()
    .trim()
    .optional(),
  phone: z
    .string()
    .trim()
    .optional(),
  bankAccountNo: z
    .string()
    .trim()
    .optional(),
  bankName: z
    .string()
    .trim()
    .optional(),
  positionTitle: z
    .string()
    .trim()
    .min(1, "กรุณากรอกตำแหน่ง"),
  teamId: z
    .string()
    .trim()
    .optional(),
  leaderId: z
    .string()
    .trim()
    .optional(),
  status: z.enum(["active", "inactive", "suspended"]),
  startedAt: z
    .string()
    .trim()
    .optional(),
  note: z
    .string()
    .trim()
    .max(1000, "หมายเหตุยาวเกินไป")
    .optional(),
});

const employeeStatusSchema = z.object({
  employeeId: z.string().min(1, "ไม่พบรายการพนักงาน"),
  nextStatus: z.enum(["active", "inactive"]),
});

function parseDateInput(value?: string) {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000+07:00`);
}

function revalidateEmployeeViews() {
  revalidatePath("/employees");
  revalidatePath("/users");
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export async function saveEmployeeAction(
  _prevState: ServerActionState,
  formData: FormData,
): Promise<ServerActionState> {
  if (!isAuthEnabled()) {
    return buildActionError("โหมดเดโมยังไม่รองรับการบันทึกข้อมูลจริง");
  }

  const viewer = await getAppViewer();

  if (!canPerform(viewer.role, "manageEmployees")) {
    return buildActionError("คุณไม่มีสิทธิ์จัดการข้อมูลพนักงาน");
  }

  const parsed = employeeSchema.safeParse({
    employeeId: getStringValue(formData, "employeeId") || undefined,
    employeeCode: getStringValue(formData, "employeeCode"),
    username: getStringValue(formData, "username"),
    email: getStringValue(formData, "email") || undefined,
    firstNameTh: getStringValue(formData, "firstNameTh"),
    lastNameTh: getStringValue(formData, "lastNameTh"),
    nickname: getStringValue(formData, "nickname") || undefined,
    phone: getStringValue(formData, "phone") || undefined,
    bankAccountNo: getStringValue(formData, "bankAccountNo") || undefined,
    bankName: getStringValue(formData, "bankName") || undefined,
    positionTitle: getStringValue(formData, "positionTitle"),
    teamId: getStringValue(formData, "teamId") || undefined,
    leaderId: getStringValue(formData, "leaderId") || undefined,
    status: formData.get("status"),
    startedAt: getStringValue(formData, "startedAt") || undefined,
    note: getStringValue(formData, "note") || undefined,
  });

  if (!parsed.success) {
    return buildActionError(
      "กรุณาตรวจสอบข้อมูลพนักงานอีกครั้ง",
      parsed.error.flatten().fieldErrors,
    );
  }

  const data = parsed.data;
  const prisma = getPrisma();
  const fullName = `${data.firstNameTh} ${data.lastNameTh}`.trim();

  try {
    if (data.employeeId) {
      const existingEmployee = await prisma.employeeProfile.findUnique({
        where: {
          id: data.employeeId,
        },
        include: {
          user: true,
        },
      });

      if (!existingEmployee) {
        return buildActionError("ไม่พบข้อมูลพนักงานที่ต้องการแก้ไข");
      }

      if (data.leaderId && data.leaderId === existingEmployee.userId) {
        return buildActionError("ไม่สามารถกำหนดหัวหน้าเป็นบัญชีของตนเองได้");
      }

      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: existingEmployee.userId,
          },
          data: {
            name: fullName,
            username: data.username,
            email: data.email || null,
            phone: data.phone || null,
            status: data.status,
          },
        }),
        prisma.employeeProfile.update({
          where: {
            id: existingEmployee.id,
          },
          data: {
            employeeCode: data.employeeCode,
            firstNameTh: data.firstNameTh,
            lastNameTh: data.lastNameTh,
            nickname: data.nickname || null,
            phone: data.phone || null,
            bankAccountNo: data.bankAccountNo || null,
            bankName: data.bankName || null,
            positionTitle: data.positionTitle,
            teamId: data.teamId || null,
            leaderId: data.leaderId || null,
            isActive: data.status === "active",
            startedAt: parseDateInput(data.startedAt),
            note: data.note || null,
          },
        }),
      ]);

      revalidateEmployeeViews();
      return buildActionSuccess("อัปเดตข้อมูลพนักงานเรียบร้อย");
    }

    const passwordHash = await hash(defaultUserPassword, 10);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: fullName,
          username: data.username,
          email: data.email || null,
          passwordHash,
          role: "employee",
          status: data.status,
          phone: data.phone || null,
        },
      });

      if (data.leaderId && data.leaderId === user.id) {
        throw new Error("SELF_LEADER");
      }

      await tx.employeeProfile.create({
        data: {
          userId: user.id,
          employeeCode: data.employeeCode,
          firstNameTh: data.firstNameTh,
          lastNameTh: data.lastNameTh,
          nickname: data.nickname || null,
          phone: data.phone || null,
          bankAccountNo: data.bankAccountNo || null,
          bankName: data.bankName || null,
          positionTitle: data.positionTitle,
          teamId: data.teamId || null,
          leaderId: data.leaderId || null,
          isActive: data.status === "active",
          startedAt: parseDateInput(data.startedAt),
          note: data.note || null,
        },
      });
    });

    revalidateEmployeeViews();
    return buildActionSuccess(
      `เพิ่มพนักงานเรียบร้อย รหัสผ่านเริ่มต้นคือ ${defaultUserPassword}`,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "SELF_LEADER") {
      return buildActionError("ไม่สามารถกำหนดหัวหน้าเป็นบัญชีของตนเองได้");
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return buildActionError(
        "ข้อมูลซ้ำในระบบ กรุณาตรวจสอบรหัสพนักงาน ชื่อผู้ใช้ หรืออีเมลอีกครั้ง",
      );
    }

    throw error;
  }
}

export async function toggleEmployeeStatusAction(
  _prevState: ServerActionState,
  formData: FormData,
): Promise<ServerActionState> {
  if (!isAuthEnabled()) {
    return buildActionError("โหมดเดโมยังไม่รองรับการเปลี่ยนสถานะจริง");
  }

  const viewer = await getAppViewer();

  if (!canPerform(viewer.role, "manageEmployees")) {
    return buildActionError("คุณไม่มีสิทธิ์จัดการข้อมูลพนักงาน");
  }

  const parsed = employeeStatusSchema.safeParse({
    employeeId: formData.get("employeeId"),
    nextStatus: formData.get("nextStatus"),
  });

  if (!parsed.success) {
    return buildActionError(
      "ข้อมูลสถานะไม่ถูกต้อง",
      parsed.error.flatten().fieldErrors,
    );
  }

  const prisma = getPrisma();
  const employee = await prisma.employeeProfile.findUnique({
    where: {
      id: parsed.data.employeeId,
    },
    include: {
      user: true,
    },
  });

  if (!employee) {
    return buildActionError("ไม่พบข้อมูลพนักงาน");
  }

  if (employee.userId === viewer.id) {
    return buildActionError("ไม่สามารถปิดการใช้งานบัญชีของตนเองจากหน้านี้ได้");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: employee.userId,
      },
      data: {
        status: parsed.data.nextStatus,
      },
    }),
    prisma.employeeProfile.update({
      where: {
        id: employee.id,
      },
      data: {
        isActive: parsed.data.nextStatus === "active",
      },
    }),
  ]);

  revalidateEmployeeViews();
  return buildActionSuccess(
    parsed.data.nextStatus === "active"
      ? "เปิดการใช้งานพนักงานเรียบร้อย"
      : "ปิดการใช้งานพนักงานเรียบร้อย",
  );
}
