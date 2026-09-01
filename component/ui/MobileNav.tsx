"use client";

import { useState, useEffect } from "react";
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

const links = [
  {
    title: "Dashboard",
    id: "overview",
    href: "/dashboard/overview",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Sites",
    id: "monitors",
    href: "/dashboard/monitors",
    icon: <Monitor className="h-5 w-5" />,
  },
  {
    title: "Incidents",
    id: "incidents",
    href: "/dashboard/incidents",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: "SSL",
    id: "ssl",
    href: "/dashboard/ssl",
    icon: <ShieldCheck className="h-5 w-5" />,
  },
  {
    title: "More",
    id: "more",
    href: "/dashboard/more",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const segments = mounted ? pathname.split("/").filter(Boolean) : [];
  const activeTab = segments[1] || "overview";

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-40 flex items-stretch border-t border-zinc-200 bg-white/95 backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-900/95 select-none">
      {links.map((link) => {
        const isActive =
          mounted &&
          (link.id === "more"
            ? !["overview", "monitors", "incidents", "ssl"].includes(activeTab)
            : activeTab === link.id);
        return (
          <Link
            key={link.id}
            href={link.href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold transition-colors ${
              isActive
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            {link.icon}
            <span>{link.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
