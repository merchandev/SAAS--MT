const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

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

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  await client.connect();
  
  for (const route of routesToSeed) {
    const res = await client.query('SELECT id FROM "RoutePage" WHERE slug = $1', [route.slug]);
    if (res.rows.length === 0) {
      await client.query(`
        INSERT INTO "RoutePage" (
          id, slug, "originName", "destinationName", "h1Title", "seoKeywords", "isActive", "updatedAt"
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()
        )
      `, [route.slug, route.originName, route.destinationName, route.h1Title, route.seoKeywords, route.isActive]);
      console.log('Inserted:', route.slug);
    } else {
      console.log('Already exists:', route.slug);
    }
  }
  
  await client.end();
}

run().catch(console.error);
