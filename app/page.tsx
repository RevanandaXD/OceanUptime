import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/component/ui/Navbar";
import { ScrollReveal } from "@/component/ui/ScrollReveal";
import {
  Activity,
  Globe,
  ShieldCheck,
  Bell,
  ArrowRight,
  CheckCircle2,
  Zap,
  Terminal,
  Server,
  Cloud,
  Code2,
} from "lucide-react";
import Footer from "@/component/ui/Footer";

export const metadata: Metadata = {
  title: "OceanUptime - Unified Infrastructure Monitoring",
  description:
    "Monitor uptime, response times, SSL validity, and deployment statuses across Vercel, Netlify, Cloudflare, and more.",
  keywords: [
    "uptime monitoring",
    "website monitor",
    "SSL tracking",
    "server health",
    "deployment status",
    "developer tools",
  ],
  openGraph: {
    title: "OceanUptime - Unified Infrastructure Monitoring",
    description:
      "Monitor uptime, response times, SSL validity, and deployment statuses across Vercel, Netlify, Cloudflare, and more.",
    type: "website",
  },
};

const badge: String[] = [
  "Zero active incidents",
  "Real-time latency tracking",
  "SSL certificates valid",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OceanUptime",
  url: "https://oceanuptime.vercel.app",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Monitor uptime, response times, SSL validity, and deployment statuses across Vercel, Netlify, Cloudflare, and more.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "OceanUptime",
    url: "https://oceanuptime.vercel.app",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-400 selection:bg-blue-500/20 selection:text-blue-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes trace-right {
          0% { left: -50px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes trace-down {
          0% { top: -50px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes border-glow-pulse {
          0%, 100% { border-color: rgba(59, 130, 246, 0.2); }
          50% { border-color: rgba(59, 130, 246, 0.6); }
        }
        .connection-trace-h {
          position: absolute;
          height: 1px;
          background: linear-gradient(to right, transparent, #3b82f6, transparent);
          animation: trace-right 4s linear infinite;
        }
        .connection-trace-v {
          position: absolute;
          width: 1px;
          background: linear-gradient(to bottom, transparent, #3b82f6, transparent);
          animation: trace-down 4s linear infinite;
        }
        .animated-border-glow {
          animation: border-glow-pulse 3s ease-in-out infinite;
        }
      `,
        }}
      />

      <Navbar />

      <main className="grow flex flex-col items-center pt-28 overflow-hidden relative">
        {/* Modern grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

        {/* Glowing Orbs */}
        <div className="absolute top-[0%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

        {/* --- Hero Section --- */}
        <section className="w-full max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center relative z-10">
          <ScrollReveal className="flex flex-col items-center">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 ">
              {badge.map((badge, _) => (
                <span
                  key={_}
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
                href="#features"
                className="flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/80 text-zinc-300 active:scale-[0.98] transition-all"
              >
                Explore Features
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* --- Showcase / Overview Section --- */}
        <section
          id="overview"
          className="w-full max-w-7xl mx-auto px-6 py-12 scroll-mt-24 relative z-10"
        >
          <ScrollReveal delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-zinc-100 mb-4">
                Designed for Developer Workflows
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
                OceanUptime monitors everything and outputs clean status
                updates, making infrastructure tracking effortless.
              </p>
            </div>
          </ScrollReveal>

          <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20 px-2 mb-12">
            {[
              {
                src: "/images/DashboardPreview.png",
                alt: "Overview Dashboard",
                title: "Unified Overview",
                desc: "Monitor all your services, response times, and incidents at a single glance.",
              },
              {
                src: "/images/DashboardMonitoring.png",
                alt: "Uptime Monitoring",
                title: "Real-Time Uptime Monitoring",
                desc: "Track response latency history and availability checks across all services.",
              },
              {
                src: "/images/DashboardSSL.png",
                alt: "SSL Monitoring",
                title: "SSL Certificate Tracking",
                desc: "Automated tracking of issuer validity, expiration dates, and remaining days.",
              },
              {
                src: "/images/DashboardAnalytic.png",
                alt: "Analytics & Deployments",
                title: "Analytics & Deployments Integrations",
                desc: "Connect Vercel, Netlify, and Cloudflare to view live deployment statuses.",
              },
            ].map((img, i) => (
              <ScrollReveal key={i} delay={0.1 * i} className="h-full">
                <div className="group relative h-full rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900/20 hover:border-zinc-700/80 transition-all duration-300">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700"></div>
                    </div>
                    <div className="mx-auto text-[10px] font-mono text-zinc-500 tracking-wider">
                      {img.alt.toLowerCase().replace(/\s+/g, "-")}
                      .oceanuptime.com
                    </div>
                  </div>
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-950">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover object-top-left transition-transform duration-500 group-hover:scale-[1.01]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-5 border-t border-zinc-800 bg-zinc-900/40">
                    <h4 className="font-semibold text-zinc-200 text-sm mb-1.5">
                      {img.title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {img.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* --- NEW SECTION: Integrations & Developer Hub --- */}
        <section
          id="integrations"
          className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900 relative z-10"
        >
          <ScrollReveal delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-zinc-100 mb-4">
                Integrate Anywhere In Your Stack
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
                Connect your cloud providers in seconds and receive raw
                structured JSON statuses or triggers directly in your build
                pipelines.
              </p>
            </div>
          </ScrollReveal>

          {/* Grid Layout connecting APIs to a central Monitor Terminal */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Left Column: Cloud Providers (Col Span 5) */}
            <div className="lg:col-span-5 space-y-4 relative">
              {[
                {
                  name: "Vercel Integrations",
                  desc: "Sync deployment logs & verify status checks.",
                  tag: "API Syncing",
                },
                {
                  name: "Netlify Webhooks",
                  desc: "Instantly detect new deploys and test availability.",
                  tag: "Automatic",
                },
                {
                  name: "Cloudflare Pages",
                  desc: "Track latency and domain health edge-wide.",
                  tag: "Edge Checks",
                },
              ].map((provider, idx) => (
                <ScrollReveal key={idx} delay={idx * 0.1}>
                  <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-900/40 hover:border-blue-500/30 transition-all relative overflow-hidden group">
                    {/* Simulated tracer line connecting to the right */}
                    <div
                      className="hidden lg:block connection-trace-h w-50"
                      style={{
                        right: "-200px",
                        top: "50%",
                        animationDelay: `${idx * 1.3}s`,
                      }}
                    />

                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-zinc-200 font-semibold text-sm">
                        {provider.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-900/50 font-mono">
                        {provider.tag}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{provider.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Middle Connection Point (Col Span 2 - Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center relative h-full">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center animated-border-glow">
                <Code2 className="h-5 w-5 text-blue-500" />
              </div>
              <div className="h-20 w-px bg-zinc-800/80 relative">
                <div
                  className="connection-trace-v h-10"
                  style={{ animationDelay: "1s" }}
                />
              </div>
            </div>

            {/* Right Column: Code Terminal Log (Col Span 5) */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={0.2}>
                <div className="rounded-xl border border-zinc-800 bg-[#09090b] shadow-2xl overflow-hidden font-mono text-xs">
                  {/* Window Bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                      <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                      <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium select-none flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-blue-500" />
                      uptime-api.sh
                    </span>
                  </div>

                  {/* Code body */}
                  <div className="p-5 space-y-3 leading-relaxed text-zinc-400 overflow-x-auto">
                    <div className="flex gap-2">
                      <span className="text-zinc-600 select-none">$</span>
                      <span className="text-zinc-200">
                        curl -X GET
                        "https://oceanuptime.com/api/cron?secret=YOUR_CRON_SECRET"
                      </span>
                    </div>
                    <div className="text-zinc-500 font-mono text-[11px]">
                      {"{"}
                      <div className="pl-4">
                        <span className="text-blue-400">"success"</span>:{" "}
                        <span className="text-zinc-200">true</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-blue-400">"message"</span>:{" "}
                        <span className="text-zinc-200">
                          "Monitoring engine executed successfully!"
                        </span>
                        ,
                      </div>
                      <div className="pl-4">
                        <span className="text-blue-400">"total_checked"</span>:{" "}
                        <span className="text-zinc-200">3</span>,
                      </div>
                      <div className="pl-4">
                        <span className="text-blue-400">"results"</span>: [
                      </div>
                      <div className="pl-8">
                        {"{ "} <span className="text-blue-400">"name"</span>:{" "}
                        <span className="text-zinc-300">"Vercel Deploy"</span>,{" "}
                        <span className="text-blue-400">"status"</span>:{" "}
                        <span className="text-zinc-200">"UP"</span>,{" "}
                        <span className="text-blue-400">"responseTime"</span>:{" "}
                        <span className="text-zinc-300">"42ms"</span> {"}"},
                      </div>
                      <div className="pl-8">
                        {"{ "} <span className="text-blue-400">"name"</span>:{" "}
                        <span className="text-zinc-300">"Netlify App"</span>,{" "}
                        <span className="text-blue-400">"status"</span>:{" "}
                        <span className="text-zinc-200">"UP"</span>,{" "}
                        <span className="text-blue-400">"responseTime"</span>:{" "}
                        <span className="text-zinc-300">"84ms"</span> {"}"},
                      </div>
                      <div className="pl-8">
                        {"{ "} <span className="text-blue-400">"name"</span>:{" "}
                        <span className="text-zinc-300">"Cloudflare Page"</span>
                        , <span className="text-blue-400">"status"</span>:{" "}
                        <span className="text-zinc-200">"UP"</span>,{" "}
                        <span className="text-blue-400">"responseTime"</span>:{" "}
                        <span className="text-zinc-300">"31ms"</span> {"}"}
                      </div>
                      <div className="pl-4">]</div>
                      {"}"}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-zinc-900 text-[10px] text-zinc-500">
                      <Server className="h-3.5 w-3.5 text-zinc-600" />
                      <span>
                        Response: 200 OK • All background checks completed
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
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
                Simple, fast, and light infrastructure checks designed to run
                with developer simplicity.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
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
            ].map((feature, idx) => (
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

        {/* --- FAQ Section --- */}
        <section
          id="faq"
          className="w-full max-w-4xl mx-auto px-6 py-20 scroll-mt-24 relative z-10 border-t border-zinc-900"
        >
          <ScrollReveal delay={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-zinc-100 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
                Have questions about OceanUptime? We have answers.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {[
              {
                q: "What is OceanUptime?",
                a: "OceanUptime is a unified monitoring platform that tracks website uptime, response times, SSL certificate expirations, and deployment statuses across multiple providers (like Vercel, Netlify, Cloudflare Pages) in one beautiful dashboard.",
              },
              {
                q: "How often do the monitoring checks run?",
                a: "All active checks run every 5 minutes automatically, recording response latency and HTTP status codes, timing out after 10 seconds to detect downtime incidents accurately.",
              },
              {
                q: "How does SSL monitoring work?",
                a: "Our monitoring engine checks your SSL expiration dates and certificate details. It triggers critical alert levels: warnings at 30 days remaining, critical at 14 days, and urgent alerts at 7 days before expiry.",
              },
              {
                q: "How will I be notified when my website goes down?",
                a: "OceanUptime supports native browser web push notifications (available on Android and desktop browsers) to alert you instantly the second a website goes offline or recovers.",
              },
            ].map((faq, idx) => (
              <ScrollReveal key={idx} delay={0.1 * idx}>
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 hover:border-zinc-700/60 transition-all">
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2 flex items-start gap-3">
                    <span className="text-blue-500 font-mono">Q:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="w-full max-w-4xl mx-auto px-6 py-20 relative z-10 text-center">
          <ScrollReveal delay={0.2}>
            <div className="group relative p-10 rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden transition-all duration-300">
              {/* Content */}
              <h2 className="text-2xl md:text-3xl font-sans font-bold text-zinc-100 mb-4 relative z-10 tracking-tight leading-tight">
                Keep your services online, always.
              </h2>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto relative z-10 text-xs md:text-sm leading-relaxed">
                Join OceanUptime today and get complete, real-time visibility
                into your web infrastructure in seconds.
              </p>

              <div className="relative z-10">
                <Link
                  href="/dashboard?tab=overview"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors shadow-md shadow-blue-500/10"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
