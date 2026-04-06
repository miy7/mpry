# System Blueprint

## 1. Architecture ของระบบ

- Frontend ใช้ `Next.js App Router` แยกหน้าแต่ละส่วนของงานออกจากกันชัดเจน
- UI ใช้ `Tailwind CSS` และออกแบบ mobile-first ให้ปุ่มใหญ่ ตัวอักษรชัด ตารางอ่านง่าย
- Data layer ใช้ `Prisma ORM` กับ `PostgreSQL`
- Authentication แนะนำ `NextAuth / Auth.js + Credentials + Prisma Adapter`
- Authorization ใช้ RBAC 2 ชั้น:
  1. route/page access
  2. action access ใน server actions / route handlers
- หน้าใช้งานหลักแบ่งเป็น 6 โมดูล:
  - Dashboard / แผนงานรายวัน
  - ลงเวลาเข้า-ออก
  - Calendar การมาทำงาน
  - สรุปวันทำงานและสถานะจ่ายเงิน
  - ข้อมูลพนักงาน
  - จัดการผู้ใช้ทั้งหมด

## 2. Database Schema ที่ออกแบบ

model หลัก:

- `User` เก็บบัญชีผู้ใช้, role, status, credential data
- `EmployeeProfile` เก็บข้อมูลพนักงานเชิงธุรการ
- `Team` เก็บทีมและหัวหน้าทีม
- `WorkPlan` เก็บแผนงานประจำวัน
- `WorkPlanAssignment` ผูกแผนงานกับพนักงานหลายคน
- `Attendance` เก็บเวลาเข้า/ออกงานต่อคนต่อวัน
- `AttendanceApproval` เก็บผลยืนยันจากหัวทีม
- `PaymentRecord` เก็บสรุปชั่วโมงและสถานะการจ่ายเงินตามรอบ
- `Account / Session / VerificationToken` รองรับ auth adapter

ความสัมพันธ์หลัก:

- พนักงาน 1 คน มี `User` 1 รายการ และ `EmployeeProfile` 1 รายการ
- พนักงานอยู่ได้ 1 ทีมหลักผ่าน `EmployeeProfile.teamId`
- พนักงานมีหัวหน้าที่ดูแลผ่าน `EmployeeProfile.leaderId`
- 1 แผนงานมีผู้เกี่ยวข้องหลายคนผ่าน `WorkPlanAssignment`
- 1 Attendance ผูกกับ 1 EmployeeProfile และมี Approval ได้ 1 รายการ
- PaymentRecord ผูกกับพนักงานรายคนตามช่วงเวลา เช่น รายเดือน

## 3. Folder Structure สำหรับ Next.js

```text
app/
  (app)/
    dashboard/page.tsx
    attendance/page.tsx
    calendar/page.tsx
    work-summary/page.tsx
    employees/page.tsx
    users/page.tsx
    layout.tsx
  (auth)/
    login/page.tsx
  forbidden.tsx
  loading.tsx
  page.tsx
  unauthorized.tsx
components/
  layout/
  ui/
docs/
  system-blueprint.md
lib/
  cn.ts
  format.ts
  mock-data.ts
  prisma.ts
  rbac.ts
  types.ts
prisma/
  schema.prisma
  seed.ts
```

แนวคิดการแยกโค้ด:

- `app` เก็บ routing เท่านั้น
- `components` เก็บ UI reuse ได้
- `lib` เก็บ business rules, utility, RBAC, data helpers
- `prisma` เก็บ schema และ seed
- `docs` เก็บ design decisions และ phase plan

## 4. หน้าทั้งหมดของระบบ

1. `Dashboard`
   - ปฏิทินรายเดือน
   - การ์ดสรุปงานประจำวัน
   - รายละเอียดหัวทีม / ลูกทีม / สถานที่ / หมายเหตุ
2. `Attendance`
   - ปุ่มลงเวลาเข้า
   - ปุ่มลงเวลาออก
   - สถานะรอยืนยัน / ยืนยันแล้ว / ไม่อนุมัติ
   - flow การอนุมัติหัวทีม
3. `Calendar การมาทำงาน`
   - ปฏิทินย้อนหลัง
   - ตารางรายการ
   - filter ทีม / หัวทีม / พนักงาน / ช่วงวันที่
4. `Work Summary / Payroll`
   - ชั่วโมงรวม
   - Equivalent day
   - สถานะจ่ายเงิน
   - ปุ่มเปลี่ยนสถานะจ่ายเงิน
5. `Employees`
   - ตาราง/การ์ดพนักงาน
   - ฟอร์มเพิ่ม/แก้ไขข้อมูล
6. `Users`
   - จัดการบัญชีผู้ใช้
   - กำหนด role
   - ปิดการใช้งาน
   - เตรียม reset password
7. `Login`
   - เข้าสู่ระบบ / ออกจากระบบ
   - session-based auth

## 5. Workflow ของแต่ละ role

### employee

- ดูแผนงานของตัวเอง
- ลงเวลาเข้า/ออกของตัวเอง
- ดูประวัติ attendance ของตัวเอง
- ไม่มีสิทธิ์ยืนยันหรือเปลี่ยนสถานะจ่ายเงิน

### leader

- ดูแผนงานทีม
- ยืนยัน attendance ของลูกทีม
- ดู calendar การมาทำงานย้อนหลัง
- ดู summary ชั่วโมงและสถานะจ่ายเงินของทีม

### admin

