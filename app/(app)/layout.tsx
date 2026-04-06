import { AppShell } from "@/components/layout/app-shell";
import { getAppViewer } from "@/lib/auth/session";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getAppViewer();

  return <AppShell user={viewer}>{children}</AppShell>;
}
