"use client";

import { CheckCircle2, Terminal } from "lucide-react";

import { ScrollReveal } from "@/component/ui/ScrollReveal";
import { useLandingStore } from "@/store/landing-store";
import { integrationProviders, type IntegrationProvider } from "./landing-data";

function TerminalWindow({ provider }: { provider: IntegrationProvider }) {
  const { result } = provider;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#09090b]/90 shadow-2xl overflow-hidden font-mono text-xs relative backdrop-blur-md">
      {/* Window Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex gap-1.5 opacity-80">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
        <span className="mx-auto text-[10px] text-zinc-500 font-medium select-none flex items-center gap-1.5 opacity-60">
          <Terminal className="h-3 w-3" />
          api/cron.sh
        </span>
      </div>

      {/* Code body */}
      <div className="p-6 space-y-4 leading-relaxed text-zinc-400 overflow-x-auto">
        <div className="flex gap-3 text-zinc-300">
          <span className="text-zinc-600 select-none">~</span>
          <span>curl -X GET "https://api.oceanuptime.com/cron"</span>
        </div>

        <div className="text-zinc-500 text-[11px] font-mono leading-loose">
          <span className="text-zinc-400">{"{"}</span>
          <div className="pl-4">
            <span className="text-blue-400">"success"</span>:{" "}
            <span className="text-zinc-200">true</span>,
          </div>
          <div className="pl-4">
            <span className="text-blue-400">"message"</span>:{" "}
            <span className="text-zinc-300">"Monitoring engine executed"</span>,
          </div>
          <div className="pl-4">
            <span className="text-blue-400">"results"</span>:{" "}
            <span className="text-zinc-400">[</span>
          </div>
          <div className="pl-8 text-zinc-400" key={provider.id}>
            {"{ "} <span className="text-blue-400">"name"</span>:{" "}
            <span className="text-zinc-300">"{result.name}"</span>,{" "}
            <span className="text-blue-400">"status"</span>:{" "}
            <span className="text-emerald-400">"{result.status}"</span>,{" "}
            <span className="text-blue-400">"ms"</span>:{" "}
            <span className="text-zinc-300">{result.ms}</span> {" }"}
          </div>
          <div className="pl-4 text-zinc-400">]</div>
          <span className="text-zinc-400">{"}"}</span>
        </div>

        {/* Status Footer */}
        <div className="flex items-center gap-2 pt-4 mt-2 border-t border-zinc-900/50 text-[10px] text-zinc-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>200 OK • Connection secure</span>
        </div>
      </div>
    </div>
  );
}

export const Integration = () => {
  const activeProviderId = useLandingStore((state) => state.activeProviderId);
  const setActiveProviderId = useLandingStore(
    (state) => state.setActiveProviderId,
  );

  const activeProvider =
    integrationProviders.find((provider) => provider.id === activeProviderId) ??
    integrationProviders[0];

  return (
    <section
      id="integrations"
      className="w-full max-w-7xl mx-auto px-6 py-32 border-t border-zinc-900 relative z-10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-10 relative">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-zinc-100 tracking-tight mb-4">
              Integrate anywhere in your stack
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
              Connect your cloud providers in seconds and receive raw structured
              JSON statuses or triggers directly in your build pipelines.
            </p>
          </ScrollReveal>

          <div className="space-y-6">
            {integrationProviders.map((provider, idx) => {
              const isActive = provider.id === activeProviderId;

              return (
                <ScrollReveal key={provider.id} delay={idx * 0.1}>
                  <button
                    type="button"
                    onClick={() => setActiveProviderId(provider.id)}
                    aria-pressed={isActive}
                    className={`w-full flex items-start gap-4 text-left rounded-xl p-4 transition-all border ${
                      isActive
                        ? "bg-blue-500/10 border-blue-500/20"
                        : "border-transparent hover:bg-zinc-900/40 hover:border-zinc-800"
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-blue-500/20 border border-blue-500/40"
                          : "bg-blue-500/10 border border-blue-500/20"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-zinc-200 font-semibold text-sm mb-1">
                        {provider.name}
                      </h4>
                      <p className="text-xs text-zinc-500">{provider.desc}</p>
                    </div>
                  </button>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Right Content: Terminal Window */}
        <ScrollReveal delay={0.2} className="relative">
          {/* Decorative background glow */}
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          <TerminalWindow provider={activeProvider} />
        </ScrollReveal>
      </div>
    </section>
  );
};
