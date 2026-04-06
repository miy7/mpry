"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  ShieldUser,
  TimerReset,
  UsersRound,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { canAccessPage, roleLabels } from "@/lib/rbac";
import type { PageKey, UserRole } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  pageKey: PageKey;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "แดชบอร์ด",
    pageKey: "dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/attendance",
    label: "ลงเวลา",
    pageKey: "attendance",
    icon: TimerReset,
  },
  {
    href: "/calendar",
    label: "ปฏิทินงาน",
    pageKey: "calendar",
    icon: CalendarDays,
  },
  {
    href: "/work-summary",
    label: "สรุปวันทำงาน",
    pageKey: "workSummary",
    icon: ClipboardList,
  },
  {
    href: "/employees",
    label: "ข้อมูลพนักงาน",
    pageKey: "employees",
    icon: UsersRound,
  },
  {
    href: "/users",
    label: "ผู้ใช้ทั้งหมด",
    pageKey: "users",
    icon: ShieldUser,
  },
];

type MainNavProps = {
  role: UserRole;
  compact?: boolean;
};

export function MainNav({ role, compact = false }: MainNavProps) {
  const pathname = usePathname();
  const items = navItems.filter((item) => canAccessPage(role, item.pageKey));

  return (
    <nav className={cn("flex gap-2", compact ? "justify-between" : "flex-col")}>
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
              compact
                ? "flex-1 justify-center px-2 py-2.5"
                : "border border-transparent",
              active
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:border-slate-200 hover:bg-white hover:text-slate-900",
            )}
          >
            <Icon className={cn("h-4 w-4", active ? "text-white" : "text-slate-500")} />
            {!compact ? (
              <span>{item.label}</span>
            ) : (
              <span className="text-[11px]">{item.label}</span>
            )}
          </Link>
        );
      })}
      {!compact ? (
        <p className="mt-4 px-1 text-xs leading-5 text-slate-500">
          มุมมองปัจจุบันจำลองเป็น role{" "}
          <span className="font-semibold text-slate-700">{roleLabels[role]}</span>
        </p>
      ) : null}
    </nav>
  );
}
