import type { Metadata } from "next";
import AnalyticsClient from "./ClientPage";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "View uptime analytics, response time trends, and performance insights for all monitored websites.",
  openGraph: {
    title: "Analytics | OceanUptime",
    description:
      "View uptime analytics, response time trends, and performance insights for all monitored websites.",
    type: "website",
  },
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
