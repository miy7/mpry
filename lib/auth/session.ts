import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import type { AppViewer, PageKey } from "@/lib/types";
import { demoUsers } from "@/lib/mock-data";
import { getPrisma } from "@/lib/prisma";
import { canAccessPage } from "@/lib/rbac";
import { authOptions } from "@/lib/auth/options";

const demoViewer =
  demoUsers.find((user) => user.role === "manager") ?? demoUsers[0];

export function isAuthEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export const getServerAuthSession = cache(async () => {
  if (!isAuthEnabled()) {
    return null;
  }

  return getServerSession(authOptions);
});

export const getAppViewer = cache(async (): Promise<AppViewer> => {
  if (!isAuthEnabled()) {
    return {
      ...demoViewer,
      isDemoMode: true,
    };
  }

  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      profile: {
        include: {
          team: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return {
    id: user.id,
    fullName: user.name ?? user.username,
    nickname:
      user.profile?.nickname ??
      user.name?.split(" ").at(0) ??
      user.username,
    username: user.username,
    email: user.email ?? undefined,
    role: user.role,
    team: user.profile?.team?.name ?? "ยังไม่ระบุทีม",
    status: user.status === "active" ? "active" : "inactive",
    phone: user.phone ?? user.profile?.phone ?? "-",
    bankName: user.profile?.bankName ?? undefined,
    bankAccountMasked: user.profile?.bankAccountNo
      ? `xxx-x-${user.profile.bankAccountNo.slice(-4)}`
      : undefined,
    leaderName: undefined,
    position: user.profile?.positionTitle ?? user.role,
    isDemoMode: false,
  };
});

export async function requirePageAccess(page: PageKey) {
  const viewer = await getAppViewer();

  if (!canAccessPage(viewer.role, page)) {
    redirect("/forbidden");
  }

  return viewer;
}
