import type { Metadata } from "next";
import SSLClient from "./ClientPage";

export const metadata: Metadata = {
  title: "SSL Certificates",
  description:
    "Monitor SSL certificate expiration dates, issuers, and remaining validity across all your tracked domains.",
  openGraph: {
    title: "SSL Certificates | OceanUptime",
    description:
      "Monitor SSL certificate expiration dates, issuers, and remaining validity across all your tracked domains.",
    type: "website",
  },
};

export default function SSLPage() {
  return <SSLClient />;
}
