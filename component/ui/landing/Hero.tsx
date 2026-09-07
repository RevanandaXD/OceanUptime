import Link from "next/link";
import { ArrowRight, MonitorPlay } from "lucide-react";

import { ScrollReveal } from "@/component/ui/ScrollReveal";

const badges: string[] = [
  "Zero active incidents",
  "Real-time latency tracking",
  "SSL certificates valid",
];

export const Hero = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center relative z-10">
      <ScrollReveal className="flex flex-col items-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2.5">
          {badges.map((badge, idx) => (
            <span
              key={idx}
              className="hidden md:block lg:block px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300 mb-6 backdrop-blur-xs"
            >
              {badge}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-6xl font-sans font-bold text-zinc-50 tracking-tight leading-[1.1] mb-6 max-w-3xl">
          Developer-First <br className="hidden sm:block" />
          Infrastructure Monitoring
        </h1>

        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mb-8 leading-relaxed">
          A unified, developer-friendly dashboard to track website uptime,
          latency performance, SSL certificate validity, and live build
          deployments across Vercel, Netlify, and Cloudflare.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard?tab=overview"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white active:scale-[0.98] transition-all shadow-md shadow-blue-500/10"
          >
            Go to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard?demo=1"
            className="flex gap-2 items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300 active:scale-[0.98] transition-all"
          >
            <MonitorPlay className="h-4 w-4" />
            Live Demo
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
};