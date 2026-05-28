import type { MetadataRoute } from "next";

const SITE_URL = process.env.SITE_URL ?? "https://www.kc-games.com";

const routes = ["/", "/retailer.html"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
