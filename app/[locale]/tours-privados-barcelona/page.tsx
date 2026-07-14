import { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";

import { prisma } from "@/lib/prisma";

import { getTranslatedField } from "@/lib/i18n-utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const seo = await prisma.staticPage.findUnique({ where: { slug: "tours-privados-barcelona" } });
  
  const title = getTranslatedField(seo, "title", locale, seo?.title) || "Tours Privados con Chófer en Barcelona | Transfers in Barcelona";
  const metaDesc = getTranslatedField(seo, "metaDescription", locale, seo?.metaDescription) || "Descubre Barcelona y sus alrededores a tu propio ritmo. Excursiones y tours privados con chófer profesional y atención personalizada.";
  const seoKw = getTranslatedField(seo, "seoKeywords", locale, seo?.seoKeywords);

  // Generar alternates dinámicos
  const languages = ["es", "en", "fr", "ca"];
  const alternates: Record<string, string> = {};
  languages.forEach((lang) => {
    alternates[lang] = `https://transfersinbarcelona.com/${lang}/tours-privados-barcelona`;
  });

  return {
    title,
    description: metaDesc,
    keywords: seoKw || undefined,
    alternates: {
      canonical: `https://transfersinbarcelona.com/${locale}/tours-privados-barcelona`,
      languages: alternates,
    },
  };
}

export default function ToursPrivadosPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white" style={{ "--brand-accent": "#D4AF37" } as any}>
      <MarketingHeader />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Tours Privados en Barcelona</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Diseña tu propia ruta o déjate aconsejar por nuestros conductores expertos. Visita los monumentos más icónicos de Barcelona o realiza excursiones a lugares emblemáticos como Montserrat o la Costa Brava en un vehículo de alta gama.
              </p>
            </div>
            <div>
              <HomeBookingFormClient />
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
