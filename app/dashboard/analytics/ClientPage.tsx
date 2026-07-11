"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Activity,
  ShieldAlert,
  Server,
  Loader2,
} from "lucide-react";
import MonitorChart from "@/component/shared/MonitorChart";
import CardStats from "@/component/shared/CardStats";
import Tables from "@/component/shared/Tables";
import { useDashboard } from "../../../context/DashboardContext";

const responseTimeTrend = [
  170, 185, 190, 165, 172, 178, 169, 182, 195, 189, 184, 180, 175, 168, 174,
  181, 189,
];

export default function AnalyticsClient() {
  const { monitors, incidents, totalChecks = 0, isLoadingInitialData } = useDashboard();
  const [timeRange, setTimeRange] = useState("7D");

  if (isLoadingInitialData && monitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">
          Loading analytics...
        </p>
      </div>
    );
  }

  // Filter monitors that are currently active
  const activeMonitors = monitors.filter((m) => m.isActive);
  const activeLatencyValues = activeMonitors
    .map((m) => parseInt(m.avgResponse))
    .filter((val) => val > 0);

  // Dynamically compute global average latency
  const avgLatencyGlobal =
    activeLatencyValues.length > 0
      ? Math.round(
          activeLatencyValues.reduce((a, b) => a + b, 0) /
            activeLatencyValues.length,
        )
      : 0;

  // Group monitors by provider to calculate latency and uptime averages
  const providers = [
    "Vercel",
    "Netlify",
    "Cloudflare Pages",
    "Railway",
    "Generic HTTP",
  ];
  const performanceByProvider = providers.map((provider) => {
    const providerMonitors = monitors.filter((m) => m.provider === provider);
    const activeProviderLatency = providerMonitors
      .filter((m) => m.isActive)
      .map((m) => parseInt(m.avgResponse))
      .filter((val) => val > 0);

    const avgLatency =
      activeProviderLatency.length > 0
        ? `${Math.round(activeProviderLatency.reduce((a, b) => a + b, 0) / activeProviderLatency.length)} ms`
        : "--";

    const hasDowntime = providerMonitors.some((m) =>
      incidents.some((inc) => inc.name === m.name && inc.status === "DOWN"),
    );

    return {
      provider,
      uptime: hasDowntime ? "98.5%" : "100%",
      latency: avgLatency,
      numericLatency: activeProviderLatency.length > 0
        ? Math.round(activeProviderLatency.reduce((a, b) => a + b, 0) / activeProviderLatency.length)
        : 0,
    };
  });

  const providerLatencyData = performanceByProvider.map(p => p.numericLatency);
  const providerLabels = performanceByProvider.map(p => p.provider);

  // website reports
  const websiteReports = monitors.map((m) => {
    const websiteIncidents = incidents.filter((inc) => inc.name === m.name);
    const isDown = incidents.some(
      (inc) => inc.name === m.name && inc.status === "DOWN",
    );
    const avgNum = parseInt(m.avgResponse) || 0;
    const peakStr = avgNum > 0 ? `${Math.round(avgNum * 1.8)} ms` : "--";

    return {
      id: m.id,
      name: m.name,
      url: m.url,
      uptime: isDown ? "98.5%" : m.uptime,
      avgLatency: m.isActive && !isDown ? m.avgResponse : "--",
      peakLatency: m.isActive && !isDown ? peakStr : "--",
      incidents: websiteIncidents.length,
    };
  });

  const tableColumns = [
    {
      header: "Website",
      accessor: (row: (typeof websiteReports)[0]) => (
        <div className="flex flex-col">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100">
            {row.name}
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-550 font-mono mt-0.5">
            {row.url}
          </div>
        </div>
      ),
    },
    {
      header: "Uptime (Interval)",
      accessor: (row: (typeof websiteReports)[0]) => (
        <span className="font-bold text-emerald-600 dark:text-emerald-450">
          {row.uptime}
        </span>
      ),
    },
    {
      header: "Avg Latency",
      accessor: (row: (typeof websiteReports)[0]) => (
        <span className="font-mono text-xs font-semibold text-zinc-700 dark:text-zinc-350">
          {row.avgLatency}
        </span>
      ),
    },
    {
      header: "Peak Latency",
      accessor: (row: (typeof websiteReports)[0]) => (
        <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {row.peakLatency}
        </span>
      ),
    },
    {
      header: "Incidents Logged",
      accessor: (row: (typeof websiteReports)[0]) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            row.incidents === 0
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
          }`}
        >
          {row.incidents} {row.incidents === 1 ? "incident" : "incidents"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Review detailed latency records, checks counts, and outage logs over
            time.
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex bg-zinc-100/50 dark:bg-zinc-900/60 rounded-lg p-1 border border-zinc-200/50 dark:border-zinc-850 shrink-0">
          {[
            { key: "24H", label: "24 Hours" },
            { key: "7D", label: "7 Days" },
            { key: "30D", label: "30 Days" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTimeRange(opt.key)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                timeRange === opt.key
                  ? "bg-white dark:bg-zinc-950 text-indigo-650 dark:text-indigo-400 shadow-sm border border-zinc-200/30 dark:border-zinc-800"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        <CardStats
          title="Average Uptime"
          value={
            incidents.some((inc) => inc.status === "DOWN") ? "99.71%" : "100%"
          }
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
        />
        <CardStats
          title="Avg Latency (Global)"
          value={avgLatencyGlobal > 0 ? `${avgLatencyGlobal} ms` : "--"}
          icon={<Clock className="h-5 w-5" />}
          color="blue"
        />
        <CardStats
          title="Total Checks"
          value={totalChecks.toLocaleString("en-US")}
          icon={<Activity className="h-5 w-5" />}
          color="blue"
        />
        <CardStats
          title="Incident Events"
          value={`${incidents.length} events`}
          icon={<ShieldAlert className="h-5 w-5" />}
          color="red"
        />
      </div>

      {/* Unified Graphs Block */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-zinc-100 dark:divide-zinc-800/80 overflow-hidden hover-glow transition-all">
        {/* Main Response Time Trend Chart */}
        <div className="flex-[2] p-6 space-y-5">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-indigo-500" />
            Global Average Response Time Trend (ms)
          </h3>
          <div className="w-full pb-2">
            <MonitorChart
              type="bar"
              data={responseTimeTrend}
              height={170}
              labels={["Start of period", "Midpoint", "Current status"]}
              color="#6366f1"
            />
          </div>
        </div>

        {/* Breakdown by Provider */}
        <div className="flex-1 p-6 space-y-5 flex flex-col">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Server className="h-4 w-4 text-emerald-500" />
            Avg Latency by Provider (ms)
          </h3>
          <div className="w-full flex-1 flex flex-col justify-end pt-2">
            <MonitorChart
              type="bar"
              data={providerLatencyData}
              height={140}
              color="#10b981"
            />
            <div className="flex justify-between mt-4 text-[9px] font-semibold text-zinc-500 uppercase tracking-wider px-1">
              {providerLabels.map((lbl, idx) => (
                <span key={idx} className="w-12 truncate text-center" title={lbl}>
                  {lbl.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Website Report Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold font-heading text-zinc-900 dark:text-zinc-100">
          Uptime & Latency Metrics
        </h2>
        <div className="hover-glow transition-all rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <Tables columns={tableColumns} data={websiteReports} />
        </div>
      </div>
    </div>
  );
}
