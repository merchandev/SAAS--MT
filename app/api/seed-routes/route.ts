import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const routes = [
    {
      slug: 'barcelona-airport-transfer',
      originName: 'Barcelona Airport (BCN)',
      destinationName: 'Barcelona City',
      h1Title: 'Private Barcelona Airport Transfer',
      metaDescription: 'Book your private transfer from Barcelona Airport with fixed price, professional chauffeur, flight monitoring and secure online payment.',
      seoTitle: 'Barcelona Airport Transfer | Private Chauffeur & Fixed Price',
      seoKeywords: 'barcelona airport transfer, private transfer barcelona airport, bcn airport taxi',
      basePriceCache: 45.00
    },
    {
      slug: 'barcelona-cruise-port-transfer',
      originName: 'Barcelona Cruise Port',
      destinationName: 'Barcelona Airport / City',
      h1Title: 'Barcelona Cruise Port Transfers',
      metaDescription: 'Reliable private transfers from and to Barcelona Cruise Port. Fixed prices, punctual service, and ample space for your cruise luggage.',
      seoTitle: 'Barcelona Cruise Port Transfer | Private Chauffeur',
      seoKeywords: 'barcelona cruise port transfer, private transfer from barcelona cruise port',
      basePriceCache: 55.00
    },
    {
      slug: 'barcelona-to-andorra-private-transfer',
      originName: 'Barcelona',
      destinationName: 'Andorra',
      h1Title: 'Barcelona to Andorra Private Transfer',
      metaDescription: 'Premium private transfer from Barcelona or BCN Airport to Andorra. Enjoy a comfortable ride with ski luggage space and professional chauffeurs.',
      seoTitle: 'Barcelona to Andorra Private Transfer | Fixed Price',
      seoKeywords: 'barcelona to andorra private transfer, taxi barcelona andorra',
      basePriceCache: 290.00
    },
    {
      slug: 'barcelona-to-sitges-private-transfer',
      originName: 'Barcelona',
      destinationName: 'Sitges',
      h1Title: 'Barcelona to Sitges Private Transfer',
      metaDescription: 'Book your direct private transfer from Barcelona to Sitges. Fixed rates, comfortable premium vehicles, and professional drivers.',
      seoTitle: 'Barcelona to Sitges Private Transfer | Chauffeur Service',
      seoKeywords: 'barcelona to sitges private transfer, taxi barcelona sitges',
      basePriceCache: 85.00
    }
  ];

  try {
    for (const route of routes) {
      await prisma.routePage.upsert({
        where: { slug: route.slug },
        update: route,
        create: route,
      });
    }
    return NextResponse.json({ success: true, message: "Routes seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
