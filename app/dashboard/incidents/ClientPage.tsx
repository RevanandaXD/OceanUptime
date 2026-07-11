"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Calendar,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Tables from "@/component/shared/Tables";
import { useDashboard } from "../../../context/DashboardContext";
import { Incident } from "@/context/types";

export default function IncidentsClient() {
  const { incidents, isLoadingInitialData, monitors } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  if (isLoadingInitialData && monitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">
          Loading incident history...
        </p>
      </div>
    );
  }
  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" ||
      (filterStatus === "ACTIVE" && (inc.status === "DOWN" || inc.status === "SOMETHING WRONG")) ||
      (filterStatus === "RESOLVED" && inc.status === "RESOLVED");
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "Website & Reason",
      accessor: (row: Incident) => (
        <div className="flex flex-col">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 group">
            {row.name}
            <a
              href={row.url}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors"
            >
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
          <div className="text-[10px] text-rose-650 dark:text-rose-400 font-bold mt-0.5 tracking-wide uppercase">
            {row.reason}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: Incident) => {
        const isActive = row.status === "DOWN" || row.status === "SOMETHING WRONG";
        const isDegraded = row.status === "SOMETHING WRONG";

        if (isActive) {
          return (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isDegraded
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 animate-pulse"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 pulse-red border border-rose-100 dark:border-rose-900/30"
              }`}
            >
              <AlertTriangle className="h-3 w-3" />
              {isDegraded ? "Something Wrong" : "Active"}
            </span>
          );
        }

        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
            <CheckCircle2 className="h-3 w-3" />
            Resolved
          </span>
        );
      },
    },
    {
      header: "Started At",
      accessor: (row: Incident) => (
        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-mono">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          {row.startedAt}
        </span>
      ),
    },
    {
      header: "Resolved At",
      accessor: (row: Incident) => (
        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-mono">
          <CheckCircle2 className="h-3.5 w-3.5 text-zinc-400" />
          {row.resolvedAt}
        </span>
      ),
    },
    {
      header: "Duration",
      accessor: (row: Incident) => (
        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-400" />
          {row.duration}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          Incidents
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Review historical outages, downtime timelines, and performance
          restoration details.
        </p>
      </div>

      {/* Filter Options Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search incidents by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto bg-zinc-100/50 dark:bg-zinc-900/60 p-1 border border-zinc-200/50 dark:border-zinc-800 rounded-lg shrink-0">
          {["ALL", "ACTIVE", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                filterStatus === status
                  ? "bg-white dark:bg-zinc-950 text-indigo-650 dark:text-indigo-400 shadow-sm border border-zinc-250/50 dark:border-zinc-800"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tables Log */}
      <div className="hover-glow transition-all rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <Tables
          columns={columns}
          data={filteredIncidents}
          emptyMessage="No incident history found."
        />
      </div>
    </div>
  );
}
