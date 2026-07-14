import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";
import { CheckCircle2, Users, Briefcase } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { getTranslatedField } from "@/lib/i18n-utils";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  
  const route = await prisma.routePage.findUnique({
    where: { slug },
  });

  if (!route || !route.isActive) {
    return {};
  }

  const seoTitle = getTranslatedField(route, "seoTitle", locale, route.seoTitle) || getTranslatedField(route, "h1Title", locale, route.h1Title) || route.slug;
  const metaDesc = getTranslatedField(route, "metaDescription", locale, route.metaDescription) || `Reserva tu traslado desde ${route.originName} hasta ${route.destinationName} con precio cerrado.`;
  const seoKw = getTranslatedField(route, "seoKeywords", locale, route.seoKeywords);

  // Generar alternates dinámicos
  const languages = ["es", "en", "fr", "ca"];
  const alternates: Record<string, string> = {};
  languages.forEach((lang) => {
    alternates[lang] = `https://transfersinbarcelona.com/${lang}/rutas/${route.slug}`;
  });

  return {
    title: `${seoTitle} | Transfers in Barcelona`,
    description: metaDesc,
    alternates: {
      canonical: `https://transfersinbarcelona.com/${locale}/rutas/${route.slug}`,
      languages: alternates,
    },
    keywords: seoKw || undefined,
    openGraph: {
      title: seoTitle,
      description: metaDesc,
      images: route.seoImage ? [route.seoImage] : [],
    },
  };
}

export default async function RouteDynamicPage({ params }: Props) {
  const { slug, locale } = await params;
  
  const route = await prisma.routePage.findUnique({
    where: { slug },
  });

  // 404 if not found OR if it's a draft/scheduled page
  if (!route || !route.isActive) {
    notFound();
  }

  const title = getTranslatedField(route, "h1Title", locale, route.h1Title) || getTranslatedField(route, "seoTitle", locale, route.seoTitle) || route.slug;
  const origin = route.originName || "Barcelona";
  const destination = route.destinationName || "";
  const metaDesc = getTranslatedField(route, "metaDescription", locale, route.metaDescription);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white" style={{ "--brand-accent": "#D4AF37" } as any}>
      <MarketingHeader />
      
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            
            {/* Contenido SEO */}
            <div>
              <p className="mb-3 text-sm font-semibold uppercase text-[#D4AF37]">
                Ruta Destacada
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {title}
              </h1>
              {metaDesc && (
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {metaDesc}
                </p>
              )}
              
              {/* Bloque de características estáticas para SEO */}
              <div className="mt-10 grid gap-4">
                <div className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">Precio cerrado garantizado</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {route.basePriceCache ? `Desde ${Number(route.basePriceCache).toFixed(2)} € sin cargos ocultos.` : "Calcula tu precio al instante y viaja sin sorpresas."}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                  <Users className="w-6 h-6 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">Vehículos premium y minivans</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Flota adaptada para ejecutivos, particulares, familias y grupos grandes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                  <Briefcase className="w-6 h-6 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">Chófer profesional</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Te esperamos en {origin} con un cartel a tu nombre y asistencia con el equipaje.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contenido HTML dinámico (si existe en BD) */}
              {route.contentHtml && (
                <div 
                  className="mt-10 prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(route.contentHtml) }}
                />
              )}
            </div>

            {/* Formulario de reserva con prefill opcional */}
            <div className="lg:sticky lg:top-32">
              <HomeBookingFormClient variant="clean" />
            </div>
            
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}


