import Link from "next/link";
import { ArrowRight, MonitorPlay } from "lucide-react";

import { ScrollReveal } from "@/component/ui/ScrollReveal";

export const CTA = () => {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 py-20 relative z-10 text-center">
      <ScrollReveal delay={0.2}>
        <div className="group relative p-10 rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden transition-all duration-300">
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-zinc-100 mb-4 relative z-10 tracking-tight leading-tight">
            Keep your services online, always.
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto relative z-10 text-xs md:text-sm leading-relaxed">
            Join OceanUptime today and get complete, real-time visibility into
            your web infrastructure in seconds.
          </p>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard?tab=overview"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-md shadow-blue-500/10"
            >
              Get Started
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
        </div>
      </ScrollReveal>
    </section>
  );
};
