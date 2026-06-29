import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Newspaper } from "lucide-react";
import MarketingCta from "@/components/marketing/MarketingCta";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageHero from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Blog de traslados privados en Barcelona | MeTransfers",
  description:
    "Consejos sobre traslados privados, aeropuerto de Barcelona, tours, eventos corporativos y coches con chófer.",
  alternates: {
    canonical: "/blog",
  },
};

import postsData from "@/data/posts.json";

// Ordenar por fecha descendente
const sortedPosts = [...postsData].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
// Mostrar los últimos 15
const posts = sortedPosts.slice(0, 15);

const guides = [
  "Traslados desde hoteles, puertos y estaciones",
  "Servicios por horas para agendas corporativas",
  "Vehículos recomendados según pasajeros y equipaje",
  "Consejos para eventos, bodas y grupos",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PageHero
        eyebrow="Blog"
        title="Guías de movilidad premium"
        description="Información práctica para planificar traslados privados, tours, servicios de aeropuerto y coches con chófer en Barcelona."
      />

      <main>
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#D4AF37]">Últimos artículos</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Consejos antes de viajar</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-gray-600">
                Contenido pensado para viajeros particulares, empresas, grupos y clientes premium que buscan una
                experiencia de transporte clara, puntual y sin sorpresas.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.slug} className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition">
                  <div className="relative aspect-[16/10] bg-gray-100 flex items-center justify-center">
                     {/* Imagen genérica ya que el XML no tiene imágenes destacadas fáciles de extraer */}
                    <div className="text-[#D4AF37] opacity-20">
                      <Newspaper className="h-20 w-20" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.1em] text-[#D4AF37]">
                      <span>{post.category}</span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-tight line-clamp-3">{post.title}</h3>
                    <p className="mt-4 text-base leading-7 text-gray-600 line-clamp-3">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#D4AF37] hover:text-gray-900 transition">
                      Leer artículo
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <Newspaper className="h-12 w-12 text-[#D4AF37]" aria-hidden="true" />
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Temas que encontrarás en el blog</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                Publicamos guías sencillas para elegir mejor tu transporte privado y preparar desplazamientos
                importantes con más seguridad.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {guides.map((guide) => (
                <div key={guide} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <CalendarDays className="h-6 w-6 text-[#D4AF37]" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-black">{guide}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <MarketingCta
          title="¿Necesitas organizar un traslado ahora?"
          description="Reserva online o contacta con nuestro equipo para servicios especiales, grupos, tours y movilidad corporativa."
        />
      </main>

      <MarketingFooter />
    </div>
  );
}
