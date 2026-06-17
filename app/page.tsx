import Link from "next/link";
import Image from "next/image";
import Navbar from "@/component/ui/Navbar";
import {
  Activity,
  Globe,
  ShieldCheck,
  Bell,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1b26] text-[#a9b1d6] selection:bg-[#7aa2f7]/30">
      <Navbar />

      <main className="grow flex flex-col items-center pt-30 overflow-hidden relative">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-[400px] bg-[#7aa2f7]/20 blur-[120px] rounded-full pointer-events-none" />

        {/* --- Hero Section --- */}
        <section className="w-full max-w-7xl mx-auto px-6 pt-20 pb-24 flex flex-col items-center text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white tracking-tight leading-tight mb-6">
            Monitor your infrastructure <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#7aa2f7] to-[#bd93f9]">
              with confidence.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#a9b1d6] max-w-2xl mb-10 font-medium">
            A unified dashboard for tracking uptime, response times, SSL
            certificates, and deployments across all your providers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard?tab=overview"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-[#7aa2f7] text-[#16161e] hover:bg-[#7aa2f7]/90 active:scale-[0.98] transition-all shadow-lg shadow-[#7aa2f7]/20"
            >
              Start Monitoring
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white glass-panel hover:bg-white/5 active:scale-[0.98] transition-all"
            >
              View Features
            </Link>
          </div>
        </section>

        {/* Overview */}
        <section
          id="overview"
          className="w-full max-w-7xl mx-auto px-6 pt-25 relative z-10"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              See It in Action
            </h2>
            <p className="text-[#a9b1d6] max-w-xl mx-auto font-medium">
              Dapatkan gambaran nyata bagaimana dashboard interaktif OceanUptime
              melacak performa infrastruktur Anda.
            </p>
          </div>
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20 px-4 mb-12">
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
              <div
                key={i}
                className="group relative rounded-2xl overflow-hidden border border-[#2f3549]/50 bg-[#1f2335] hover:border-[#7aa2f7]/40 hover:shadow-2xl hover:shadow-[#7aa2f7]/5 transition-all duration-300"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#16161e] border-b border-[#2f3549]/50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="mx-auto text-[10px] font-semibold text-[#a9b1d6]/40 tracking-wider">
                    {img.alt.toLowerCase().replace(/\s+/g, "-")}.oceanuptime.com
                  </div>
                </div>
                <div className="relative aspect-video w-full overflow-hidden bg-[#1a1b26]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-contain object-tc center transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-4 border-t border-[#2f3549]/30 bg-[#1a1b26]/80 backdrop-blur-xs">
                  <h4 className="font-bold text-white text-base mb-1">
                    {img.title}
                  </h4>
                  <p className="text-xs text-[#a9b1d6]/80">{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- Features Section --- */}
        <section
          id="features"
          className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-[#2f3549]/50"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Everything you need to stay online
            </h2>
            <p className="text-[#a9b1d6] max-w-xl mx-auto">
              Powerful monitoring tools packaged in a beautiful, easy-to-use
              interface.
            </p>
          </div>

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
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-[#2f3549]/50 hover:border-[#7aa2f7]/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1f2335] flex items-center justify-center mb-4 border border-[#2f3549] group-hover:bg-[#7aa2f7]/10 group-hover:border-[#7aa2f7]/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-[#7aa2f7]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#a9b1d6] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- FAQ Section --- */}
        <section
          id="faq"
          className="w-full max-w-4xl mx-auto px-6 py-24 relative z-10 border-t border-[#2f3549]/50"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-[#a9b1d6] max-w-xl mx-auto">
              Have questions about OceanUptime? We have answers.
            </p>
          </div>

          <div className="space-y-6">
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
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-[#2f3549]/50 hover:border-[#7aa2f7]/30 transition-all"
              >
                <h3 className="text-lg font-bold text-white mb-2 flex items-start gap-3">
                  <span className="text-[#7aa2f7]">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm text-[#a9b1d6] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="w-full max-w-4xl mx-auto px-6 py-24 relative z-10 text-center">
          <div className="group relative p-12 rounded-3xl border border-[#7aa2f7]/20 bg-[#1e2230]/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-[#7aa2f7]/40 hover:shadow-2xl hover:shadow-[#7aa2f7]/5">
            {/* Background Decorative Grid */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[radial-gradient(#a9b1d6_1px,transparent_1px)] [background-size:20px_20px]" />

            <div className="absolute -top-24 -left-24 w-56 h-56 bg-[#7aa2f7]/15 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-125" />
            <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-[#bd93f9]/15 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-125" />

            {/* Content */}
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 relative z-10 tracking-tight leading-tight">
              Keep your services <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#7aa2f7] to-[#bd93f9]">
                online, always.
              </span>
            </h2>
            <p className="text-[#a9b1d6] mb-8 max-w-md mx-auto relative z-10 text-sm md:text-base font-medium">
              Join OceanUptime today and get complete, real-time visibility into
              your web infrastructure in seconds.
            </p>

            <div className="relative z-10">
              <Link
                href="/dashboard?tab=overview"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-[#7aa2f7] text-[#16161e]"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2f3549]/50 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-[#7aa2f7]" />
            <span className="font-heading font-bold text-sm text-white">
              OceanUptime
            </span>
          </div>
          <p className="text-xs text-[#a9b1d6]">
            &copy; {new Date().getFullYear()} OceanUptime. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
