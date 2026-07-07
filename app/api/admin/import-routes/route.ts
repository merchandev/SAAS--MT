import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import xml2js from "xml2js";
import { authService } from "@/modules/auth/auth.service";

export async function POST(request: Request) {
  try {
    // 1. Validar autenticación
    const session = await authService.getSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // 2. Obtener archivo XML
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo." }, { status: 400 });
    }

    const xmlContent = await file.text();

    // 3. Parsear XML
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlContent);

    // El XML puede tener diferentes estructuras dependiendo de cómo se generó.
    // Asumiremos que tiene una lista de <page> dentro de algún root, o directamente un array
    let pages = [];
    if (result.pages && result.pages.page) {
      pages = Array.isArray(result.pages.page) ? result.pages.page : [result.pages.page];
    } else if (result.root && result.root.page) {
      pages = Array.isArray(result.root.page) ? result.root.page : [result.root.page];
    } else if (result.dataset && result.dataset.record) { // Some generic XML tools
      pages = Array.isArray(result.dataset.record) ? result.dataset.record : [result.dataset.record];
    } else if (Array.isArray(result.page)) {
      pages = result.page;
    } else {
      // Intentar encontrar cualquier array
      for (const key of Object.keys(result)) {
        if (result[key] && Array.isArray(result[key].page)) {
          pages = result[key].page;
          break;
        }
      }
    }

    if (!pages || pages.length === 0) {
      return NextResponse.json({ error: "No se encontraron páginas válidas en el XML." }, { status: 400 });
    }

    let importedCount = 0;

    // 4. Procesar y guardar en BD
    for (const page of pages) {
      // Extraer campos (asegurarnos de mapear según la estructura del XML de transfersinbarcelona)
      const slug = page.slug || page.url?.split('/').pop() || "";
      if (!slug) continue;

      const originName = page.origin || page.originName || "Origin";
      const destinationName = page.destination || page.destinationName || "Destination";
      
      const h1Title = page.h1Title || page.h1 || page.title || `${originName} to ${destinationName} Transfer`;
      const seoTitle = page.seoTitle || page.meta_title || h1Title;
      const metaDescription = page.metaDescription || page.meta_description || page.description || "";
      const contentHtml = page.contentHtml || page.content_html || page.content || "";
      const seoKeywords = page.seoKeywords || page.keywords || "";
      const basePriceCache = parseFloat(page.basePriceCache || page.price || "0") || null;
      const seoImage = page.seoImage || page.image || null;

      // Usar upsert para no duplicar si ya existe
      await prisma.routePage.upsert({
        where: { slug: slug.toLowerCase() },
        update: {
          originName,
          destinationName,
          h1Title,
          seoTitle,
          metaDescription,
          seoKeywords,
          contentHtml,
          basePriceCache,
          seoImage,
          // No actualizamos isActive para no pisar borradores/publicados si ya existen
        },
        create: {
          slug: slug.toLowerCase(),
          originName,
          destinationName,
          h1Title,
          seoTitle,
          metaDescription,
          seoKeywords,
          contentHtml,
          basePriceCache,
          seoImage,
          isActive: false, // Por defecto en borrador
        },
      });

      importedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Se importaron/actualizaron ${importedCount} rutas correctamente.`,
      importedCount
    });

  } catch (error) {
    console.error("Error importing XML:", error);
    return NextResponse.json({ error: "Ocurrió un error al procesar el archivo XML." }, { status: 500 });
  }
}
