import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const routesToSeed = [
  {
    slug: "airport-transfer-barcelona",
    originName: "Aeropuerto de Barcelona",
    destinationName: "Barcelona",
    h1Title: "Barcelona Airport Transfer",
    seoKeywords: "barcelona airport transfer, aeropuerto barcelona a centro, transfer bcn",
    isActive: true,
  },
  {
    slug: "cruise-port-transfer-barcelona",
    originName: "Puerto de Cruceros de Barcelona",
    destinationName: "Barcelona",
    h1Title: "Barcelona Cruise Port Transfer",
    seoKeywords: "barcelona cruise port transfer, puerto barcelona a aeropuerto, transfer puerto",
    isActive: true,
  },
  {
    slug: "chauffeur-service-barcelona",
    originName: "Barcelona",
    destinationName: "Barcelona (Por horas)",
    h1Title: "Chauffeur Service Barcelona",
    seoKeywords: "chauffeur service barcelona, conductor privado barcelona, coche por horas",
    isActive: true,
  },
  {
    slug: "corporate-transfers-barcelona",
    originName: "Barcelona",
    destinationName: "Eventos Corporativos",
    h1Title: "Corporate Transfers Barcelona",
    seoKeywords: "corporate transfers barcelona, traslados congresos, traslados empresas",
    isActive: true,
  },
  {
    slug: "barcelona-to-andorra-transfer",
    originName: "Barcelona",
    destinationName: "Andorra",
    h1Title: "Barcelona to Andorra Transfer",
    seoKeywords: "barcelona to andorra transfer, traslado barcelona andorra, coche andorra",
    isActive: true,
  },
  {
    slug: "barcelona-to-sitges-transfer",
    originName: "Barcelona",
    destinationName: "Sitges",
    h1Title: "Barcelona to Sitges Transfer",
    seoKeywords: "barcelona to sitges transfer, traslado barcelona sitges, taxi sitges",
    isActive: true,
  },
  {
    slug: "barcelona-to-costa-brava-transfer",
    originName: "Barcelona",
    destinationName: "Costa Brava",
    h1Title: "Barcelona to Costa Brava Transfer",
    seoKeywords: "barcelona to costa brava transfer, traslado costa brava, taxi girona costa brava",
    isActive: true,
  },
  {
    slug: "montserrat-private-tour",
    originName: "Barcelona",
    destinationName: "Montserrat",
    h1Title: "Montserrat Private Tour",
    seoKeywords: "montserrat private tour, excursión montserrat privada, tour montserrat",
    isActive: true,
  }
];

async function seedRoutes() {
  console.log("Seeding SEO routes...");
  for (const route of routesToSeed) {
    const existing = await prisma.routePage.findUnique({
      where: { slug: route.slug }
    });
    
    if (!existing) {
      await prisma.routePage.create({
        data: route
      });
      console.log(`Created route: ${route.slug}`);
    } else {
      console.log(`Route already exists: ${route.slug}`);
    }
  }
  console.log("Done seeding SEO routes!");
}

seedRoutes()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
