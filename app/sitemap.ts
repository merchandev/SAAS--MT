import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://transfersinbarcelona.com";

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
    "/faqs"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  try {
    // Rutas dinámicas desde base de datos
    const dynamicRoutes = await prisma.routePage.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });

    const mappedDynamicRoutes = dynamicRoutes.map((route) => ({
      url: `${baseUrl}/rutas/${route.slug}`,
      lastModified: route.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...mappedDynamicRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
