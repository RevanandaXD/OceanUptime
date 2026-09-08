import type { Activity, Incident, Monitor } from "@/context/types";

export const DEMO_COOKIE_NAME = "oceanuptime-demo";
export const DEMO_MONITORS: Monitor[] = [
  {
    id: "demo-1",
    name: "OceanUptime App",
    url: "https://oceanuptime.vercel.app",
    provider: "Vercel",
    isActive: true,
    uptime: "99.98%",
    avgResponse: "42 ms",
    history: [38, 41, 40, 46, 39, 44, 47, 42, 40, 43],
    sslIssuer: "Google Trust Services",
    sslExpiresAt: "2027-01-12",
    sslDaysRemaining: 127,
    deploymentStatus: "READY",
    deploymentId: "dpl_9f2kLxQ4",
    commitMsg: "feat: add demo mode banner",
    commitHash: "a31f9cd",
    deployedAt: "34m ago",
    branch: "main",
  },
  {
    id: "demo-2",
    name: "API Gateway",
    url: "https://api.oceanuptime.com",
    provider: "Cloudflare Pages",
    isActive: true,
    uptime: "99.71%",
    avgResponse: "96 ms",
    history: [88, 92, 110, 124, 98, 101, 95, 120, 116, 99],
    sslIssuer: "Cloudflare Inc",
    sslExpiresAt: "2026-10-30",
    sslDaysRemaining: 53,
    deploymentStatus: "READY",
    deploymentId: "dep_cf_8x4r",
    commitMsg: "perf: add regional edge cache",
    commitHash: "e7b2an9",
    deployedAt: "2h ago",
    branch: "main",
  },
  {
    id: "demo-3",
    name: "Marketing Site",
    url: "https://oceanuptime-marketing.netlify.app",
    provider: "Netlify",
    isActive: true,
    uptime: "100.00%",
    avgResponse: "84 ms",
    history: [80, 85, 88, 82, 79, 91, 86, 84, 87, 83],
    sslIssuer: "DigiCert Global Root G2",
    sslExpiresAt: "2026-12-03",
    sslDaysRemaining: 87,
    deploymentStatus: "READY",
    deploymentId: "6352a91b",
    commitMsg: "fix: update pricing page copy",
    commitHash: "4f12bd0",
    deployedAt: "5h ago",
    branch: "main",
  },
  {
    id: "demo-4",
    name: "Docs Platform",
    url: "https://docs.oceanuptime.com",
    provider: "Vercel",
    isActive: true,
    uptime: "99.93%",
    avgResponse: "61 ms",
    history: [55, 63, 58, 66, 70, 59, 62, 57, 65, 61],
    sslIssuer: "Google Trust Services",
    sslExpiresAt: "2026-11-18",
    sslDaysRemaining: 72,
    deploymentStatus: "READY",
    deploymentId: "dpl_1mVkPz3",
    commitMsg: "docs: onboarding guide",
    commitHash: "b8d10fa",
    deployedAt: "1d ago",
    branch: "main",
  },
  {
    id: "demo-5",
    name: "Blog CDN",
    url: "https://blog.oceanuptime.com",
    provider: "Netlify",
    isActive: true,
    uptime: "99.85%",
    avgResponse: "112 ms",
    history: [105, 118, 96, 122, 108, 114, 101, 97, 133, 110],
    sslIssuer: "DigiCert Global Root G2",
    sslExpiresAt: "2026-10-02",
    sslDaysRemaining: 25,
    deploymentStatus: "READY",
    deploymentId: "91aa42c1",
    commitMsg: "feat: RSS feed revamp",
    commitHash: "c2e77bb",
    deployedAt: "8h ago",
    branch: "dev",
  },
  {
    id: "demo-6",
    name: "Edge Runtime",
    url: "https://edge.oceanuptime.com",
    provider: "Cloudflare Pages",
    isActive: true,
    uptime: "99.64%",
    avgResponse: "37 ms",
    history: [34, 36, 39, 41, 35, 37, 45, 38, 40, 36],
    sslIssuer: "Cloudflare Inc",
    sslExpiresAt: "2026-09-14",
    sslDaysRemaining: 7,
    deploymentStatus: "FAILED",
    deploymentId: "dep_cf_1zqk",
    commitMsg: "chore: bump workers version",
    commitHash: "9e04d31",
    deployedAt: "26m ago",
    branch: "main",
  },
  {
    id: "demo-7",
    name: "Worker Nodes",
    url: "https://workers.oceanuptime.com",
    provider: "Railway",
    isActive: true,
    uptime: "98.12%",
    avgResponse: "245 ms",
    history: [220, 235, 300, 512, 489, 260, 240, 310, 255, 265],
    sslIssuer: "Google Trust Services",
    sslExpiresAt: "2027-02-20",
    sslDaysRemaining: 166,
    deploymentStatus: "--",
    deploymentId: "--",
    commitMsg: "--",
    commitHash: "--",
    deployedAt: "--",
    branch: "--",
  },
  {
    id: "demo-8",
    name: "Status Page",
    url: "https://status.oceanuptime.app",
    provider: "Generic HTTP",
    isActive: true,
    uptime: "99.99%",
    avgResponse: "58 ms",
    history: [54, 57, 60, 56, 59, 62, 55, 58, 61, 57],
    sslIssuer: "Let's Encrypt",
    sslExpiresAt: "2026-09-28",
    sslDaysRemaining: 21,
  },
];

