import type { ProviderId } from "@/store/landing-store";

export type IntegrationResult = {
  name: string;
  status: "UP";
  ms: number;
};

export type IntegrationProvider = {
  id: ProviderId;
  name: string;
  desc: string;
  result: IntegrationResult;
};

export const integrationProviders: IntegrationProvider[] = [
  {
    id: "vercel",
    name: "Vercel Syncing",
    desc: "Automated deployment logs & status verification.",
    result: { name: "Vercel Deploy", status: "UP", ms: 42 },
  },
  {
    id: "netlify",
    name: "Netlify Webhooks",
    desc: "Instantly detect new deploys and test availability.",
    result: { name: "Netlify App", status: "UP", ms: 84 },
  },
  {
    id: "cloudflare",
    name: "Cloudflare Pages",
    desc: "Track latency and domain health edge-wide.",
    result: { name: "Cloudflare Worker", status: "UP", ms: 37 },
  },
];

export type FaqItem = {
  q: string;
  a: string;
};

export const faqs: FaqItem[] = [
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
];