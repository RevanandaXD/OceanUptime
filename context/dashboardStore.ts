"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { getDashboardData } from "@/app/dashboard/action";
import { createClient } from "@/utils/supabase/client";
import {
  DEMO_ACTIVITY,
  DEMO_CONFIGURED_PROVIDERS,
  DEMO_INCIDENTS,
  DEMO_MONITORS,
  DEMO_TOTAL_CHECKS,
  getDemoCookie,
  setDemoCookie,
} from "@/utils/demo";
import { Monitor, Incident, Activity } from "./types";

interface DashboardStore {
  monitors: Monitor[];
  setMonitors: (monitors: Monitor[]) => void;
  incidents: Incident[];
  setIncidents: (incidents: Incident[]) => void;
  activity: Activity[];
  setActivity: (activity: Activity[]) => void;
  configuredProviders: string[];
  setConfiguredProviders: (providers: string[]) => void;
  totalChecks: number;
  setTotalChecks: (total: number) => void;
  isRefreshing: boolean;
  setIsRefreshing: (value: boolean) => void;
  isLoadingInitialData: boolean;
  setIsLoadingInitialData: (value: boolean) => void;
  error: string | null;
  setError: (message: string | null) => void;
  theme: string;
  applyGlobalTheme: (themeId: string) => void;
  isDemo: boolean;
  setDemo: (value: boolean) => void;
  fetchData: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  init: () => Promise<void>;
}

// Quick non-null setter to apply demo data into the store.
function applyDemoData(set: (partial: Partial<DashboardStore>) => void) {
  set({
    monitors: DEMO_MONITORS,
    incidents: DEMO_INCIDENTS,
    activity: DEMO_ACTIVITY,
    configuredProviders: DEMO_CONFIGURED_PROVIDERS,
    totalChecks: DEMO_TOTAL_CHECKS,
    error: null,
  });
}

// Demo mode = explicit ?demo=1 in the URL (permanently for unauthenticated
// visitors via cookie), otherwise real session data.
async function resolveDemo(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const urlDemo = new URLSearchParams(window.location.search).has("demo");
  if (urlDemo) {
    setDemoCookie();
    return true;
  }

  // Persisted demo cookie is only honored when there is no active session,
  // so real users can never get stuck in demo mode.
  if (getDemoCookie() === String("1")) {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (!data.session) return true;
  }

  return false;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  monitors: [],
  setMonitors: (monitors) => set({ monitors }),
  incidents: [],
  setIncidents: (incidents) => set({ incidents }),
  activity: [],
  setActivity: (activity) => set({ activity }),
  configuredProviders: [],
  setConfiguredProviders: (configuredProviders) => set({ configuredProviders }),
  totalChecks: 0,
  setTotalChecks: (totalChecks) => set({ totalChecks }),
  isRefreshing: false,
  setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
  isLoadingInitialData: true,
  setIsLoadingInitialData: (isLoadingInitialData) => set({ isLoadingInitialData }),
  error: null,
  setError: (error) => set({ error }),
  theme: "dark",
  isDemo: false,
  setDemo: (isDemo) => set({ isDemo }),

  applyGlobalTheme: (themeId) => {
    set({ theme: themeId });
    localStorage.setItem("theme-mode", themeId);

    const root = window.document.documentElement;
    root.setAttribute("data-theme", themeId);
    if (themeId === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  },

  fetchData: async () => {
    // Demo mode is fully client-side: never touch Supabase or localStorage.
    if (get().isDemo) {
      applyDemoData(set);
      return;
    }

    try {
      const data = await getDashboardData();
      const nextMonitors = data.monitors || [];
      const nextIncidents = data.incidents || [];
      const nextActivity = data.activity || [];
      const nextConfiguredProviders = data.configuredProviders || [];
      const nextTotalChecks = data.totalChecks || 0;

      set({
        monitors: nextMonitors,
        incidents: nextIncidents,
        activity: nextActivity,
        configuredProviders: nextConfiguredProviders,
        totalChecks: nextTotalChecks,
        error: null,
      });

      localStorage.setItem("cached-monitors", JSON.stringify(nextMonitors));
      localStorage.setItem("cached-incidents", JSON.stringify(nextIncidents));
      localStorage.setItem("cached-activity", JSON.stringify(nextActivity));
      localStorage.setItem(
        "cached-configured-providers",
        JSON.stringify(nextConfiguredProviders),
      );
      localStorage.setItem("cached-total-checks", nextTotalChecks.toString());
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      set({
        error:
          err instanceof Error ? err.message : "Failed to fetch dashboard data",
      });
    }
  },

  handleRefresh: async () => {
    set({ isRefreshing: true });
    await get().fetchData();
    set({ isRefreshing: false });
  },

  init: async () => {
    const savedTheme = localStorage.getItem("theme-mode") || "dark";
    get().applyGlobalTheme(savedTheme);

    const isDemo = await resolveDemo();
    set({ isDemo });

    // Demo visitors jump straight to sample data - no cache, no fetch.
    if (isDemo) {
      applyDemoData(set);
      set({ isLoadingInitialData: false });
      return;
    }

    try {
      const cachedMonitors = localStorage.getItem("cached-monitors");
      const cachedIncidents = localStorage.getItem("cached-incidents");
      const cachedActivity = localStorage.getItem("cached-activity");
      const cachedConfiguredProviders = localStorage.getItem(
        "cached-configured-providers",
      );
      const cachedTotalChecks = localStorage.getItem("cached-total-checks");

      if (cachedMonitors)
        set({ monitors: JSON.parse(cachedMonitors) });
      if (cachedIncidents)
        set({ incidents: JSON.parse(cachedIncidents) });
      if (cachedActivity) set({ activity: JSON.parse(cachedActivity) });
      if (cachedConfiguredProviders)
        set({ configuredProviders: JSON.parse(cachedConfiguredProviders) });
      if (cachedTotalChecks)
        set({ totalChecks: parseInt(cachedTotalChecks) || 0 });
    } catch (err) {
      console.error("Failed to load cached dashboard data:", err);
    }

    get()
      .fetchData()
      .finally(() => {
        set({ isLoadingInitialData: false });
      });
  },
}));

export function useDashboard(): DashboardStore {
  return useDashboardStore();
}

export function DashboardInit() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    useDashboardStore.getState().init().then(() => {
      // Demo data is static - no polling or refetch listeners needed.
      if (useDashboardStore.getState().isDemo) return;

      const INTERVAL_MS = 20000;
      const interval = setInterval(() => {
        if (
          document.visibilityState === "visible" &&
          !useDashboardStore.getState().isRefreshing
        ) {
          useDashboardStore.getState().fetchData();
        }
      }, INTERVAL_MS);

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          useDashboardStore.getState().fetchData();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      cleanup = () => {
        clearInterval(interval);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    });

    return () => cleanup?.();
  }, []);
  return null;
}