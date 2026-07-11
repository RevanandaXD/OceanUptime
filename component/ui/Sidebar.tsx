"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Monitor,
  LayoutDashboard,
  ShieldCheck,
  Rocket,
  AlertTriangle,
  Activity,
  Settings,
} from "lucide-react";
import { UserProfile } from "../shared/UserProfile";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const activeTab = pathname.split("/").pop() || "overview";

  const links = [
    {
      title: "Dashboard",
      id: "overview",
      href: "/dashboard/overview",
      icon: <LayoutDashboard className="h-4.5 w-4.5" />,
    },
    {
      title: "Websites",
      id: "monitors",
      href: "/dashboard/monitors",
      icon: <Monitor className="h-4.5 w-4.5" />,
    },
    {
      title: "Incidents",
      id: "incidents",
      href: "/dashboard/incidents",
      icon: <AlertTriangle className="h-4.5 w-4.5" />,
    },
    {
      title: "SSL Monitoring",
      id: "ssl",
      href: "/dashboard/ssl",
      icon: <ShieldCheck className="h-4.5 w-4.5" />,
    },
    {
      title: "Deployments",
      id: "deployment",
      href: "/dashboard/deployment",
      icon: <Rocket className="h-4.5 w-4.5" />,
    },
    {
      title: "Analytics",
      id: "analytics",
      href: "/dashboard/analytics",
      icon: <Activity className="h-4.5 w-4.5" />,
    },
    {
      title: "Settings",
      id: "settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-4.5 w-4.5" />,
    },
  ];

  return (
    <aside className="group fixed left-0 top-0 z-40 flex min-h-screen w-[60px] flex-col overflow-hidden border-r border-zinc-200 bg-white transition-[width] duration-300 ease-in-out hover:w-64 dark:border-zinc-200/10 dark:bg-zinc-900 select-none shrink-0">
      {/* Brand Header */}
      <div className="flex h-16 w-full shrink-0 items-center border-b border-zinc-200 dark:border-zinc-800">
        {/* pl-[14px] + w-8(32px) = 46. 14px on left, 14px on right of the 60px container -> perfect center! */}
        <Link
          href="/dashboard/overview"
          className="flex items-center pl-[14px] outline-none group/logo w-full"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <Image 
              src="/Logo.png"
              width={32}
              height={32}
              alt="OceanUptime Logo"
              className="w-8 h-8 object-contain"
            />
          </div>
          <span className="ml-3 font-sans font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight opacity-0 -translate-x-2 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 whitespace-nowrap">
            OceanUptime
          </span>
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6">
        <div className="mb-3 pl-[20px] text-xs font-semibold tracking-wider text-zinc-500 opacity-0 -translate-x-2 transition-all duration-75 ease-in group-hover:translate-x-0 group-hover:opacity-100 group-hover:duration-300 group-hover:ease-out group-hover:delay-100">
          MENU
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`mx-2 flex items-center rounded-md py-2 pl-3 outline-none transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50"
                }`}
              >
                <div className="flex w-5 shrink-0 items-center justify-center">
                  {link.icon}
                </div>
                <span className="ml-3 whitespace-nowrap text-sm font-medium opacity-0 -translate-x-2 transition-all duration-75 ease-in group-hover:translate-x-0 group-hover:opacity-100 group-hover:duration-300 group-hover:ease-out group-hover:delay-150">
                  {link.title}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Profile */}
      <div className="shrink-0 border-t border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/20 overflow-hidden w-full">
        <UserProfile />
      </div>
    </aside>
  );
}
