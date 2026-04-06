"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { seedCredentials } from "@/lib/mock-data";
import { cn } from "@/lib/cn";

type LoginFormProps = {
  authEnabled: boolean;
};

function getErrorMessage(error: string | null) {
  if (!error) {
    return null;
  }

  if (error === "CredentialsSignin") {
    return "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
  }

  return "ไม่สามารถเข้าสู่ระบบได้ในขณะนี้";
}

export function LoginForm({ authEnabled }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const loginError = useMemo(
    () => getErrorMessage(searchParams.get("error")),
    [searchParams],
  );

  const canSubmit = authEnabled && username.trim() && password.trim();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!authEnabled) {
      toast.info("ยังไม่ได้เปิดโหมดล็อกอินจริง", {
        description: "กรุณาตั้งค่า DATABASE_URL และ seed ข้อมูลก่อน",
      });
      return;
    }

    startTransition(async () => {
      const result = await signIn("credentials", {
        username,
        password,
        callbackUrl,
        redirect: false,
      });

      if (!result) {
        toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
        return;
      }

      if (result.error) {
        toast.error("เข้าสู่ระบบไม่สำเร็จ", {
          description: getErrorMessage(result.error) ?? result.error,
        });
        return;
      }

      toast.success("เข้าสู่ระบบสำเร็จ");
      router.push(result.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          ชื่อผู้ใช้หรืออีเมล
        </label>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="field-shell w-full"
          placeholder="เช่น manager01 หรือ manager@company.com"
          autoComplete="username"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          รหัสผ่าน
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="field-shell w-full"
          placeholder="กรอกรหัสผ่าน"
          autoComplete="current-password"
        />
      </div>

      {loginError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {loginError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit || pending}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold text-white transition",
          canSubmit && !pending
            ? "bg-blue-600 hover:bg-blue-700"
            : "cursor-not-allowed bg-slate-300",
        )}
      >
        <LogIn className="h-4 w-4" />
        {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">บัญชีสำหรับทดสอบจาก seed</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          รหัสผ่านเริ่มต้นคือ <span className="font-mono">{seedCredentials.password}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {seedCredentials.usernames.map((demoUsername) => (
            <button
              key={demoUsername}
              type="button"
              onClick={() => {
                setUsername(demoUsername);
                setPassword(seedCredentials.password);
              }}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <KeyRound className="mr-2 inline h-3.5 w-3.5" />
              {demoUsername}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
