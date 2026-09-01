import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import ThemeManager from "@/component/ui/ThemeManager";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oceanuptime.vercel.app"),
  title: {
    default: "OceanUptime - Unified Infrastructure Monitoring",
    template: "%s | OceanUptime",
  },
  description:
    "Monitor uptime, response times, SSL validity, and deployment statuses across Vercel, Netlify, Cloudflare, and more. A modern multi-provider monitoring dashboard.",
  keywords: [
    "uptime monitoring",
    "website monitor",
    "SSL tracking",
    "server health",
    "deployment status",
    "developer tools",
  ],
  authors: [{ name: "OceanUptime" }],
  creator: "OceanUptime",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oceanuptime.vercel.app",
    title: "OceanUptime - Unified Infrastructure Monitoring",
    description:
      "Monitor uptime, response times, SSL validity, and deployment statuses across Vercel, Netlify, Cloudflare, and more.",
    siteName: "OceanUptime",
    images: [
      {
        url: "/images/Preview.png",
        width: 1200,
        height: 630,
        alt: "OceanUptime Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OceanUptime - Unified Infrastructure Monitoring",
    description:
      "Monitor uptime, response times, SSL validity, and deployment statuses across Vercel, Netlify, Cloudflare, and more.",
    images: ["/images/Preview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "zjGmLeBkBw4Kv7unopVYX6_gu2Bfez1qvgSIVBWASgY",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var path = window.location.pathname;
                  var root = document.documentElement;
                  if (path.startsWith("/dashboard")) {
                    var theme = localStorage.getItem("theme-mode") || "dark";
                    root.setAttribute("data-theme", theme);
                    if (theme === "light") {
                      root.classList.remove("dark");
                      root.classList.add("light");
                    } else {
                      root.classList.add("dark");
                      root.classList.remove("light");
                    }
                  } else {
                    root.setAttribute("data-theme", "dark");
                    root.classList.add("dark");
                    root.classList.remove("light");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeManager />
        {children}
      </body>
    </html>
  );
}
