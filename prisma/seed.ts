import { hash } from "bcryptjs";
import { Prisma } from "@prisma/client";
import { getPrisma } from "../lib/prisma";

const defaultPassword = "Pass@1234";

async function main() {
  const prisma = getPrisma();
  const passwordHash = await hash(defaultPassword, 10);

  await prisma.attendanceApproval.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.workPlanAssignment.deleteMany();
  await prisma.workPlan.deleteMany();
  await prisma.paymentRecord.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.team.deleteMany();
  await prisma.user.deleteMany();

  const leader = await prisma.user.create({
    data: {
      name: "สิรภพ สายชล",
      username: "leader01",
      email: "leader@company.local",
      passwordHash,
      role: "leader",
      status: "active",
      phone: "08x-xxx-6654",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "วิชชุดา สายทอง",
      username: "admin01",
      email: "admin@company.local",
      passwordHash,
      role: "admin",
      status: "active",
      phone: "08x-xxx-4411",
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "ธนาเทพ ชัยกิจ",
      username: "manager01",
      email: "manager@company.local",
      passwordHash,
      role: "manager",
      status: "active",
      phone: "09x-xxx-9010",
    },
  });

  const dev = await prisma.user.create({
    data: {
      name: "ภาคิน ภู่ผลา",
      username: "dev01",
      email: "dev@company.local",
      passwordHash,
      role: "dev",
      status: "active",
      phone: "08x-xxx-7432",
    },
  });

  const employeeA = await prisma.user.create({
    data: {
      name: "กิตติชัย พรหมมา",
      username: "employee01",
      email: "employee01@company.local",
      passwordHash,
      role: "employee",
      status: "active",
      phone: "08x-xxx-2101",
    },
  });

  const employeeB = await prisma.user.create({
    data: {
      name: "มณีรัตน์ วงศ์สวัสดิ์",
      username: "employee02",
      email: "employee02@company.local",
      passwordHash,
      role: "employee",
      status: "active",
      phone: "09x-xxx-8871",
    },
  });

  const teamA = await prisma.team.create({
    data: {
      code: "TEAM-A",
      name: "ทีมติดตั้ง A",
      description: "ทีมติดตั้งหน้างานหลัก",
      leaderId: leader.id,
    },
  });

  const hqTeam = await prisma.team.create({
    data: {
      code: "HQ",
      name: "สำนักงานใหญ่",
      description: "งานจัดการส่วนกลาง",
      leaderId: manager.id,
    },
  });

  const leaderProfile = await prisma.employeeProfile.create({
    data: {
      userId: leader.id,
      employeeCode: "EMP-0001",
      firstNameTh: "สิรภพ",
      lastNameTh: "สายชล",
      nickname: "บอส",
      phone: "08x-xxx-6654",
      positionTitle: "หัวหน้าทีมติดตั้ง",
      teamId: teamA.id,
      startedAt: new Date("2025-01-01T00:00:00.000+07:00"),
    },
  });

  const adminProfile = await prisma.employeeProfile.create({
    data: {
      userId: admin.id,
      employeeCode: "EMP-0002",
      firstNameTh: "วิชชุดา",
      lastNameTh: "สายทอง",
      nickname: "นุ่น",
      phone: "08x-xxx-4411",
      positionTitle: "HR / Admin",
      teamId: hqTeam.id,
      startedAt: new Date("2025-01-01T00:00:00.000+07:00"),
    },
  });

  const managerProfile = await prisma.employeeProfile.create({
    data: {
      userId: manager.id,
      employeeCode: "EMP-0003",
      firstNameTh: "ธนาเทพ",
      lastNameTh: "ชัยกิจ",
      nickname: "โต้ง",
      phone: "09x-xxx-9010",
      positionTitle: "ผู้จัดการปฏิบัติการ",
      teamId: hqTeam.id,
      startedAt: new Date("2025-01-01T00:00:00.000+07:00"),
    },
  });

  const devProfile = await prisma.employeeProfile.create({
    data: {
      userId: dev.id,
      employeeCode: "EMP-0004",
      firstNameTh: "ภาคิน",
      lastNameTh: "ภู่ผลา",
      nickname: "โปร",
      phone: "08x-xxx-7432",
      positionTitle: "Developer",
      teamId: hqTeam.id,
      startedAt: new Date("2025-01-01T00:00:00.000+07:00"),
    },
  });

  const employeeAProfile = await prisma.employeeProfile.create({
    data: {
      userId: employeeA.id,
      employeeCode: "EMP-1001",
      firstNameTh: "กิตติชัย",
      lastNameTh: "พรหมมา",
      nickname: "ตั้ม",
      phone: "08x-xxx-2101",
      bankAccountNo: "1234567890",
      bankName: "กสิกรไทย",
      positionTitle: "ช่างติดตั้งรายวัน",
      teamId: teamA.id,
      leaderId: leader.id,
      startedAt: new Date("2025-01-01T00:00:00.000+07:00"),
    },
  });

  const employeeBProfile = await prisma.employeeProfile.create({
    data: {
      userId: employeeB.id,
      employeeCode: "EMP-1002",
      firstNameTh: "มณีรัตน์",
      lastNameTh: "วงศ์สวัสดิ์",
      nickname: "แป้ง",
      phone: "09x-xxx-8871",
      bankAccountNo: "9876543210",
      bankName: "กรุงไทย",
      positionTitle: "ธุรการหน้างาน",
      teamId: teamA.id,
      leaderId: leader.id,
      startedAt: new Date("2025-01-01T00:00:00.000+07:00"),
    },
  });

  const workPlan = await prisma.workPlan.create({
    data: {
      teamId: teamA.id,
      workDate: new Date("2026-04-06T00:00:00.000+07:00"),
      title: "ติดตั้งระบบไฟชั้น 2",
      jobSiteName: "อาคารสำนักงานใหญ่ พระราม 9",
      jobSiteAddress: "แขวงบางกะปิ เขตห้วยขวาง กรุงเทพมหานคร",
      detail: "ติดตั้งอุปกรณ์และตรวจสอบระบบก่อนส่งมอบ",
      note: "เข้าหน้างานก่อน 09:00 และบันทึกภาพก่อน-หลังงาน",
      createdById: admin.id,
      updatedById: manager.id,
    },
  });

  await prisma.workPlanAssignment.createMany({
    data: [
      {
        workPlanId: workPlan.id,
        employeeProfileId: leaderProfile.id,
        assignmentRole: "leader",
      },
      {
        workPlanId: workPlan.id,
        employeeProfileId: employeeAProfile.id,
        assignmentRole: "employee",
      },
      {
        workPlanId: workPlan.id,
        employeeProfileId: employeeBProfile.id,
        assignmentRole: "employee",
      },
    ],
  });

  await prisma.attendance.create({
    data: {
      employeeProfileId: employeeAProfile.id,
      submittedById: employeeA.id,
      teamId: teamA.id,
      workDate: new Date("2026-04-06T00:00:00.000+07:00"),
      clockInAt: new Date("2026-04-06T08:24:00.000+07:00"),
      clockOutAt: new Date("2026-04-06T17:35:00.000+07:00"),
      totalMinutes: 551,
      status: "pending_leader_approval",
      note: "เข้างานตรงไซต์ตามแผนงาน",
      approval: {
        create: {
          approverId: leader.id,
          decision: "pending",
        },
      },
    },
  });

  await prisma.attendance.create({
    data: {
      employeeProfileId: employeeBProfile.id,
      submittedById: employeeB.id,
      teamId: teamA.id,
      workDate: new Date("2026-04-05T00:00:00.000+07:00"),
      clockInAt: new Date("2026-04-05T08:40:00.000+07:00"),
      clockOutAt: new Date("2026-04-05T17:10:00.000+07:00"),
      totalMinutes: 510,
      status: "approved",
      lockedAt: new Date("2026-04-05T18:00:00.000+07:00"),
      approval: {
        create: {
          approverId: leader.id,
          decision: "approved",
          decidedAt: new Date("2026-04-05T18:00:00.000+07:00"),
          note: "เวลาครบถ้วน",
        },
      },
    },
  });

  await prisma.paymentRecord.createMany({
    data: [
      {
        employeeProfileId: employeeAProfile.id,
        teamId: teamA.id,
        periodStart: new Date("2026-04-01T00:00:00.000+07:00"),
        periodEnd: new Date("2026-04-30T23:59:59.000+07:00"),
        totalHours: new Prisma.Decimal(176),
        totalWorkedDays: new Prisma.Decimal(21),
        equivalentDays: new Prisma.Decimal(22),
        payAmount: new Prisma.Decimal(15400),
        status: "unpaid",
        updatedById: manager.id,
      },
      {
        employeeProfileId: employeeBProfile.id,
        teamId: teamA.id,
        periodStart: new Date("2026-04-01T00:00:00.000+07:00"),
        periodEnd: new Date("2026-04-30T23:59:59.000+07:00"),
        totalHours: new Prisma.Decimal(168.5),
        totalWorkedDays: new Prisma.Decimal(20),
        equivalentDays: new Prisma.Decimal(21.06),
        payAmount: new Prisma.Decimal(14750),
        status: "paid",
        paidAt: new Date("2026-04-30T18:00:00.000+07:00"),
        updatedById: manager.id,
      },
    ],
  });

  console.log("Seed completed successfully.");
  console.log("Default password for all users:", defaultPassword);
  console.log(
    "Demo usernames:",
    ["leader01", "admin01", "manager01", "dev01", "employee01", "employee02"].join(", "),
  );

  void adminProfile;
  void managerProfile;
  void devProfile;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });
