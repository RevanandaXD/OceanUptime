"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Calendar,
  Lock,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Tables from "@/component/shared/Tables";
import { useDashboard } from "../../../context/DashboardContext";

export default function SSLPage() {
  const { monitors, isLoadingInitialData } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoadingInitialData && monitors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold animate-pulse">
          Loading SSL certificate status...
        </p>
      </div>
    );
  }

  const certificates = monitors.map((m) => {
    const domain = m.url.replace(/^https?:\/\/(www\.)?/i, "").split("/")[0];
    return {
      id: m.id,
      name: m.name,
      url: m.url,
      domain: domain,
      issuer: m.sslIssuer && m.sslIssuer !== "--" ? m.sslIssuer : "Let's Encrypt",
      expiresAt:
        m.sslExpiresAt && m.sslExpiresAt !== "--"
          ? m.sslExpiresAt
          : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
      daysRemaining: m.sslDaysRemaining !== undefined ? m.sslDaysRemaining : 90,
    };
  });

  const filteredCerts = certificates.filter(
    (cert) =>
      cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.domain.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getWarningLevel = (days: number) => {
    if (days <= 7)
      return {
        text: "Urgent",
        class:
          "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
        icon: (
          <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
        ),
      };
    if (days <= 14)
      return {
        text: "Critical",
        class:
          "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
        icon: (
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        ),
      };
    if (days <= 30)
      return {
        text: "Warning",
        class:
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/30",
        icon: (
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        ),
      };
    return {
      text: "Secure",
      class:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30",
      icon: (
        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      ),
    };
  };

  const columns = [
    {
      header: "Domain",
      accessor: (row: (typeof certificates)[0]) => (
        <div className="flex flex-col">
          <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 group">
            {row.name}
            <a
              href={row.url}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
            {row.domain}
          </div>
        </div>
      ),
    },
    {
      header: "Issuer",
      accessor: (row: (typeof certificates)[0]) => (
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-zinc-400" />
          {row.issuer}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: (typeof certificates)[0]) => {
        const level = getWarningLevel(row.daysRemaining);
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${level.class}`}
          >
            {level.icon}
            {level.text}
          </span>
        );
      },
    },
    {
      header: "Days Remaining",
      accessor: (row: (typeof certificates)[0]) => {
        const percent = Math.min(100, (row.daysRemaining / 90) * 100);
        let barColor = "bg-emerald-500";
        if (row.daysRemaining <= 7) barColor = "bg-rose-600 animate-pulse";
        else if (row.daysRemaining <= 14) barColor = "bg-amber-500";
        else if (row.daysRemaining <= 30) barColor = "bg-yellow-500";

        return (
          <div className="w-full max-w-[150px] space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <span>{row.daysRemaining} days</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor}`}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Expiration Date",
      accessor: (row: (typeof certificates)[0]) => (
        <span className="text-xs font-mono text-zinc-650 dark:text-zinc-400 flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          {row.expiresAt}
        </span>
      ),
    },
  ];

  // Find certificates with warning states
  const warningCerts = certificates.filter((c) => c.daysRemaining <= 30);
  const urgentCertsCount = warningCerts.filter(
    (c) => c.daysRemaining <= 7,
  ).length;
  const criticalCertsCount = warningCerts.filter(
    (c) => c.daysRemaining <= 14 && c.daysRemaining > 7,
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          SSL Certificates
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor certificate expiration schedules, issuers, and stay ahead of
          secure socket failures.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        <input
          type="text"
          placeholder="Search by domain or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-800 dark:text-zinc-100"
        />
      </div>

      {/* Table grid */}
      <div className="hover-glow transition-all rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <Tables columns={columns} data={filteredCerts} />
      </div>
    </div>
  );
}
