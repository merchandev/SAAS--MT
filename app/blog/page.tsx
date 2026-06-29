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

const posts = [
  {
    title: "Cómo reservar un traslado privado en Barcelona sin complicaciones",
    excerpt:
      "Qué datos preparar, cómo elegir vehículo y por qué conviene reservar con antelación cuando viajas desde o hacia el aeropuerto.",
    category: "Reservas",
    readTime: "4 min",
    image: "/images/hero_light.png",
  },
  {
    title: "Transfer Barcelona-El Prat: claves para llegar puntual",
    excerpt:
      "Recomendaciones prácticas para vuelos tempranos, llegadas internacionales, equipaje y recogidas con conductor privado.",
    category: "Aeropuerto",
    readTime: "5 min",
    image: "/images/chauffeur_day.png",
  },
  {
    title: "Tours privados desde Barcelona: Montserrat, Girona y Costa Brava",
    excerpt:
      "Ideas de rutas a medida para descubrir Cataluña en vehículo premium, con paradas flexibles y chófer profesional.",
    category: "Tours",
    readTime: "6 min",
    image: "/images/fleet_light.png",
  },
];

const guides = [
  "Traslados desde hoteles, puertos y estaciones",
  "Servicios por horas para agendas corporativas",
  "Vehículos recomendados según pasajeros y equipaje",
  "Consejos para eventos, bodas y grupos",
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white text-[#082141]">
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
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#075cbe]">Últimos artículos</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Consejos antes de viajar</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-[#082141]/70">
                Contenido pensado para viajeros particulares, empresas, grupos y clientes premium que buscan una
                experiencia de transporte clara, puntual y sin sorpresas.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.title} className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-xl shadow-blue-100/60">
                  <div className="relative aspect-[16/10]">
                    <Image src={post.image} alt={post.title} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.1em] text-[#075cbe]">
                      <span>{post.category}</span>
                      <span className="inline-flex items-center gap-1 text-[#082141]/50">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black tracking-tight">{post.title}</h3>
                    <p className="mt-4 text-base leading-7 text-[#082141]/70">{post.excerpt}</p>
                    <Link href="/contacto" className="mt-6 inline-flex items-center gap-2 text-sm font-black text-[#075cbe]">
                      Consultar este servicio
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f7fbff] py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <Newspaper className="h-12 w-12 text-[#075cbe]" aria-hidden="true" />
              <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">Temas que encontrarás en el blog</h2>
              <p className="mt-5 text-lg leading-8 text-[#082141]/70">
                Publicamos guías sencillas para elegir mejor tu transporte privado y preparar desplazamientos
                importantes con más seguridad.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {guides.map((guide) => (
                <div key={guide} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/60">
                  <CalendarDays className="h-6 w-6 text-[#075cbe]" aria-hidden="true" />
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
