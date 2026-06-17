import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

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
  title: "OceanUptime",
  description:
    "OceanUptime is a multi-provider website monitoring dashboard that allows users to monitor uptime, response time, deployment status, SSL validity, and infrastructure health across multiple hosting providers such as Vercel, Netlify, Cloudflare Pages, Railway, and GitHub Pages.",
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
                  var theme = localStorage.getItem("theme-mode") || "dark";
                  var root = document.documentElement;
                  root.setAttribute("data-theme", theme);
                  if (theme === "light") {
                    root.classList.remove("dark");
                    root.classList.add("light");
                  } else {
                    root.classList.add("dark");
                    root.classList.remove("light");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