- จัดการแผนงาน
- จัดการข้อมูลพนักงาน
- ดูรายงานภาพรวม
- ช่วยตรวจสอบ attendance ได้

### manager

- เข้าถึงข้อมูลภาพรวมทั้งหมด
- จัดการบัญชีผู้ใช้ทุก role
- ดูทุก report และสรุปการจ่ายเงิน

### dev

- เข้าถึงทั้งหมด
- ใช้ดูแลระบบ, debug และพัฒนาฟีเจอร์ต่อ

## 6. Package ที่ควรใช้

ที่ติดตั้งไว้แล้วใน repo:

- `prisma`
- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`
- `next-auth`
- `@next-auth/prisma-adapter`
- `bcryptjs`
- `zod`
- `sonner`
- `lucide-react`
- `clsx`
- `tailwind-merge`
- `date-fns`
- `tsx`

บทบาทของแต่ละ package:

- `next-auth` ใช้ทำ login/logout และ session
- `bcryptjs` ใช้ hash password
- `zod` ใช้ validation ฟอร์มและ server actions
- `sonner` ใช้ toast แจ้งเตือน
- `lucide-react` ใช้ icon ที่อ่านง่ายและดูมืออาชีพ
- `clsx` + `tailwind-merge` ใช้ compose class

## 7. ตัวอย่าง UI ของแต่ละหน้า

แนว UI/UX ที่ใช้:

- background สว่าง อ่านง่าย
- card ขอบมนชัดเจน
- สีสถานะ:
  - เขียว = ยืนยันแล้ว / จ่ายแล้ว
  - แดง = ไม่อนุมัติ / ยังไม่จ่าย
  - เหลือง = รอยืนยัน
  - น้ำเงิน = action หลัก
- มือถือใช้ปุ่มเต็มแถวและ bottom navigation
- desktop ใช้ sidebar + content layout

## 8. ขั้นตอนการพัฒนาเป็น Phase

### Phase 1: Foundation

- สร้าง schema, seed, RBAC, UI shell
- ทำ login page และระบบ session
- เชื่อม Prisma + PostgreSQL

### Phase 2: Core Operations

- ทำ Dashboard + WorkPlan CRUD
- ทำ Attendance check-in / check-out
- ทำ AttendanceApproval โดยหัวทีม

### Phase 3: Reporting

- ทำ Calendar การมาทำงาน
- ทำ summary ชั่วโมงและ equivalent day
- ทำ PaymentRecord และสถานะจ่ายเงิน

### Phase 4: Admin & Hardening

- ทำหน้าข้อมูลพนักงานและผู้ใช้
- เพิ่ม validation, loading/empty/error state
- เพิ่ม audit log, masking sensitive data, test

### Phase 5: Deployment

- ตั้ง env บน Vercel
- เชื่อม PostgreSQL production
- รัน migration / generate / seed ตามความเหมาะสม

## 9. แนวทาง Prisma Schema เริ่มต้น

สิ่งที่ schema นี้รองรับแล้ว:

- ผู้ใช้หลาย role
- ทีมและหัวหน้าทีม
- แผนงานรายวันแบบ assign ได้หลายคน
- attendance ต่อคนต่อวัน
- approval แยก model ชัดเจน
- payment record ต่อช่วงเวลา

ถ้าจะต่อยอดภายหลัง:

- เพิ่ม audit log
- เพิ่ม attachment รูปหน้างาน
- เพิ่ม location check / GPS
- เพิ่ม soft delete
- เพิ่ม payroll amount rules ตามเรทค่าจ้าง

## 10. แนวทาง Auth และ Permission

Authentication:

- ใช้ `next-auth` แบบ Credentials provider
- ตรวจ username/email + password hash จาก `User`
- เก็บ `user.id`, `role`, `teamId` ใน session/JWT

Authorization:

- ตรวจสิทธิ์การเข้าหน้าโดยใช้ role matrix
- ตรวจซ้ำทุก mutation ใน server actions และ route handlers
- อย่าพึ่งพา UI hide/show อย่างเดียว

แนว guard ที่แนะนำ:

1. page guard
   - ตรวจ session และ role ก่อน render หน้า sensitive
2. DAL / server action guard
   - ตรวจว่าผู้ใช้ทำ action นี้ได้จริงหรือไม่
3. DTO / field-level guard
   - ซ่อนข้อมูลเช่นเลขบัญชี ถ้า role ไม่ถึง

ตัวอย่าง mapping:

- `employee`:
  - ดูของตัวเอง
  - ลงเวลาของตัวเอง
- `leader`:
  - ยืนยัน attendance ทีมตัวเอง
  - ดูสรุปทีม
- `admin`:
  - จัดการแผนงานและข้อมูลพนักงาน
- `manager`:
  - จัดการผู้ใช้ทั้งหมด
  - ดูข้อมูลภาพรวมทุกหน้า
- `dev`:
  - full access

## แนวทาง Deploy บน Vercel

- สร้าง PostgreSQL production ก่อน
- ตั้งค่า env:
  - `DATABASE_URL`
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
- รัน `npm run db:generate`
- ใช้ `prisma migrate deploy` หรือ `db push` ตาม strategy ที่ทีมเลือก
- หลัง deploy ครั้งแรก ถ้าต้องใช้ข้อมูลตัวอย่าง ค่อยรัน seed แยก

ข้อแนะนำ:

- production ควรใช้ migration มากกว่า `db push`
- แยก staging / production database
- ถ้าปริมาณ request สูง ให้พิจารณา connection pooling ของ PostgreSQL
