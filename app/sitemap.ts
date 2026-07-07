/**
 * sitemap.ts – Next.js Metadata Route for /sitemap.xml
 *
 * For large sites (hundreds of pages), Next.js automatically splits
 * the sitemap into chunks of 50,000 URLs each. Each chunk is served
 * at /sitemap/[id].xml and an index is served at /sitemap.xml
 * 
 * We also export a dynamic = 'force-dynamic' so the sitemap is always
 * fresh, but we add a revalidate to cache it for 1 hour to avoid
 * DB timeouts on every Google crawl.
 */

import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Cache the sitemap for 1 hour to avoid DB timeouts on crawl
export const revalidate = 3600;

const BASE_URL = "https://transfersinbarcelona.com";

// Static pages included in every sitemap build
const STATIC_ROUTES = [
  { url: BASE_URL, priority: 1.0, changeFrequency: "daily" as const },
  { url: `${BASE_URL}/transfer-aeropuerto-barcelona`, priority: 0.9, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/traslados-privados-barcelona`, priority: 0.9, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/coche-con-chofer-barcelona`, priority: 0.8, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/traslados-puerto-barcelona`, priority: 0.8, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/tours-privados-barcelona`, priority: 0.8, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/traslados-corporativos-barcelona`, priority: 0.8, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/faqs`, priority: 0.6, changeFrequency: "monthly" as const },
  { url: `${BASE_URL}/blog`, priority: 0.7, changeFrequency: "weekly" as const },
  { url: `${BASE_URL}/contacto`, priority: 0.5, changeFrequency: "monthly" as const },
  { url: `${BASE_URL}/booking`, priority: 0.7, changeFrequency: "monthly" as const },
  { url: `${BASE_URL}/aviso-legal`, priority: 0.2, changeFrequency: "yearly" as const },
  { url: `${BASE_URL}/politica-de-privacidad`, priority: 0.2, changeFrequency: "yearly" as const },
  { url: `${BASE_URL}/terminos-y-condiciones`, priority: 0.2, changeFrequency: "yearly" as const },
  { url: `${BASE_URL}/cookies`, priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Build static entries
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: r.url,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  try {
    // Fetch only active pages – select minimal fields to keep query fast
    const [routePages, blogPosts] = await Promise.all([
      prisma.routePage.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.post.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const routeEntries: MetadataRoute.Sitemap = routePages.map((r) => ({
      url: `${BASE_URL}/rutas/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const blogEntries: MetadataRoute.Sitemap = blogPosts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...staticEntries, ...routeEntries, ...blogEntries];
  } catch (error) {
    // If DB fails, return at least the static routes so Google doesn't get an error
    console.error("[sitemap] DB error, returning static routes only:", error);
    return staticEntries;
  }
}
