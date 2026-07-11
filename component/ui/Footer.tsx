"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";

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

  return (
    <footer className="relative border-t border-zinc-800 bg-zinc-950 py-16 mt-auto overflow-hidden">
      {/* Subtle developer grid or border overlay instead of bright colorful glows */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-12">
          {/* Brand Info */}
          <div className="flex flex-col items-start gap-4 max-w-sm">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/Logo.png"
                alt="OceanUptime Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
              <span className="font-sans font-bold text-lg text-zinc-100 tracking-tight">
                OceanUptime
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              Monitoring your infrastructure with precision. Stay ahead of
              downtime with beautiful, actionable insights across all your
              hosting providers.
            </p>
          </div>

          {/* Links Wrapper */}
          <div className="flex flex-row gap-16 md:gap-24">
            {/* Product Links */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-zinc-500 text-[10px] tracking-widest uppercase">
                Product
              </h3>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <button
                    onClick={() => handleNavigation("overview")}
                    className="text-left text-sm text-zinc-400 hover:text-blue-500 transition-all cursor-pointer bg-transparent border-none p-0 hover:translate-x-1"
                  >
                    Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("features")}
                    className="text-left text-sm text-zinc-400 hover:text-blue-500 transition-all cursor-pointer bg-transparent border-none p-0 hover:translate-x-1"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation("faq")}
                    className="text-left text-sm text-zinc-400 hover:text-blue-500 transition-all cursor-pointer bg-transparent border-none p-0 hover:translate-x-1"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Dashboard Quick Links */}
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-zinc-500 text-[10px] tracking-widest uppercase">
                Dashboard
              </h3>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link
                    href="/dashboard?tab=overview"
                    className="text-sm text-zinc-400 hover:text-blue-500 transition-all hover:translate-x-1 inline-block"
                  >
                    Uptime Checks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/ssl"
                    className="text-sm text-zinc-400 hover:text-blue-500 transition-all hover:translate-x-1 inline-block"
                  >
                    SSL Expiration
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/deployment"
                    className="text-sm text-zinc-400 hover:text-blue-500 transition-all hover:translate-x-1 inline-block"
                  >
                    Deployments
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-zinc-500 text-center sm:text-left font-medium">
            &copy; {new Date().getFullYear()} OceanUptime. Built with passion &
            precision. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/RevanandaXD"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-850 transition-all hover:scale-105 hover:-translate-y-0.5"
              aria-label="GitHub Profile"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/revananda2006"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-850 transition-all hover:scale-105 hover:-translate-y-0.5"
              aria-label="Instagram Profile"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="mailto:revanandaislamipasha@gmail.com"
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-850 transition-all hover:scale-105 hover:-translate-y-0.5"
              aria-label="Email Address"
            >
              <BiLogoGmail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
