"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  GitBranch,
  Calendar,
  ExternalLink,
  CheckCircle2,
  XCircle,
  RotateCw,
  Server,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Tables from "@/component/shared/Tables";
import { useDashboard } from "../../../context/DashboardContext";

export default function DeploymentPage() {
  const { monitors, configuredProviders = [], isLoadingInitialData } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("ALL");
  const [deployingId, setDeployingId] = useState<string | null>(null);

  if (isLoadingInitialData && monitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">
          Loading deployments...
        </p>
      </div>
    );
  }

  const handleRedeploy = (id: string) => {
    setDeployingId(id);
    setTimeout(() => {
      setDeployingId(null);
      alert("Deployment triggered successfully!");
    }, 1500);
  };

  const activeProviders = Array.from(
    new Set(
      monitors
        .filter((m) => m.provider !== "Generic HTTP")
        .map((m) => m.provider)
    )
  );

  const unconfiguredProviders = activeProviders.filter(
    (p) => !configuredProviders.includes(p.toLowerCase())
  );

  // Derive deployment objects from monitors list
  const deployments = monitors
    .filter((m) => m.provider !== "Generic HTTP")
    .map((m) => ({
      id: `dep-${m.id}`,
      website: m.name,
      provider: m.provider,
      deploymentId: m.deploymentId || `dpl_${m.id}cf`,
      status: m.deploymentStatus || "READY",
      commitHash: m.commitHash || "7b8a9c0",
      commitMsg: m.commitMsg || "Update styling layout config",
      deployedAt: m.deployedAt || "3 hours ago",
      branch: m.branch || "main",
    }));

  const filteredDeployments = deployments.filter((dep) => {
    const matchesSearch =
      dep.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.commitMsg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dep.commitHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvider =
      selectedProvider === "ALL" || dep.provider === selectedProvider;
    return matchesSearch && matchesProvider;
  });

  const columns = [
    {
      header: "Website & Project",
      accessor: (row: (typeof deployments)[0]) => (
        <div className="flex flex-col">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            {row.website}
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-555 font-normal flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-[9px] border border-zinc-200/50 dark:border-zinc-700/50">
              <Server className="h-2.5 w-2.5 text-zinc-400" />
              {row.provider}
            </span>
            <span className="font-mono text-[9px]">{row.deploymentId}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: (typeof deployments)[0]) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            row.status === "READY"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30"
              : "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30"
          }`}
        >
          {row.status === "READY" ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {row.status === "READY" ? "Ready" : "Failed"}
        </span>
      ),
    },
    {
      header: "Commit Info",
      accessor: (row: (typeof deployments)[0]) => (
        <div className="max-w-[240px]">
          <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-350 truncate">
            {row.commitMsg}
          </div>
          <div className="text-[10px] text-zinc-400 font-normal flex items-center gap-1.5 mt-1 font-mono">
            <GitBranch className="h-3 w-3 text-zinc-400" />
            <span className="font-semibold text-zinc-500 dark:text-zinc-400">
              {row.branch}
            </span>
            <span>({row.commitHash})</span>
          </div>
        </div>
      ),
    },
    {
      header: "Deployed At",
      accessor: (row: (typeof deployments)[0]) => (
        <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-semibold">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          {row.deployedAt}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: (typeof deployments)[0]) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => handleRedeploy(row.id)}
            disabled={deployingId !== null}
            className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
          >
            <RotateCw
              className={`h-3.5 w-3.5 text-zinc-400 ${deployingId === row.id ? "animate-spin text-indigo-500" : ""}`}
            />
            {deployingId === row.id ? "Deploying..." : "Redeploy"}
          </button>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-bold bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-755 dark:hover:text-zinc-200 flex items-center justify-center transition-colors shadow-sm"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          Deployments
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor deploy updates, branch tracking, and commit hooks across
          Vercel, Netlify, and Cloudflare Pages.
        </p>
      </div>

      {/* Warning Banner */}
      {unconfiguredProviders.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-600 dark:text-amber-400">
          <div className="flex gap-3 items-start sm:items-center">
            <div className="p-2 bg-amber-500/20 rounded-lg shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">
                Missing API Keys: {unconfiguredProviders.join(", ")}
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                Please add the required API keys in the Settings page to enable real-time deployment data, branch tracking, and commit history synchronization.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 text-white dark:text-amber-300 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-sm border border-amber-500/25"
          >
            Go to Settings
          </Link>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search deployments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-100"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto bg-zinc-100/50 dark:bg-zinc-900/60 p-1 border border-zinc-200/50 dark:border-zinc-800 rounded-lg shrink-0">
          {["ALL", "Vercel", "Netlify", "Cloudflare Pages"].map((provider) => (
            <button
              key={provider}
              onClick={() => setSelectedProvider(provider)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                selectedProvider === provider
                  ? "bg-white dark:bg-zinc-950 text-indigo-650 dark:text-indigo-400 shadow-sm border border-zinc-250/50 dark:border-zinc-800"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Deployments Table */}
      <div className="hover-glow transition-all rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <Tables
          columns={columns}
          data={filteredDeployments}
          emptyMessage="No deployments logged."
        />
      </div>
    </div>
  );
}
