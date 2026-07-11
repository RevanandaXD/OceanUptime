import type { Metadata } from "next";
import DeploymentClient from "./ClientPage";

export const metadata: Metadata = {
  title: "Deployments",
  description:
    "Track deployment statuses, commit history, and build information from Vercel, Netlify, and Cloudflare Pages.",
  openGraph: {
    title: "Deployments | OceanUptime",
    description:
      "Track deployment statuses, commit history, and build information from Vercel, Netlify, and Cloudflare Pages.",
    type: "website",
  },
};

export default function DeploymentPage() {
  return <DeploymentClient />;
}
