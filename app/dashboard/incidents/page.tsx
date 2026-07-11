import type { Metadata } from "next";
import IncidentsClient from "./ClientPage";

export const metadata: Metadata = {
  title: "Incidents",
  description:
    "View and manage downtime incidents, track resolution status, and review incident history across all monitored websites.",
  openGraph: {
    title: "Incidents | OceanUptime",
    description:
      "View and manage downtime incidents, track resolution status, and review incident history across all monitored websites.",
    type: "website",
  },
};

export default function IncidentsPage() {
  return <IncidentsClient />;
}
