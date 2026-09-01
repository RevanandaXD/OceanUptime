"use client";

import { useState } from "react";
import { useDashboard } from "@/context/dashboardStore";
import CardStats from "@/component/shared/CardStats";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCw,
  Globe,
  ShieldAlert,
  Server,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Tables from "@/component/shared/Tables";
import Dropdown from "@/component/shared/Dropdown";

export default function OverviewClient() {
  const {
    monitors,
    incidents,
    activity,
    isRefreshing,
    handleRefresh,
    isLoadingInitialData,
  } = useDashboard();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [providerFilter, setProviderFilter] = useState("ALL");

  if (isLoadingInitialData && monitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">
          Loading dashboard metrics...
        </p>
      </div>
    );
  }

  // Statistics calculation
  const totalWebsites = monitors.length;
  const onlineWebsites = monitors.filter(
    (m) =>
      m.isActive &&
      !incidents.some((inc) => inc.name === m.name && inc.status === "DOWN"),
  ).length;
  const offlineWebsites = monitors.filter(
    (m) =>
      m.isActive &&
      incidents.some((inc) => inc.name === m.name && inc.status === "DOWN"),
  ).length;

  const activeLatencyValues = monitors
    .filter((m) => m.isActive)
    .map((m) => parseInt(m.avgResponse))
    .filter((val) => val > 0);

  const avgResponseTime =
    activeLatencyValues.length > 0
      ? Math.round(
          activeLatencyValues.reduce((a, b) => a + b, 0) /
            activeLatencyValues.length,
        )
      : 0;

  const activeIncidents = incidents.filter((inc) => inc.status === "DOWN" || inc.status === "SOMETHING WRONG");

  // Filter monitors for display based on filters
  const filteredMonitors = monitors.filter((m) => {
    const activeIncident = incidents.find(
      (inc) => inc.name === m.name && (inc.status === "DOWN" || inc.status === "SOMETHING WRONG")
    );
    const isOffline = activeIncident?.status === "DOWN";
    const isSomethingWrong = activeIncident?.status === "SOMETHING WRONG";
    const isPaused = !m.isActive;

    let status = "UP";
    if (isPaused) status = "PAUSED";
    else if (isOffline) status = "DOWN";
    else if (isSomethingWrong) status = "SOMETHING WRONG";

    const matchesStatus = statusFilter === "ALL" || status === statusFilter;
    const matchesProvider =
      providerFilter === "ALL" || m.provider === providerFilter;

    return matchesStatus && matchesProvider;
  });

  const columns = [
    {
      header: "Website",
      accessor: (row: (typeof monitors)[0]) => {
        return (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {row.name}
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                {row.url}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: (row: (typeof monitors)[0]) => {
        const activeIncident = incidents.find(
          (inc) => inc.name === row.name && (inc.status === "DOWN" || inc.status === "SOMETHING WRONG")
        );
        const isOffline = activeIncident?.status === "DOWN";
        const isSomethingWrong = activeIncident?.status === "SOMETHING WRONG";
        const isPaused = !row.isActive;

        if (isPaused) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-500 dark:bg-zinc-800/40 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/30">
              PAUSED
            </span>
          );
        }

        if (isOffline) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/20">
              DOWN
            </span>
          );
        }

        if (isSomethingWrong) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20 animate-pulse whitespace-nowrap">
              DEGRADED
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/20">
            UP
          </span>
        );
      },
    },
    {
      header: "Avg Response",
      accessor: (row: (typeof monitors)[0]) => {
        const isOffline = incidents.some(
          (inc) => inc.name === row.name && inc.status === "DOWN",
        );
        const isPaused = !row.isActive;
        return (
          <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-350">
            {!isPaused && !isOffline ? row.avgResponse : "--"}
          </span>
        );
      },
    },
    {
      header: "Uptime",
      accessor: (row: (typeof monitors)[0]) => {
        const isPaused = !row.isActive;
        return (
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-450 font-mono">
            {isPaused ? "--" : row.uptime}
          </span>
        );
      },
    },
    {
      header: "Provider",
      accessor: (row: (typeof monitors)[0]) => (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-xs border border-zinc-200/50 dark:border-zinc-700/50">
          {row.provider}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time status of your websites, infrastructure latency, and SSL
            expirations.
          </p>
        </div>

        {/* Header Actions & Warning Alert */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
          {activeIncidents.length > 0 && (
            <Link
              href="/dashboard/incidents"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-red-200 dark:border-red-900/30 bg-rose-50/50 dark:bg-rose-950/10 text-rose-700 dark:text-rose-400 text-xs font-bold animate-pulse hover:scale-[1.02] transition-transform"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
              <span>
                {activeIncidents.length} Active Incident
                {activeIncidents.length > 1 ? "s" : ""}
              </span>
            </Link>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-lg text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 transition-all shadow-sm cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <RotateCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-indigo-500" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Status"}
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-6">
        <CardStats
          title="Total Websites"
          value={totalWebsites}
          icon={<Globe className="h-5 w-5" />}
          color="blue"
        />
        <CardStats
          title="Online Websites"
          value={onlineWebsites}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="green"
        />
        <CardStats
          title="Offline Websites"
          value={offlineWebsites}
          icon={<AlertTriangle className="h-5 w-5" />}
          color={offlineWebsites > 0 ? "red" : "blue"}
        />
        <CardStats
          title="Avg Latency"
          value={avgResponseTime > 0 ? `${avgResponseTime} ms` : "--"}
          icon={<Clock className="h-5 w-5" />}
          color="blue"
        />
        <CardStats
          title="Active Incidents"
          value={activeIncidents.length}
          icon={<ShieldAlert className="h-5 w-5" />}
          color={activeIncidents.length > 0 ? "red" : "blue"}
        />
      </div>

      {/* Main Bento Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 xl:gap-6 items-start">
        {/* Bento Card 1: Monitored Services with Filter Dropdowns */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover-glow flex flex-col transition-all">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <Server className="h-4.5 w-4.5 text-indigo-500" />
              <h2 className="text-sm font-bold font-heading text-zinc-900 dark:text-zinc-100">
                Monitored Services
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Dropdown
                options={[
                  { label: "All Statuses", value: "ALL" },
                  { label: "Online (UP)", value: "UP" },
                  { label: "Offline (DOWN)", value: "DOWN" },
                  { label: "Paused", value: "PAUSED" },
                ]}
                selectedValue={statusFilter}
                onChange={setStatusFilter}
              />
              <Dropdown
                options={[
                  { label: "All Providers", value: "ALL" },
                  { label: "Vercel", value: "Vercel" },
                  { label: "Netlify", value: "Netlify" },
                  { label: "Cloudflare Pages", value: "Cloudflare Pages" },
                  { label: "Railway", value: "Railway" },
                  { label: "Generic HTTP", value: "Generic HTTP" },
                ]}
                selectedValue={providerFilter}
                onChange={setProviderFilter}
              />
              <Link
                href="/dashboard/monitors"
                className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors ml-1"
              >
                Manage <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="flex-1 overflow-auto mt-4">
            <Tables
              columns={columns}
              data={filteredMonitors}
              emptyMessage="No monitored services match the selected filters."
            />
          </div>
        </div>

        {/* Bento Card 2: Recent Activity Timeline */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 hover-glow transition-all flex flex-col h-[500px]">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
            <Activity className="h-4.5 w-4.5 text-indigo-500" />
            <h2 className="text-sm font-bold font-heading text-zinc-900 dark:text-zinc-100">
              Recent Activity
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 max-h-[400px]">
            {activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center space-y-3">
                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-zinc-400" />
                </div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  No recent activities to display.
                </p>
              </div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {activity.slice(0, 5).map((act, actIdx) => (
                    <li key={actIdx}>
                      <div className="relative pb-8">
                        {actIdx !== activity.slice(0, 5).length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-zinc-200 dark:bg-zinc-800"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                act.type === "error"
                                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                                  : act.type === "warning"
                                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                                    : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                              }`}
                            >
                              {act.type === "error" ? (
                                <AlertTriangle className="h-4 w-4" />
                              ) : act.type === "warning" ? (
                                <ShieldAlert className="h-4 w-4" />
                              ) : (
                                <CheckCircle2 className="h-4 w-4" />
                              )}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-xs text-zinc-700 dark:text-zinc-350 font-medium">
                                {act.message}
                              </p>
                            </div>
                            <div className="text-right text-[10px] whitespace-nowrap text-zinc-400 dark:text-zinc-500 font-semibold font-mono">
                              {act.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
