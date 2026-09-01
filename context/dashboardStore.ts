"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { getDashboardData } from "@/app/dashboard/action";
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
  fetchData: () => Promise<void>;
  handleRefresh: () => Promise<void>;
  init: () => void;
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

  init: () => {
    const savedTheme = localStorage.getItem("theme-mode") || "dark";
    get().applyGlobalTheme(savedTheme);

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
    useDashboardStore.getState().init();

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

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  return null;
}
