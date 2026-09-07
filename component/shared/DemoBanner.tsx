"use client";

import Link from "next/link";
import { FlaskConical, X } from "lucide-react";

import { clearDemoCookie } from "@/utils/demo";
import { useDashboard } from "@/context/dashboardStore";

export default function DemoBanner() {
  const { isDemo, setDemo } = useDashboard();

  if (!isDemo) return null;

  const exitDemo = () => {
    clearDemoCookie();
    setDemo(false);
    window.location.reload();
    window.location.href = '/'
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-indigo-200/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-300 text-xs font-semibold backdrop-blur-sm animate-fade-in shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
          <FlaskConical className="h-4 w-4 shrink-0" />
        </div>
        <div>
          <span className="font-bold block text-sm sm:inline sm:text-xs text-indigo-900 dark:text-indigo-200">
            Demo Mode
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal mt-0.5 sm:mt-0 sm:ml-1.5 block sm:inline">
            Menampilkan data contoh. Ubah &amp; simpan data hanya untuk akun
            terdaftar.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/auth"
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
        >
          Masuk
        </Link>
        <button
          onClick={exitDemo}
          className="flex items-center justify-center gap-1 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer"
        >
          <X className="h-3 w-3" />
          Exit
        </button>
      </div>
    </div>
  );
}