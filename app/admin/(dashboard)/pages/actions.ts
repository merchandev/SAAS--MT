"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function seedStaticPagesAction() {
  const staticPages = [
    { slug: 'inicio', name: 'Inicio (Home)', title: 'Merchan.Dev SaaS | Chauffeur & Private Transfers', metaDescription: 'Luxury private transfers and chauffeur service in España.' },
    { slug: 'booking', name: 'Servicios / Reservas', title: 'Our Services | Book a Transfer', metaDescription: 'Book your private transfer in España.' },
    { slug: 'tours-privados', name: 'Tours Privados', title: 'Private Tours in España & Catalonia', metaDescription: 'Discover our exclusive private tours.' },
    { slug: 'blog', name: 'Blog', title: 'Travel Blog | Merchan.Dev SaaS', metaDescription: 'Tips and news about traveling in España.' },
    { slug: 'faqs', name: 'FAQ (Preguntas Frecuentes)', title: 'Frequently Asked Questions', metaDescription: 'Find answers to common questions about our services.' },
    { slug: 'contacto', name: 'Contacto', title: 'Contact Us | Merchan.Dev SaaS', metaDescription: 'Get in touch for custom transfer solutions.' },
    { slug: 'politica-de-privacidad', name: 'Política de Privacidad', title: 'Privacy Policy', metaDescription: 'Read our privacy policy.' },
    { slug: 'terminos-y-condiciones', name: 'Términos y Condiciones', title: 'Terms & Conditions', metaDescription: 'Read our terms and conditions.' },
    { slug: 'aviso-legal', name: 'Aviso Legal', title: 'Legal Notice', metaDescription: 'Read our legal notice.' },
    { slug: 'cookies', name: 'Política de Cookies', title: 'Cookies Policy', metaDescription: 'Read our cookies policy.' },
  ];

  for (const page of staticPages) {
    await prisma.staticPage.upsert({
      where: { slug: page.slug },
      update: { name: page.name }, // Only update name to avoid overriding user's SEO edits
      create: page,
    });
  }

  revalidatePath("/admin/pages");
}
