import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://oceanuptime.vercel.app";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/auth`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  return [...staticPages];
}
