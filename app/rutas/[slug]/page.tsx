import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = await prisma.routePage.findUnique({
    where: { slug: params.slug },
  });

  if (!route) {
    return {};
  }

  return {
    title: `${route.h1Title} | MeTransfers`,
    description: route.metaDescription || `Reserva tu traslado desde ${route.originName} hasta ${route.destinationName} con precio cerrado.`,
    alternates: {
      canonical: `https://metransfers.es/rutas/${route.slug}`,
    },
  };
}

export default async function RouteDynamicPage({ params }: Props) {
  const route = await prisma.routePage.findUnique({
    where: { slug: params.slug },
  });

  if (!route) {
    notFound();
  }

  // Pre-fill booking origin and destination if possible
  const prefillOrigin = route.originName;
  const prefillDestination = route.destinationName;

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
                {route.h1Title}
              </h1>
              {route.metaDescription && (
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {route.metaDescription}
                </p>
              )}
              
              {/* Bloque de características estáticas para SEO */}
              <div className="mt-10 grid gap-4">
                <div className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                  <span translate="no" className="notranslate material-symbols-outlined text-[24px] shrink-0 text-[#D4AF37]" aria-hidden="true">check_circle</span>
                  <div>
                    <h3 className="font-semibold">Precio cerrado garantizado</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {route.basePriceCache ? `Desde ${Number(route.basePriceCache).toFixed(2)} € sin cargos ocultos.` : "Calcula tu precio al instante y viaja sin sorpresas."}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                  <span translate="no" className="notranslate material-symbols-outlined text-[24px] shrink-0 text-[#D4AF37]" aria-hidden="true">group</span>
                  <div>
                    <h3 className="font-semibold">Vehículos premium y minivans</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Flota adaptada para ejecutivos, particulares, familias y grupos grandes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                  <span translate="no" className="notranslate material-symbols-outlined text-[24px] shrink-0 text-[#D4AF37]" aria-hidden="true">work</span>
                  <div>
                    <h3 className="font-semibold">Chófer profesional</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Te esperamos en {route.originName} con un cartel a tu nombre y asistencia con el equipaje.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Contenido HTML dinámico (si existe en BD) */}
              {route.contentHtml && (
                <div 
                  className="mt-10 prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: route.contentHtml }}
                />
              )}
            </div>

            {/* Formulario de reserva con prefill opcional */}
            <div className="lg:sticky lg:top-32">
              <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/50 ring-1 ring-gray-900/5">
                <HomeBookingFormClient />
              </div>
            </div>
            
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
