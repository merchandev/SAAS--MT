import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://metransfers.es";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/customer/", "/driver/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
