import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";
import Image from "next/image";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const routePage = await prisma.routePage.findUnique({
    where: { slug },
  });

  if (!routePage || !routePage.isActive) {
    return {};
  }

  return {
    title: routePage.seoTitle || routePage.h1Title,
    description: routePage.metaDescription,
    keywords: routePage.seoKeywords ? routePage.seoKeywords.split(',') : [],
    openGraph: {
      title: routePage.seoTitle || routePage.h1Title,
      description: routePage.metaDescription || "",
    }
  };
}

export default async function DynamicSEOLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const routePage = await prisma.routePage.findUnique({
    where: { slug },
  });

  if (!routePage || !routePage.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white">
      <MarketingHeader />

      <main>
        {/* Hero Section */}
        <section className="relative flex min-h-[70svh] items-center overflow-hidden pt-32 pb-14 sm:pt-36 lg:pt-40 bg-gray-950">
          {routePage.seoImage && (
            <Image
              src={routePage.seoImage}
              alt={routePage.h1Title}
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
                {routePage.h1Title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                {routePage.metaDescription}
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
        {routePage.contentHtml && (
          <section className="bg-white py-16 sm:py-24">
            <div className="mx-auto max-w-4xl px-6 prose prose-lg prose-gray max-w-none">
              <div dangerouslySetInnerHTML={{ __html: routePage.contentHtml }} />
            </div>
          </section>
        )}
      </main>

      <MarketingFooter />
    </div>
  );
}
