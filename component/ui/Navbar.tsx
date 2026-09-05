"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (id: string, href?: string) => {
    setIsOpen(false);
    if (href) {
      router.push(href);
    } else if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  const navItems = [
    { label: "Overview", id: "overview" },
    { label: "Features", id: "features" },
    { label: "FAQ", id: "faq" },
  ];

  const navItemsMobile = [
    { label: "Overview", id: "overview" },
    { label: "Features", id: "features" },
    { label: "FAQ", id: "faq" },
    { label: "Dashboard", id: "dashboard", href: "/dashboard?tab=overview" },
  ]

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl h-16 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md z-50 transition-all duration-300 shadow-xl shadow-black/20">
      <div className="max-w-7xl h-full mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/Logo.png"
            alt="OceanUptime Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="font-sans font-bold text-lg text-zinc-100 tracking-tight">
            OceanUptime
          </span>
        </Link>

        {/* Navigation Items (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6 text-xs font-semibold text-zinc-400">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className="hover:text-zinc-100 transition-colors cursor-pointer bg-transparent border-none p-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-blue-500 after:transition-all"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard?tab=overview"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white active:scale-[0.98] transition-all shadow-md shadow-blue-500/10"
          >
            Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Toggle Button (Mobile) */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-400 hover:text-white transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-18 left-0 right-0 p-4 rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-lg flex flex-col gap-4 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-5 duration-200 z-50">
          <ul className="flex flex-col gap-3 p-2 text-sm font-semibold text-zinc-400">
            {navItemsMobile.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id)}
                  className="w-full text-left py-1.5 hover:text-white transition-colors cursor-pointer bg-transparent"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        </>
      )}
    </nav>
  );
}
