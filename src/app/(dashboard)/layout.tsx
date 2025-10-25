import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

export const metadata: Metadata = {
  title: "Dashboard | Stratos",
  description: "Manage your business with Stratos",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <AppHeader />

      {/* Main content area with sidebar */}
      <div className="flex flex-1">
        {/* Left-aligned sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1">
          <div className="container-wrapper 3xl:fixed:px-0 py-2">
            <div className="3xl:fixed:container w-full px-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
