import Image from "next/image";

import { ScrollReveal } from "@/component/ui/ScrollReveal";

type Preview = {
  src: string;
  alt: string;
  title: string;
  desc: string;
  hoverBorder: string;
};

const previews: Preview[] = [
  {
    src: "/images/DashboardPreview.png",
    alt: "Overview Dashboard",
    title: "Unified Overview",
    desc: "Monitor all your services, response times, and incidents at a single glance.",
    hoverBorder: "group-hover:border-blue-500/20",
  },
  {
    src: "/images/DashboardMonitoring.png",
    alt: "Uptime Monitoring",
    title: "Real-Time Uptime Monitoring",
    desc: "Track response latency history and availability checks across all services.",
    hoverBorder: "group-hover:border-emerald-500/20",
  },
  {
    src: "/images/DashboardSSL.png",
    alt: "SSL Monitoring",
    title: "SSL Certificate Tracking",
    desc: "Automated tracking of issuer validity, expiration dates, and remaining days.",
    hoverBorder: "group-hover:border-purple-500/20",
  },
  {
    src: "/images/DashboardAnalytic.png",
    alt: "Analytics & Deployments",
    title: "Analytics & Deployments Integrations",
    desc: "Connect Vercel, Netlify, and Cloudflare to view live deployment statuses.",
    hoverBorder: "group-hover:border-amber-500/20",
  },
];

function PreviewCard({
  preview,
  index,
}: {
  preview: Preview;
  index: number;
}) {
  const url = `${preview.alt.toLowerCase().replace(/\s+/g, "-")}.oceanuptime.com`;

  return (
    <ScrollReveal className="h-full" delay={0.1 * index}>
      <div
        className={`group relative h-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/10 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-black/50 ${preview.hoverBorder}`}
      >
        {/* MacOS-style Window Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border-b border-zinc-800 relative z-10">
          <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-red-500/80 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-yellow-500/80 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-green-500/80 transition-colors" />
          </div>
          <div className="mx-auto flex items-center gap-2 px-3 py-1 bg-zinc-950/40 rounded border border-zinc-800/30">
            <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
              {url}
            </span>
          </div>
        </div>

        {/* Static Minimalist Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 border-b border-zinc-800 z-10">
          <Image
            src={preview.src}
            alt={preview.alt}
            fill
            className="object-cover object-top-left transition-opacity duration-300 opacity-90 group-hover:opacity-100 relative z-10"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Clean Content Area */}
        <div className="p-6 bg-[#09090b]/80 relative z-10 h-full">
          <h4 className="font-semibold text-zinc-200 text-sm mb-1.5 group-hover:text-white transition-colors">
            {preview.title}
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
            {preview.desc}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

export const Overview = () => {
  return (
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
            OceanUptime monitors everything and outputs clean status updates,
            making infrastructure tracking effortless.
          </p>
        </div>
      </ScrollReveal>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20 px-2 mb-12">
        {previews.map((preview, idx) => (
          <PreviewCard key={preview.src} preview={preview} index={idx} />
        ))}
      </div>
    </section>
  );
};