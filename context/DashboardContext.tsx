"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getDashboardData } from "@/app/dashboard/action";
import { Monitor, Incident, Activity } from "./types";

interface DashboardContextType {
  monitors: Monitor[];
  setMonitors: React.Dispatch<React.SetStateAction<Monitor[]>>;
  incidents: Incident[];
  setIncidents: React.Dispatch<React.SetStateAction<Incident[]>>;
  activity: Activity[];
  setActivity: React.Dispatch<React.SetStateAction<Activity[]>>;
  configuredProviders: string[];
  totalChecks: number;
  isRefreshing: boolean;
  handleRefresh: () => void;
  isLoadingInitialData: boolean;
  error: string | null;
  theme: string;
  applyGlobalTheme: (themeId: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [configuredProviders, setConfiguredProviders] = useState<string[]>([]);
  const [totalChecks, setTotalChecks] = useState<number>(0);
  const [isRefreshing, setIsRefresing] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("dark");

  const applyGlobalTheme = (themeId: string) => {
    setTheme(themeId);
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
  };

  const fetchData = async () => {
    try {
      const data = await getDashboardData();
      const nextMonitors = data.monitors || [];
      const nextIncidents = data.incidents || [];
      const nextActivity = data.activity || [];
      const nextConfiguredProviders = data.configuredProviders || [];
      const nextTotalChecks = data.totalChecks || 0;

      setMonitors(nextMonitors);
      setIncidents(nextIncidents);
      setActivity(nextActivity);
      setConfiguredProviders(nextConfiguredProviders);
      setTotalChecks(nextTotalChecks);

      // Save to localStorage cache
      localStorage.setItem("cached-monitors", JSON.stringify(nextMonitors));
      localStorage.setItem("cached-incidents", JSON.stringify(nextIncidents));
      localStorage.setItem("cached-activity", JSON.stringify(nextActivity));
      localStorage.setItem("cached-configured-providers", JSON.stringify(nextConfiguredProviders));
      localStorage.setItem("cached-total-checks", nextTotalChecks.toString());

      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch dashboard data", err);
      setError(err.message || "Failed to fetch dashboard data");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-mode") || "dark";
    applyGlobalTheme(savedTheme);

    // Initial cache load for data to avoid flashing 0s
    try {
      const cachedMonitors = localStorage.getItem("cached-monitors");
      const cachedIncidents = localStorage.getItem("cached-incidents");
      const cachedActivity = localStorage.getItem("cached-activity");
      const cachedConfiguredProviders = localStorage.getItem("cached-configured-providers");
      const cachedTotalChecks = localStorage.getItem("cached-total-checks");
      
      if (cachedMonitors) setMonitors(JSON.parse(cachedMonitors));
      if (cachedIncidents) setIncidents(JSON.parse(cachedIncidents));
      if (cachedActivity) setActivity(JSON.parse(cachedActivity));
      if (cachedConfiguredProviders) setConfiguredProviders(JSON.parse(cachedConfiguredProviders));
      if (cachedTotalChecks) setTotalChecks(parseInt(cachedTotalChecks) || 0);
    } catch (err) {
      console.error("Failed to load cached dashboard data:", err);
    }

    fetchData().finally(() => {
      setIsLoadingInitialData(false);
    });

    const INTERVAL_MS = 20000;
    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && !isRefreshing) {
        fetchData();
      }
    }, INTERVAL_MS);

    // Langsung update ketika user kembali ke tab ini dari tab lain
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefresing(true);
    await fetchData();
    setIsRefresing(false);
  };

  return (
    <DashboardContext.Provider
      value={{
        monitors,
        setMonitors,
        incidents,
        setIncidents,
        activity,
        setActivity,
        configuredProviders,
        totalChecks,
        isRefreshing,
        handleRefresh,
        isLoadingInitialData,
        error,
        theme,
        applyGlobalTheme,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("UseDashboard must be used within a DashboardProvider");
  }
  return context;
}
