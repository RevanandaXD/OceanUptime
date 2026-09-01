import Sidebar from "@/component/ui/Sidebar";
import MobileNav from "@/component/ui/MobileNav";
import { Suspense } from "react";
import { DashboardInit } from "../../context/dashboardStore";
import ConnectionErrorBanner from "@/component/shared/ConnectionErrorBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="theme-scope flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-200">
        <DashboardInit />
        <Suspense
          fallback={
            <aside className="hidden w-64 min-h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 md:block" />
          }
        >
          <Sidebar />
        </Suspense>
        <main className="flex-1 min-w-0 ml-0 md:ml-[60px] p-4 md:p-10 lg:p-12 pb-24 md:pb-10 overflow-y-auto max-h-screen">
          <ConnectionErrorBanner />
          {children}
        </main>
      </div>
      <MobileNav />
    </>
  );
}
