export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="app-shell-card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-blue-100" />
        <p className="text-lg font-semibold text-slate-900">กำลังโหลดข้อมูล...</p>
        <p className="mt-2 text-sm text-slate-500">
          ระบบกำลังเตรียมแดชบอร์ดและข้อมูลการทำงานให้พร้อมใช้งาน
        </p>
      </div>
    </div>
  );
}
