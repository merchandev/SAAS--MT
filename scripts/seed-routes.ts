import { prisma } from "../lib/prisma";

const routes = [
  {
    slug: "aeropuerto-barcelona-a-sitges",
    originName: "Aeropuerto de Barcelona (El Prat)",
    destinationName: "Sitges",
    h1Title: "Transfer privado del aeropuerto de Barcelona a Sitges",
    metaDescription: "Reserva tu traslado privado del aeropuerto de Barcelona a Sitges con MeTransfers. Precio cerrado, conductor profesional y vehículos para particulares, empresas y grupos.",
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

async function main() {
  console.log("Seeding routes...");
  for (const route of routes) {
    const existing = await prisma.routePage.findUnique({
      where: { slug: route.slug }
    });
    if (!existing) {
      await prisma.routePage.create({
        data: {
          ...route,
          isActive: true
        }
      });
      console.log(`Created route: ${route.slug}`);
    } else {
      await prisma.routePage.update({
        where: { slug: route.slug },
        data: route
      });
      console.log(`Updated route: ${route.slug}`);
    }
  }
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