export const DEMO_INCIDENTS: Incident[] = [
  {
    id: "demo-inc-1",
    name: "Edge Runtime",
    url: "https://edge.oceanuptime.com",
    status: "SOMETHING WRONG",
    startedAt: "Sep 7, 2026, 08:45:00 AM",
    resolvedAt: "--",
    duration: "Active",
    reason: "Latency spike above 400ms threshold",
  },
  {
    id: "demo-inc-2",
    name: "Worker Nodes",
    url: "https://workers.oceanuptime.com",
    status: "DOWN",
    startedAt: "Sep 6, 2026, 09:12:00 PM",
    resolvedAt: "--",
    duration: "Active",
    reason: "Connection timeout after 10s",
  },
  {
    id: "demo-inc-3",
    name: "Blog CDN",
    url: "https://blog.oceanuptime.com",
    status: "RESOLVED",
    startedAt: "Sep 4, 2026, 11:30:00 AM",
    resolvedAt: "Sep 4, 2026, 02:20:00 PM",
    duration: "170 mins",
    reason: "DNS propagation delay after CDN config change",
  },
  {
    id: "demo-inc-4",
    name: "API Gateway",
    url: "https://api.oceanuptime.com",
    status: "RESOLVED",
    startedAt: "Sep 2, 2026, 06:10:00 PM",
    resolvedAt: "Sep 2, 2026, 06:24:00 PM",
    duration: "14 mins",
    reason: "TLS handshake failure (transient)",
  },
  {
    id: "demo-inc-5",
    name: "Worker Nodes",
    url: "https://workers.oceanuptime.com",
    status: "RESOLVED",
    startedAt: "Aug 28, 2026, 01:05:00 AM",
    resolvedAt: "Aug 28, 2026, 01:45:00 AM",
    duration: "40 mins",
    reason: "Region auto-scale event",
  },
];

export const DEMO_ACTIVITY: Activity[] = [
  {
    time: "Sep 7, 09:12 PM",
    message: "Worker Nodes is DOWN (Connection timeout after 10s)",
    type: "error",
  },
  {
    time: "Sep 7, 08:45 AM",
    message: "Edge Runtime is reporting issues (Latency spike above 400ms threshold)",
    type: "warning",
  },
  {
    time: "Sep 4, 02:20 PM",
    message: "Blog CDN incident resolved",
    type: "success",
  },
  {
    time: "Sep 2, 06:24 PM",
    message: "API Gateway incident resolved",
    type: "success",
  },
  {
    time: "Aug 28, 01:45 AM",
    message: "Worker Nodes incident resolved",
    type: "success",
  },
];

export const DEMO_CONFIGURED_PROVIDERS = ["vercel", "netlify", "cloudflare"];

export const DEMO_TOTAL_CHECKS = 128400;

export function getDemoCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${DEMO_COOKIE_NAME}=`));
  return match ? match.split("=")[1] : null;
}

export function setDemoCookie() {
  if (typeof window === "undefined") return;
  document.cookie = `${DEMO_COOKIE_NAME}=1; path=/; max-age=86400; samesite=lax`;
}

export function clearDemoCookie() {
  if (typeof window === "undefined") return;
  document.cookie = `${DEMO_COOKIE_NAME}=1; path=/; max-age=0; samesite=lax`;
}