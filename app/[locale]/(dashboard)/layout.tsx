import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/shared/Sidebar";
import { ClientAuthBoundary } from "@/lib/auth-boundary";
import { isAuthenticated } from "@/lib/auth-server";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(await isAuthenticated())) {
    redirect(`/${locale}/sign-in`);
  }

  return (
    <ClientAuthBoundary>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar locale={locale} />
        <main className="flex-1 overflow-x-hidden p-6">{children}</main>
      </div>
    </ClientAuthBoundary>
  );
}
