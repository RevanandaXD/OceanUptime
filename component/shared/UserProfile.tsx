"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, SquareArrowRightExit } from "lucide-react";
import { logout } from "@/app/auth/action";
import { useUser } from "@/hooks/useUser";

export function UserProfile() {
  const { user } = useUser()

  const handleTier = (tier: string) => {
    const normalized = tier.toLowerCase();
    switch (normalized) {
      case "pro":
        return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30";
      case "admin":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      case "free":
      default:
        return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/30";
    }
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 py-4 pl-3.5 pr-3">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-8 w-8 shrink-0 animate-fade-in items-center justify-center rounded-full border border-zinc-300 bg-zinc-200 font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <User className="h-4 w-4" />
        </div>
        <div className="flex flex-col gap-0.5 overflow-hidden whitespace-nowrap opacity-0 -translate-x-2 transition-all duration-75 ease-in group-hover:translate-x-0 group-hover:opacity-100 group-hover:duration-300 group-hover:ease-out group-hover:delay-150">
          <span className="truncate text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center">
            {user.username}
            <span className={`ml-1 text-[8px] px-1 rounded-xl tracking-widest ${handleTier(user.tier)}`}>
              {user.tier}
            </span>
          </span>
          <span className="truncate text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
            {user.email}
          </span>
        </div>
      </div>
      <button
        onClick={() => logout()}
        className="shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-400 opacity-0 -translate-x-2 transition-all duration-75 ease-in group-hover:translate-x-0 group-hover:opacity-100 group-hover:duration-300 group-hover:ease-out group-hover:delay-150 hover:bg-rose-50 hover:text-rose-600 dark:text-zinc-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
        title="Log Out"
      >
        <SquareArrowRightExit className="h-4 w-4" />
      </button>
    </div>
  );
}
