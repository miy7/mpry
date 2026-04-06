"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAppViewer, isAuthEnabled } from "@/lib/auth/session";
import {
  formatThaiTime,
  getBangkokDateAtMidnight,
} from "@/lib/format";
import { buildActionError, buildActionSuccess } from "@/lib/form-state";
import { getPrisma } from "@/lib/prisma";
import { canPerform } from "@/lib/rbac";
import { canViewerApproveAttendance } from "@/lib/server/attendance";
import type { ServerActionState } from "@/lib/view-models";

const noteSchema = z.object({
  note: z
    .string()
    .trim()
    .max(500, "หมายเหตุยาวเกินไป")
    .optional(),
});

const approvalSchema = z
  .object({
    attendanceId: z.string().min(1, "ไม่พบรหัสรายการลงเวลา"),
    decision: z.enum(["approved", "rejected"]),
    note: z
      .string()
      .trim()
      .max(500, "เหตุผลยาวเกินไป")
      .optional(),
  })
  .superRefine((value, ctx) => {
    if (value.decision === "rejected" && !value.note) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "กรุณาระบุเหตุผลเมื่อไม่อนุมัติ",
        path: ["note"],
      });
    }
  });

function revalidateAttendanceViews() {
  revalidatePath("/attendance");
  revalidatePath("/calendar");
  revalidatePath("/work-summary");
  revalidatePath("/dashboard");
}

function getNoteValue(formData: FormData) {
  const raw = formData.get("note");

  return typeof raw === "string" ? raw : "";
}

export async function clockInAction(
  _prevState: ServerActionState,
  formData: FormData,
): Promise<ServerActionState> {
  if (!isAuthEnabled()) {
    return buildActionError("โหมดเดโมยังไม่รองรับการบันทึกเวลาจริง");
  }

  const viewer = await getAppViewer();

  if (!canPerform(viewer.role, "recordAttendance")) {
    return buildActionError("สิทธิ์ลงเวลาเข้าใช้งานได้เฉพาะลูกทีม");
  }

  const parsed = noteSchema.safeParse({
    note: getNoteValue(formData),
  });

  if (!parsed.success) {
    return buildActionError(
      "ข้อมูลที่กรอกยังไม่ถูกต้อง",
      parsed.error.flatten().fieldErrors,
    );
  }

  const prisma = getPrisma();
  const profile = await prisma.employeeProfile.findUnique({
    where: {
      userId: viewer.id,
    },
    include: {
      team: true,
    },
  });

  if (!profile) {
    return buildActionError("ไม่พบข้อมูลพนักงานสำหรับบัญชีนี้");
  }

  const now = new Date();
  const workDate = getBangkokDateAtMidnight(now);
  const existing = await prisma.attendance.findUnique({
    where: {
      employeeProfileId_workDate: {
        employeeProfileId: profile.id,
        workDate,
      },
    },
  });

  if (existing?.lockedAt || existing?.status === "approved") {
    return buildActionError("รายการวันนี้ถูกล็อกแล้วและไม่สามารถแก้ไขได้");
  }

  if (existing?.clockInAt) {
    return buildActionError("วันนี้คุณบันทึกเวลาเข้างานไปแล้ว");
  }

  const note = parsed.data.note?.trim() || undefined;

  if (existing) {
    await prisma.attendance.update({
      where: {
        id: existing.id,
      },
      data: {
        submittedById: viewer.id,
        teamId: profile.teamId,
        clockInAt: now,
        note,
        status: "draft",
        lockedAt: null,
      },
    });
  } else {
    await prisma.attendance.create({
      data: {
        employeeProfileId: profile.id,
        submittedById: viewer.id,
        teamId: profile.teamId,
        workDate,
        clockInAt: now,
        note,
        status: "draft",
      },
    });
  }

  revalidateAttendanceViews();

  return buildActionSuccess(
    `บันทึกเวลาเข้างานเรียบร้อย ${formatThaiTime(now)}`,
  );
}

