import { ScrollReveal } from "@/component/ui/ScrollReveal";
import {
  Activity,
  Globe,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Zap,
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      title: "Global Uptime Monitoring",
      desc: "Monitor your websites from multiple regions to ensure global availability with 5-minute automated checks.",
      icon: Globe,
    },
    {
      title: "SSL Tracking & Expiry",
      desc: "Never let a certificate expire with automated SSL validity monitoring and multi-stage alerts.",
      icon: ShieldCheck,
    },
    {
      title: "Web Push Alerts",
      desc: "Get native, real-time alerts on your Android device and laptop directly through browser push notifications.",
      icon: Bell,
    },
    {
      title: "Incident History Tracking",
      desc: "Keep a transparent, detailed record of all downtime incidents, outage durations, and recovery logs.",
      icon: Activity,
    },
    {
      title: "Deployment Syncing",
      desc: "Sync and monitor build deployments from Vercel, Netlify, and Cloudflare Pages automatically.",
      icon: CheckCircle2,
    },
    {
      title: "Latency Analytics",
      desc: "Measure response times and view interactive charts to keep your application blazing fast.",
      icon: Zap,
    },
  ];

  return (
    <section
      id="features"
      className="w-full max-w-7xl mx-auto px-6 py-20 scroll-mt-24 relative z-10 border-t border-zinc-900"
    >
      <ScrollReveal delay={0.1}>
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-zinc-100 mb-4">
            Everything you need to stay online
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
            Simple, fast, and light infrastructure checks designed to run with
            developer simplicity.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <ScrollReveal key={idx} delay={0.1 * idx} className="h-full">
            <div className="h-full p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700/80 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                <feature.icon className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};
