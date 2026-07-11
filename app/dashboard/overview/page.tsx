import type { Metadata } from "next";
import OverviewClient from "./ClientPage";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "Real-time dashboard overview of your monitored websites, uptime status, response latency, and active incidents.",
  openGraph: {
    title: "Dashboard Overview | OceanUptime",
    description:
      "Real-time dashboard overview of your monitored websites, uptime status, response latency, and active incidents.",
    type: "website",
  },
};

export default function OverviewPage() {
  return <OverviewClient />;
}
