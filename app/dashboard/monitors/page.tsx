import type { Metadata } from "next";
import MonitorsClient from "./ClientPage";

export const metadata: Metadata = {
  title: "Monitors",
  description:
    "Manage and configure website monitors, add new URLs, toggle monitoring checks, and view response history charts.",
  openGraph: {
    title: "Website Monitors | OceanUptime",
    description:
      "Manage and configure website monitors, add new URLs, toggle monitoring checks, and view response history charts.",
    type: "website",
  },
};

export default function MonitorsPage() {
  return <MonitorsClient />;
}
