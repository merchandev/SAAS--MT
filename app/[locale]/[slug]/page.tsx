import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";
import Image from "next/image";
import { getTranslatedField } from "@/lib/i18n-utils";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const routePage = await prisma.routePage.findUnique({
    where: { slug },
  });

  if (!routePage || !routePage.isActive) {
    return {};
  }

  const seoTitle = getTranslatedField(routePage, "seoTitle", locale, routePage.seoTitle) || getTranslatedField(routePage, "h1Title", locale, routePage.h1Title);
  const metaDesc = getTranslatedField(routePage, "metaDescription", locale, routePage.metaDescription);
  const seoKw = getTranslatedField(routePage, "seoKeywords", locale, routePage.seoKeywords);

  // Generar alternates dinámicos
  const languages = ["es", "en", "fr", "ca"];
  const alternates: Record<string, string> = {};
  languages.forEach((lang) => {
    alternates[lang] = `https://transfersinbarcelona.com/${lang}/${routePage.slug}`;
  });

  return {
    title: seoTitle,
    description: metaDesc,
    keywords: seoKw ? seoKw.split(',') : [],
    alternates: {
      canonical: `https://transfersinbarcelona.com/${locale}/${routePage.slug}`,
      languages: alternates,
    },
    openGraph: {
      title: seoTitle,
      description: metaDesc || "",
    }
  };
}

export default async function DynamicSEOLandingPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const routePage = await prisma.routePage.findUnique({
    where: { slug },
  });

  if (!routePage || !routePage.isActive) {
    notFound();
  }

  const h1Title = getTranslatedField(routePage, "h1Title", locale, routePage.h1Title);
  const metaDesc = getTranslatedField(routePage, "metaDescription", locale, routePage.metaDescription);
  const contentHtml = getTranslatedField(routePage, "contentHtml", locale, routePage.contentHtml);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white">
      <MarketingHeader />

      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[70svh] items-center overflow-hidden pt-32 pb-14 sm:pt-36 lg:pt-40 bg-gray-950">
          {routePage.seoImage && (
            <Image
              src={routePage.seoImage}
              alt={h1Title || routePage.slug}
              fill
              priority
              className="object-cover opacity-60"
            />
          )}
          {!routePage.seoImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
          )}
          
          <div className="relative z-10 mx-auto flex flex-col lg:grid w-full max-w-7xl lg:items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
            <div className="max-w-3xl text-white">
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {h1Title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                {metaDesc}
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium">
                 <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
                    Route: {routePage.originName} → {routePage.destinationName}
                 </div>
                 {routePage.basePriceCache && (
                   <div className="bg-[#D4AF37] text-gray-900 px-4 py-2 rounded-full font-bold">
                      From {routePage.basePriceCache.toString()} €
                   </div>
                 )}
              </div>
            </div>

            <aside className="w-full justify-self-end" aria-label="Formulario de reserva">
              {/* Ensure the booking form is pre-filled with the origin and destination if possible */}
              <HomeBookingFormClient />
            </aside>
          </div>
        </section>

        {/* Content Section */}
        {contentHtml && (
          <section className="bg-white py-16 sm:py-24">
            <div className="mx-auto max-w-4xl px-6 prose prose-lg prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
            </div>
          </section>
        )}
      </main>

      <MarketingFooter />
    </div>
  );
}
