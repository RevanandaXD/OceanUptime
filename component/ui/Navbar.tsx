"use client";

import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";

export default function Navbar() {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 backdrop-blur-md bg-[#1a1b26]/75 border-b border-[#2f3549]/50 z-50 transition-all duration-300">
      <div className="max-w-7xl h-full mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="font-heading font-extrabold text-2xl text-[#77a2fc] tracking-tight">
            OCEAN<span className="text-[#fc808b]">UPTIME</span>
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#a9b1d6]">
            <li>
              <button
                onClick={() => handleScroll("overview")}
                className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll("features")}
                className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => handleScroll("faq")}
                className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                FAQ
              </button>
            </li>
          </ul>

          <Link
            href="/dashboard?tab=overview"
            className="flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-xs font-bold bg-[#7aa2f7] text-[#16161e] hover:bg-[#7aa2f7]/90 active:scale-[0.98] transition-all shadow-md shadow-[#7aa2f7]/10"
          >
            Dashboard
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
