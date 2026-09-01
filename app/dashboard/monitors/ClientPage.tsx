"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  Pause,
  Play,
  ArrowUpRight,
  Server,
  X,
  Loader2,
} from "lucide-react";
import MonitorChart from "@/component/shared/MonitorChart";
import { useDashboard } from "@/context/dashboardStore";
import { addMonitor, deleteMonitor as deleteMonitorAction, toogleMonitorStatus } from "./action";
import Popup from "@/component/shared/Popup";
export default function MonitorsClient() {
  const { monitors, incidents, handleRefresh, isLoadingInitialData } = useDashboard();

  const [searchTerm, setSearchTerm] = useState("");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMonitor, setNewMonitor] = useState({
    name: "",
    url: "",
    provider: "Generic HTTP",
    expectedKeyword: "",
    isActive: true,
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [monitorToDelete, setMonitorToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (isLoadingInitialData && monitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">
          Loading monitored websites...
        </p>
      </div>
    );
  }

  const toggleActive = async (id: string, name: string, currentlyActive: boolean) => {
    try {
      await toogleMonitorStatus(id, !currentlyActive);
      await handleRefresh();
    } catch (err) {
      console.error("Failed to toggle monitor:", err);
    }
  };

  // Trigger delete popup
  const handleDeleteClick = (id: string, name: string) => {
    setMonitorToDelete({ id, name });
    setIsDeleteOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!monitorToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMonitorAction(monitorToDelete.id);
      await handleRefresh();
      setIsDeleteOpen(false);
      setMonitorToDelete(null);
    } catch (err) {
      console.error("Failed to delete monitor:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Add new monitor
  const handleAddMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonitor.name || !newMonitor.url) return;

    // Standardize URL schema
    let urlVal = newMonitor.url.trim();
    if (!/^https?:\/\//i.test(urlVal)) {
      urlVal = `https://${urlVal}`;
    }

    try {
      await addMonitor({
        name: newMonitor.name,
        url: urlVal,
        provider: newMonitor.provider,
        expectedKeyword: newMonitor.expectedKeyword,
      });

      setIsModalOpen(false);
      setNewMonitor({
        name: "",
        url: "",
        provider: "Generic HTTP",
        expectedKeyword: "",
        isActive: true,
      });

      await handleRefresh();
    } catch (err) {
      console.error("Failed to add monitor:", err);
      alert("Failed to add website. Please check terminal for SUPABASE ERROR.");
    }
  };

  const filteredMonitors = monitors.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.url.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
            Websites
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Register and manage your domains, check intervals, and toggle live
            monitoring.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Website
        </button>
      </div>

      {/* Filter and Chart Toggle Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-850 dark:text-zinc-100"
          />
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-xl border border-zinc-200/20 dark:border-zinc-850/40 self-start sm:self-auto shrink-0 shadow-sm animate-fade-in">
          <button
            type="button"
            onClick={() => setChartType("line")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              chartType === "line"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Line View
          </button>
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              chartType === "bar"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            Bar View
          </button>
        </div>
      </div>

      {/* Grid of Monitors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMonitors.map((monitor) => {
          const activeIncident = incidents.find(
            (inc) => inc.name === monitor.name && (inc.status === "DOWN" || inc.status === "SOMETHING WRONG"),
          );
          const isOffline = activeIncident?.status === "DOWN";
          const isSomethingWrong = activeIncident?.status === "SOMETHING WRONG";
          const isPaused = !monitor.isActive;

          return (
            <div
              key={monitor.id}
              className={`p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all hover-glow flex flex-col justify-between ${
                isPaused ? "opacity-60" : ""
              }`}
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2 text-base">
                      <span className="truncate">{monitor.name}</span>
                      <a
                        href={monitor.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors shrink-0"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5 truncate">
                      {monitor.url}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPaused ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800/40 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/30">
                        PAUSED
                      </span>
                    ) : isOffline ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 pulse-red border border-rose-100 dark:border-rose-900/30">
                        DOWN
                      </span>
                    ) : isSomethingWrong ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 animate-pulse whitespace-nowrap">
                        DEGRADED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 pulse-green border border-emerald-100 dark:border-emerald-900/30">
                        UP
                      </span>
                    )}
                  </div>
                </div>

                {/* Provider Badge */}
                <div className="mt-3 flex gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
                    <Server className="h-2.5 w-2.5 text-zinc-400" />
                    {monitor.provider}
                  </span>
                </div>

                {/* Performance stats row */}
                <div className="grid grid-cols-3 gap-4 my-6 py-4 border-y border-zinc-100 dark:border-zinc-800/50">
                  <div>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                      Uptime
                    </span>
                    <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
                      {monitor.uptime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                      Avg Latency
                    </span>
                    <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
                      {monitor.isActive && !isOffline
                        ? monitor.avgResponse
                        : "--"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                      Interval
                    </span>
                    <span className="font-bold text-sm text-zinc-800 dark:text-zinc-100">
                      5m
                    </span>
                  </div>
                </div>

                {/* SVG Response History sparkline */}
                {monitor.isActive && !isOffline && (
                  <div className="mt-4">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block mb-2">
                      Response History (10 Checks)
                    </span>
                    <div className="h-16">
                      <MonitorChart
                        data={monitor.history}
                        type={chartType}
                        height={60}
                        color="#6366f1"
                        labels={["45m ago", "now"]}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                <button
                  onClick={() =>
                    toggleActive(monitor.id, monitor.name, monitor.isActive)
                  }
                  className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  {monitor.isActive ? (
                    <>
                      <Pause className="h-3.5 w-3.5" /> Pause Checks
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> Resume Checks
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteClick(monitor.id, monitor.name)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Monitor Modal popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden scale-up">
            <div className="flex justify-between items-center p-5 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-base font-bold font-heading text-zinc-900 dark:text-white">
                Add New Website
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddMonitor} className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                  Website Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="My Website"
                  value={newMonitor.name}
                  onChange={(e) =>
                    setNewMonitor((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-850 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                  Target URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com"
                  value={newMonitor.url}
                  onChange={(e) =>
                    setNewMonitor((prev) => ({ ...prev, url: e.target.value }))
                  }
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-850 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                  Expected Keyword (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cybersecurity, Home, Login"
                  value={newMonitor.expectedKeyword}
                  onChange={(e) =>
                    setNewMonitor((prev) => ({ ...prev, expectedKeyword: e.target.value }))
                  }
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-850 dark:text-zinc-100"
                />
                <p className="text-[10px] text-zinc-550 dark:text-zinc-500 mt-1">
                  Ensures the page HTML contains this text (useful for React/Vue SPA white-screen check).
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                  Hosting Provider
                </label>
                <select
                  value={newMonitor.provider}
                  onChange={(e) =>
                    setNewMonitor((prev) => ({
                      ...prev,
                      provider: e.target.value,
                    }))
                  }
                  className="w-full p-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-850 dark:text-zinc-100"
                >
                  <option value="Generic HTTP">Generic HTTP</option>
                  <option value="Vercel">Vercel</option>
                  <option value="Netlify">Netlify</option>
                  <option value="Cloudflare Pages">Cloudflare Pages</option>
                  <option value="Railway">Railway</option>
                </select>
              </div>

              <div className="flex items-center gap-2.5 py-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newMonitor.isActive}
                  onChange={(e) =>
                    setNewMonitor((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-zinc-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="isActive"
                  className="text-xs text-zinc-600 dark:text-zinc-300 font-bold select-none cursor-pointer"
                >
                  Activate checks immediately
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  Add Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Popup */}
      <Popup
        isOpen={isDeleteOpen}
        onClose={() => !isDeleting && setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Website"
        description={`Are you sure you want to delete "${monitorToDelete?.name || ""}"? This action cannot be undone and all history will be removed.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
