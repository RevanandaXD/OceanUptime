"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { ArrowUp, Activity, ShieldCheck, Zap, Globe } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (id: string) => {
    if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-zinc-800/80 bg-zinc-950 pt-20 pb-12 mt-auto overflow-hidden">
      {/* Background Subtle Gradient Ambient Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(59,130,246,0.06),transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Info (Col 5) */}
          <div className="lg:col-span-5 flex flex-col items-start gap-5">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/Logo.png"
                alt="OceanUptime Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-sans font-bold text-xl text-zinc-100 tracking-tight">
                Ocean
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Uptime
                </span>
              </span>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-md font-normal">
              Unified multi-provider infrastructure monitoring. Track website
              availability, response latency, SSL certificate validity, and
              automated deployments in real time.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                Product
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <button
                    onClick={() => handleNavigation("overview")}
                    className="text-left text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-2 group"
                  >
                    <Globe className="h-3.5 w-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("features")}
                    className="text-left text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-2 group"
                  >
                    <Zap className="h-3.5 w-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("faq")}
                    className="text-left text-sm text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-2 group"
                  >
                    <Activity className="h-3.5 w-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Dashboard Quick Links */}
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                Dashboard
              </h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="/dashboard/overview"
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2 group"
                  >
                    <Activity className="h-3.5 w-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                    Uptime Checks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/ssl"
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2 group"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                    SSL Expiration
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/deployment"
                    className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2 group"
                  >
                    <Zap className="h-3.5 w-3.5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                    Deployments
                  </Link>
                </li>
              </ul>
            </div>

            {/* Developers & Stack */}
            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <h4 className="font-mono text-xs font-semibold text-zinc-400 tracking-wider uppercase">
                Integrations
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Vercel Cron
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Netlify Deploy
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                  Cloudflare Pages
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider & Bottom Panel */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-zinc-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} OceanUptime. Built with passion &
            precision. All rights reserved.
          </p>

          {/* Social Icons & Back to Top */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/RevanandaXD"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 transition-all hover:scale-105"
              aria-label="GitHub Profile"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/revananda2006"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 transition-all hover:scale-105"
              aria-label="Instagram Profile"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="mailto:revanandaislamipasha@gmail.com"
              className="p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-700 transition-all hover:scale-105"
              aria-label="Email Address"
            >
              <BiLogoGmail className="h-4 w-4" />
            </a>

            <div className="w-px h-6 bg-zinc-800 mx-1" />

            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 transition-all hover:scale-105 flex items-center gap-1.5 text-xs font-semibold"
              aria-label="Back to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
