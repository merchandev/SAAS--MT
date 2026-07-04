import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import postsData from "@/data/posts.json";

const routes = [
  {
    slug: "aeropuerto-barcelona-a-sitges",
    originName: "Aeropuerto de Barcelona (El Prat)",
    destinationName: "Sitges",
    h1Title: "Transfer privado del aeropuerto de Barcelona a Sitges",
    metaDescription: "Reserva tu traslado privado del aeropuerto de Barcelona a Sitges con Transfers in Barcelona. Precio cerrado, conductor profesional y vehículos para particulares, empresas y grupos.",
    basePriceCache: 85.00
  },
  {
    slug: "aeropuerto-barcelona-a-andorra",
    originName: "Aeropuerto de Barcelona (El Prat)",
    destinationName: "Andorra",
    h1Title: "Transfer privado del aeropuerto de Barcelona a Andorra",
    metaDescription: "Traslado seguro y confortable del aeropuerto de Barcelona a Andorra. Viaja en vehículos de lujo adaptados para la nieve con chófer privado.",
    basePriceCache: 320.00
  },
  {
    slug: "barcelona-a-costa-brava",
    originName: "Barcelona",
    destinationName: "Costa Brava",
    h1Title: "Traslado privado de Barcelona a la Costa Brava",
    metaDescription: "Conecta Barcelona con cualquier punto de la Costa Brava de forma rápida y cómoda. Reserva tu chófer privado con antelación.",
    basePriceCache: 150.00
  },
  {
    slug: "barcelona-a-montserrat",
    originName: "Barcelona",
    destinationName: "Montserrat",
    h1Title: "Excursión y traslado privado de Barcelona a Montserrat",
    metaDescription: "Visita la montaña mágica de Montserrat desde Barcelona con total comodidad. Servicio de coche con chófer por horas o traslado punto a punto.",
    basePriceCache: 180.00
  },
  {
    slug: "barcelona-a-la-roca-village",
    originName: "Barcelona",
    destinationName: "La Roca Village",
    h1Title: "Traslado privado de Barcelona a La Roca Village",
    metaDescription: "Disfruta de un día de compras sin preocupaciones. Traslado de ida y vuelta a La Roca Village en coche premium con espacio para tus compras.",
    basePriceCache: 120.00
  },
  {
    slug: "barcelona-a-portaventura",
    originName: "Barcelona",
    destinationName: "PortAventura",
    h1Title: "Transfer privado de Barcelona a PortAventura",
    metaDescription: "Empieza la diversión antes de llegar. Traslados familiares o para grupos desde Barcelona a PortAventura en Minivans de lujo.",
    basePriceCache: 190.00
  }
];

const staticPages = [
  { slug: "inicio", name: "Página de Inicio", title: "Transfers in Barcelona | Traslados y Tours Privados en Barcelona", metaDescription: "Reserva traslados privados, coches con chófer y tours exclusivos en Barcelona. Servicio premium, conductores profesionales y vehículos de alta gama." },
  { slug: "contacto", name: "Página de Contacto", title: "Contacto | Transfers in Barcelona", metaDescription: "Contacta con Transfers in Barcelona para traslados privados, tours, eventos corporativos y coches con chófer en Barcelona." },
  { slug: "faqs", name: "Preguntas Frecuentes", title: "Preguntas Frecuentes | Transfers in Barcelona", metaDescription: "Resuelve todas tus dudas sobre nuestros servicios de traslados privados, reservas, equipaje y políticas en Barcelona." },
  { slug: "tours-privados-barcelona", name: "Tours Privados", title: "Tours Privados con Chófer en Barcelona | Transfers in Barcelona", metaDescription: "Descubre Barcelona y sus alrededores a tu propio ritmo. Excursiones y tours privados con chófer profesional y atención personalizada." },
  { slug: "transfer-aeropuerto-barcelona", name: "Traslado Aeropuerto", title: "Transfer Aeropuerto de Barcelona | Transfers in Barcelona", metaDescription: "Traslados privados desde y hacia el Aeropuerto de Barcelona (El Prat). Conductores profesionales y vehículos premium." },
  { slug: "traslados-privados-barcelona", name: "Traslados Privados", title: "Traslados Privados en Barcelona | Transfers in Barcelona", metaDescription: "Servicio de traslados privados punto a punto en Barcelona. La máxima comodidad para tus desplazamientos por la ciudad." },
  { slug: "coche-con-chofer-barcelona", name: "Coche con Chófer", title: "Alquiler de Coche con Chófer en Barcelona | Transfers in Barcelona", metaDescription: "Servicio de alquiler de vehículo con conductor por horas o días completos en Barcelona para negocios o turismo." },
  { slug: "traslados-puerto-barcelona", name: "Traslado Puerto Cruceros", title: "Traslados Puerto de Barcelona y Cruceros | Transfers in Barcelona", metaDescription: "Transfers privados desde tu hotel o el aeropuerto hasta la terminal de cruceros del Puerto de Barcelona." },
  { slug: "traslados-corporativos-barcelona", name: "Traslados Corporativos", title: "Traslados Corporativos y Eventos en Barcelona | Transfers in Barcelona", metaDescription: "Soluciones de movilidad VIP para empresas, congresos, MWC y eventos corporativos en Barcelona." },
  { slug: "blog", name: "Blog (Índice)", title: "Blog | Transfers in Barcelona", metaDescription: "Noticias, guías y consejos sobre traslados, turismo y servicios premium en Barcelona." },
  { slug: "booking", name: "Página de Reservas", title: "Reservar Traslado | Transfers in Barcelona", metaDescription: "Reserva tu traslado privado o tour en Barcelona de forma fácil y segura. Confirmación inmediata." }
];

export async function GET() {
  try {
    let pagesCreated = 0;
    let staticPagesCreated = 0;
    let postsCreated = 0;

    // 1. Seed Pages
    for (const route of routes) {
      const exists = await prisma.routePage.findUnique({
        where: { slug: route.slug },
      });

      if (!exists) {
        await prisma.routePage.create({
          data: {
            slug: route.slug,
            originName: route.originName,
            destinationName: route.destinationName,
            h1Title: route.h1Title,
            metaDescription: route.metaDescription,
            basePriceCache: route.basePriceCache,
            isActive: true,
          },
        });
        pagesCreated++;
      }
    }

    // 1.5 Seed Static Pages
    for (const sp of staticPages) {
      const exists = await prisma.staticPage.findUnique({
        where: { slug: sp.slug }
      });

      if (!exists) {
        await prisma.staticPage.create({
          data: {
            slug: sp.slug,
            name: sp.name,
            title: sp.title,
            metaDescription: sp.metaDescription,
            isActive: true
          }
        });
        staticPagesCreated++;
      }
    }

    // 2. Seed Posts
    for (const post of postsData) {
      const exists = await prisma.post.findUnique({
        where: { slug: post.slug },
      });

      if (!exists) {
        await prisma.post.create({
          data: {
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            contentHtml: post.content,
            publishedAt: new Date(post.pubDate),
            isActive: true,
          },
        });
        postsCreated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migración completada. Páginas de rutas creadas: ${pagesCreated}, Páginas estáticas creadas: ${staticPagesCreated}, Posts del blog creados: ${postsCreated}.`
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
