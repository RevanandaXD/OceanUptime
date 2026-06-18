import Link from "next/link";
import { FaGithub, FaInstagram } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/10 backdrop-blur-lg py-12 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="font-heading font-extrabold text-xl text-[#77a2fc] tracking-tight">
                OCEAN<span className="text-[#fc808b]">UPTIME</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 max-w-xs leading-relaxed">
              Monitoring your infrastructure with precision. Stay ahead of
              downtime with beautiful, actionable insights.
            </p>
          </div>

          {/* Monitoring */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-white/90 text-sm">Monitoring</h3>
            <Link
              href="/dashboard"
              className="text-sm text-white/50 hover:text-blue-400 transition-colors"
            >
              Uptime Checks
            </Link>
            <Link
              href="/dashboard/ss"
              className="text-sm text-white/50 hover:text-blue-400 transition-colors"
            >
              SSL Expiration
            </Link>
            <Link
              href="/dashboard/deployment"
              className="text-sm text-white/50 hover:text-blue-400 transition-colors"
            >
              Deployments
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} OceanUptime. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/RevanandaXD"
              className="text-white/40 hover:text-white transition-colors"
            >
              <FaGithub className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com/revananda2006"
              className="text-white/40 hover:text-[#1DA1F2] transition-colors"
            >
              <FaInstagram className="h-4 w-4" />
            </a>
            <a
              href="mailto:revanandaislamipasha@gmail.com"
              className="text-white/40 hover:text-white transition-colors"
            >
              <BiLogoGmail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
