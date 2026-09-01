"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Monitor,
  AlertTriangle,
  ShieldCheck,
  Rocket,
  Activity,
  Settings,
  ArrowRight,
} from "lucide-react";

const links = [
  {
    title: "Dashboard",
    id: "overview",
    href: "/dashboard/overview",
    icon: <LayoutDashboard className="h-5 w-5" />,
    desc: "Overview & metrics",
  },
  {
    title: "Websites",
    id: "monitors",
    href: "/dashboard/monitors",
    icon: <Monitor className="h-5 w-5" />,
    desc: "Manage monitored sites",
  },
  {
    title: "Incidents",
    id: "incidents",
    href: "/dashboard/incidents",
    icon: <AlertTriangle className="h-5 w-5" />,
    desc: "Downtime history",
  },
  {
    title: "SSL Monitoring",
    id: "ssl",
    href: "/dashboard/ssl",
    icon: <ShieldCheck className="h-5 w-5" />,
    desc: "Certificate validity",
  },
  {
    title: "Deployments",
    id: "deployment",
    href: "/dashboard/deployment",
    icon: <Rocket className="h-5 w-5" />,
    desc: "Build & deploy status",
  },
  {
    title: "Analytics",
    id: "analytics",
    href: "/dashboard/analytics",
    icon: <Activity className="h-5 w-5" />,
    desc: "Reports & trends",
  },
  {
    title: "Settings",
    id: "settings",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    desc: "Integrations & theme",
  },
];

export default function MorePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold font-heading text-zinc-900 dark:text-white tracking-tight">
          All Menu
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Access every section of the dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="group flex items-center gap-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all"
          >
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                {link.title}
              </div>
              <div className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                {link.desc}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
