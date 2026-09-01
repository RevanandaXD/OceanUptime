"use client";

import { useDashboard } from "@/context/dashboardStore";
import { WifiOff, RotateCw } from "lucide-react";

export default function ConnectionErrorBanner() {
  const { error, handleRefresh, isRefreshing } = useDashboard();

  if (!error) return null;

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-amber-200/30 bg-amber-50/50 dark:bg-amber-950/10 text-amber-800 dark:text-amber-400 text-xs font-semibold backdrop-blur-sm animate-fade-in shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500">
          <WifiOff className="h-4 w-4 shrink-0" />
        </div>
        <div>
          <span className="font-bold block text-sm sm:inline sm:text-xs text-amber-900 dark:text-amber-200">
            Supabase Connection Lost
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal mt-0.5 sm:mt-0 sm:ml-1.5 block sm:inline">
            Unable to fetch live status: {error}. Displaying last cached check data.
          </span>
        </div>
      </div>
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-500 text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm shrink-0 w-full sm:w-auto cursor-pointer"
      >
        <RotateCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Retrying..." : "Retry Connection"}
      </button>
    </div>
  );
}
