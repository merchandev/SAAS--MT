import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import MarketingCta from "@/components/marketing/MarketingCta";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageHero from "@/components/marketing/PageHero";
import { getBlogImage } from "@/lib/fleet-images";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blog de traslados privados en Barcelona | MeTransfers",
  description:
    "Consejos sobre traslados privados, aeropuerto de Barcelona, tours, eventos corporativos y coches con chofer.",
  alternates: {
    canonical: "/blog",
  },
};

const guides = [
  "Traslados desde hoteles, puertos y estaciones",
  "Servicios por horas para agendas corporativas",
  "Vehiculos recomendados segun pasajeros y equipaje",
  "Consejos para eventos, bodas y grupos",
];

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const allPosts = await prisma.post.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
    take: 15,
  });

  // Map to the format expected by the UI, providing fallbacks
  const posts = allPosts.map(post => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    category: "MeTransfers-Blog",
    pubDate: post.publishedAt ? post.publishedAt.toISOString() : post.createdAt.toISOString()
  }));
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <PageHero
        eyebrow="Blog"
        title="Guias de movilidad premium"
        description="Informacion practica para planificar traslados privados, tours, servicios de aeropuerto y coches con chofer en Barcelona."
      />

      <main>
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#D4AF37]">Ultimos articulos</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Consejos antes de viajar</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-gray-600">
                Contenido pensado para viajeros particulares, empresas, grupos y clientes premium que buscan una
                experiencia de transporte clara, puntual y sin sorpresas.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {posts.map((post) => {
                const image = getBlogImage(post);
                const href = `/blog/${post.slug}`;

                return (
                  <article key={post.slug} className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
                    <Link href={href} className="block" aria-label={post.title}>
                      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gray-100">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                      </div>
                    </Link>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.1em] text-[#D4AF37]">
                        <span>{post.category}</span>
                      </div>
                      <h3 className="mt-4 text-2xl font-black tracking-tight line-clamp-3 transition-colors group-hover:text-[#D4AF37]">
                        <Link href={href}>{post.title}</Link>
                      </h3>
                      <p className="mt-4 text-base leading-7 text-gray-600 line-clamp-3">{post.excerpt}</p>
                      <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#D4AF37] transition group-hover:text-gray-900">
                        Leer articulo
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <Newspaper className="h-12 w-12 text-[#D4AF37]" aria-hidden="true" />
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Temas que encontraras en el blog</h2>
              <p className="mt-5 text-lg leading-8 text-gray-600">
                Publicamos guias sencillas para elegir mejor tu transporte privado y preparar desplazamientos
                importantes con mas seguridad.
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
          title="Necesitas organizar un traslado ahora?"
          description="Reserva online o contacta con nuestro equipo para servicios especiales, grupos, tours y movilidad corporativa."
        />
      </main>

      <MarketingFooter />
    </div>
  );
}
