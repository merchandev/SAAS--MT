import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://transfersinbarcelona.com";

  // Rutas estáticas principales
  const staticRoutes = [
    "",
    "/transfer-aeropuerto-barcelona",
    "/traslados-privados-barcelona",
    "/coche-con-chofer-barcelona",
    "/traslados-puerto-barcelona",
    "/tours-privados-barcelona",
    "/traslados-corporativos-barcelona",
    "/contacto",
    "/booking",
    "/faqs",
    "/blog"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // Rutas dinámicas desde base de datos
    const [routePages, staticPages, blogPosts] = await Promise.all([
      prisma.routePage.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.staticPage.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.post.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const mappedDynamicRoutes = routePages.map((route) => ({
      url: `${baseUrl}/rutas/${route.slug}`,
      lastModified: route.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    const mappedStaticPages = staticPages
      .filter((page) => page.slug !== "inicio") // Evitar duplicar la home
      .map((page) => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));

    const mappedBlogPosts = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [
      ...staticRoutes,
      ...mappedDynamicRoutes,
      ...mappedStaticPages,
      ...mappedBlogPosts,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
