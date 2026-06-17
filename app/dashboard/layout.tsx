import Sidebar from "@/component/ui/Sidebar";
import { Suspense } from "react";
import { DashboardProvider } from "../../context/DashboardContext";
import ConnectionErrorBanner from "@/component/shared/ConnectionErrorBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-200">
        <Suspense
          fallback={
            <aside className="w-64 min-h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800" />
          }
        >
          <Sidebar />
        </Suspense>
        <main className="flex-1 ml-[60px] p-6 md:p-10 lg:p-12 overflow-y-auto max-h-screen">
          <ConnectionErrorBanner />
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
}
