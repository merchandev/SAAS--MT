import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const staticPages = [
    { slug: 'inicio', name: 'Inicio (Home)', title: 'Transfers in Barcelona | Chauffeur & Private Transfers', metaDescription: 'Luxury private transfers and chauffeur service in Barcelona.' },
    { slug: 'booking', name: 'Servicios / Reservas', title: 'Our Services | Book a Transfer', metaDescription: 'Book your private transfer in Barcelona.' },
    { slug: 'tours-privados', name: 'Tours Privados', title: 'Private Tours in Barcelona & Catalonia', metaDescription: 'Discover our exclusive private tours.' },
    { slug: 'blog', name: 'Blog', title: 'Travel Blog | Transfers in Barcelona', metaDescription: 'Tips and news about traveling in Barcelona.' },
    { slug: 'faqs', name: 'FAQ (Preguntas Frecuentes)', title: 'Frequently Asked Questions', metaDescription: 'Find answers to common questions about our services.' },
    { slug: 'contacto', name: 'Contacto', title: 'Contact Us | Transfers in Barcelona', metaDescription: 'Get in touch for custom transfer solutions.' },
    { slug: 'politica-de-privacidad', name: 'Política de Privacidad', title: 'Privacy Policy', metaDescription: 'Read our privacy policy.' },
    { slug: 'terminos-y-condiciones', name: 'Términos y Condiciones', title: 'Terms & Conditions', metaDescription: 'Read our terms and conditions.' },
    { slug: 'aviso-legal', name: 'Aviso Legal', title: 'Legal Notice', metaDescription: 'Read our legal notice.' },
    { slug: 'cookies', name: 'Política de Cookies', title: 'Cookies Policy', metaDescription: 'Read our cookies policy.' },
  ];

  try {
    for (const page of staticPages) {
      await prisma.staticPage.upsert({
        where: { slug: page.slug },
        update: page,
        create: page,
      });
    }
    return NextResponse.json({ success: true, message: "Static pages seeded successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
