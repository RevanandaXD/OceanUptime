import type { Metadata } from "next";

import Navbar from "@/component/ui/Navbar";
import Footer from "@/component/ui/Footer";
import NaturalBackground from "@/component/ui/NaturalBackground";
import { Hero } from "@/component/ui/landing/Hero";
import { Overview } from "@/component/ui/landing/Overview";
import { Integration } from "@/component/ui/landing/Integration";
import { Features } from "@/component/ui/landing/Features";
import { FAQ } from "@/component/ui/landing/FAQ";
import { CTA } from "@/component/ui/landing/CTA";

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

      <Navbar />

      <main className="grow flex flex-col items-center pt-28 overflow-hidden relative">
        <NaturalBackground />

        <Hero />
        <Overview />
        <Integration />
        <Features />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}