export async function clockOutAction(
  _prevState: ServerActionState,
  formData: FormData,
): Promise<ServerActionState> {
  if (!isAuthEnabled()) {
    return buildActionError("โหมดเดโมยังไม่รองรับการบันทึกเวลาจริง");
  }

  const viewer = await getAppViewer();

  if (!canPerform(viewer.role, "recordAttendance")) {
    return buildActionError("สิทธิ์ลงเวลาออกใช้งานได้เฉพาะลูกทีม");
  }

  const parsed = noteSchema.safeParse({
    note: getNoteValue(formData),
  });

  if (!parsed.success) {
    return buildActionError(
      "ข้อมูลที่กรอกยังไม่ถูกต้อง",
      parsed.error.flatten().fieldErrors,
    );
  }

  const prisma = getPrisma();
  const profile = await prisma.employeeProfile.findUnique({
    where: {
      userId: viewer.id,
    },
    include: {
      team: true,
    },
  });

  if (!profile) {
    return buildActionError("ไม่พบข้อมูลพนักงานสำหรับบัญชีนี้");
  }

  const approverId = profile.leaderId ?? profile.team?.leaderId ?? null;

  if (!approverId) {
    return buildActionError("ยังไม่ได้กำหนดหัวหน้าที่ดูแล จึงยังส่งยืนยันไม่ได้");
  }

  const now = new Date();
  const workDate = getBangkokDateAtMidnight(now);
  const existing = await prisma.attendance.findUnique({
    where: {
      employeeProfileId_workDate: {
        employeeProfileId: profile.id,
        workDate,
      },
    },
    include: {
      approval: true,
    },
  });

  if (!existing || !existing.clockInAt) {
    return buildActionError("กรุณาบันทึกเวลาเข้างานก่อนลงเวลาออกงาน");
  }

  if (existing.lockedAt || existing.status === "approved") {
    return buildActionError("รายการวันนี้ถูกล็อกแล้วและไม่สามารถแก้ไขได้");
  }

  if (existing.clockOutAt) {
    return buildActionError("วันนี้คุณบันทึกเวลาออกงานไปแล้ว");
  }

  const totalMinutes = Math.max(
    0,
    Math.round((now.getTime() - existing.clockInAt.getTime()) / 60000),
  );
  const note = parsed.data.note?.trim() || existing.note || undefined;

  await prisma.attendance.update({
    where: {
      id: existing.id,
    },
    data: {
      clockOutAt: now,
      totalMinutes,
      note,
      status: "pending_leader_approval",
      lockedAt: null,
      approval: {
        upsert: {
          create: {
            approverId,
            decision: "pending",
          },
          update: {
            approverId,
            decision: "pending",
            decidedAt: null,
            reason: null,
            note: null,
          },
        },
      },
    },
  });

  revalidateAttendanceViews();

  return buildActionSuccess(
    `บันทึกเวลาออกงานเรียบร้อย ${formatThaiTime(now)} และส่งรอยืนยันแล้ว`,
  );
}

export async function submitAttendanceApprovalAction(
  _prevState: ServerActionState,
  formData: FormData,
): Promise<ServerActionState> {
  if (!isAuthEnabled()) {
    return buildActionError("โหมดเดโมยังไม่รองรับการอนุมัติจริง");
  }

  const viewer = await getAppViewer();

  if (!canPerform(viewer.role, "approveAttendance")) {
    return buildActionError("คุณไม่มีสิทธิ์อนุมัติรายการลงเวลา");
  }

  const parsed = approvalSchema.safeParse({
    attendanceId: formData.get("attendanceId"),
    decision: formData.get("decision"),
    note: getNoteValue(formData),
  });

  if (!parsed.success) {
    return buildActionError(
      "ข้อมูลการอนุมัติยังไม่ถูกต้อง",
      parsed.error.flatten().fieldErrors,
    );
  }

  const prisma = getPrisma();
  const attendance = await prisma.attendance.findUnique({
    where: {
      id: parsed.data.attendanceId,
    },
    include: {
      employeeProfile: true,
      team: true,
      approval: true,
    },
  });

  if (!attendance) {
    return buildActionError("ไม่พบรายการลงเวลาที่ต้องการอนุมัติ");
  }

  if (!canViewerApproveAttendance(viewer, attendance)) {
    return buildActionError("คุณไม่มีสิทธิ์อนุมัติรายการของพนักงานคนนี้");
  }

  if (attendance.status !== "pending_leader_approval") {
    return buildActionError("รายการนี้ไม่ได้อยู่ในสถานะรออนุมัติแล้ว");
  }

  const now = new Date();
  const note = parsed.data.note?.trim() || undefined;

  await prisma.attendance.update({
    where: {
      id: attendance.id,
    },
    data: {
      status:
        parsed.data.decision === "approved" ? "approved" : "rejected",
      lockedAt: parsed.data.decision === "approved" ? now : null,
      approval: {
        upsert: {
          create: {
            approverId: viewer.id,
            decision: parsed.data.decision,
            decidedAt: now,
            note: parsed.data.decision === "approved" ? note : undefined,
            reason: parsed.data.decision === "rejected" ? note : undefined,
          },
          update: {
            approverId: viewer.id,
            decision: parsed.data.decision,
            decidedAt: now,
            note: parsed.data.decision === "approved" ? note : null,
            reason: parsed.data.decision === "rejected" ? note : null,
          },
        },
      },
    },
  });

  revalidateAttendanceViews();

  return buildActionSuccess(
    parsed.data.decision === "approved"
      ? "ยืนยันรายการลงเวลาเรียบร้อย"
      : "บันทึกไม่อนุมัติเรียบร้อย",
  );
}
