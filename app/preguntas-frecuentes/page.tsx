import type { Metadata } from "next";
import { Minus } from "lucide-react";
import MarketingCta from "@/components/marketing/MarketingCta";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import PageHero from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | MeTransfers Barcelona",
  description:
    "Respuestas sobre reservas, vehículos, pagos, cancelaciones, aeropuerto, tours privados y coches con chófer en Barcelona.",
  alternates: {
    canonical: "/preguntas-frecuentes",
  },
};

const faqItems = [
  {
    question: "¿Cómo puedo reservar un traslado privado?",
    answer: [
      "Puedes solicitar tu traslado directamente en nuestra web con un proceso rápido y claro.",
      "Solo elige el origen, destino y vehículo. Recibirás la confirmación del servicio y podrás pagar de forma segura según disponibilidad.",
    ],
  },
  {
    question: "¿Qué tipos de vehículos ofrecen?",
    answer: [
      "Contamos con una flota moderna y diversa: sedanes estándar, minivans familiares, sedanes ejecutivos y minivans V-Class de lujo.",
      "Todos nuestros vehículos disponen de aire acondicionado, limpieza impecable y conductores profesionales.",
    ],
  },
  {
    question: "¿Puedo cancelar mi reserva?",
    answer: [
      "Sí. Puedes cancelar tu traslado sin coste hasta 24 horas antes.",
      "Es una opción ideal si cambian tus planes de viaje.",
      "Puedes consultar nuestra política de cancelación completa contactando con nuestro equipo.",
    ],
  },
  {
    question: "¿Dónde me encuentro con el conductor en el aeropuerto?",
    answer: [
      "Tu conductor te esperará en la sala de llegadas con un cartel con tu nombre.",
      "Si lo prefieres, también puedes indicar otro punto de encuentro personalizado.",
    ],
  },
  {
    question: "¿Ofrecen traslados a otras ciudades fuera de Barcelona?",
    answer: [
      "Sí. Realizamos transfers privados desde Barcelona a ciudades como Madrid, Valencia, Andorra, Sitges y Costa Brava, entre otras.",
    ],
  },
  {
    question: "¿Qué pasa si mi vuelo se retrasa?",
    answer: [
      "No te preocupes. Monitorizamos los vuelos en tiempo real.",
      "Si tu vuelo se retrasa, ajustamos la recogida automáticamente sin recargos cuando los datos del vuelo se han indicado correctamente.",
    ],
  },
  {
    question: "¿Puedo solicitar una silla para niños?",
    answer: [
      "Sí. Ofrecemos sillas de bebé y elevadores para niños bajo petición y según disponibilidad.",
      "Solo tienes que indicarlo durante la reserva.",
    ],
  },
  {
    question: "¿Cómo puedo contactar con atención al cliente?",
    answer: [
      "Estamos disponibles por teléfono, email y WhatsApp.",
      "Recibirás una atención rápida y personalizada antes, durante y después del servicio.",
    ],
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: [
      "Puedes pagar de forma segura con tarjetas de crédito o débito, Apple Pay, Google Pay y transferencias electrónicas seguras cuando estén disponibles.",
    ],
  },
  {
    question: "¿Ofrecen servicio de chófer por horas?",
    answer: [
      "Sí. Ofrecemos alquiler de coche con conductor por horas para eventos, reuniones, tours o visitas privadas.",
      "Tú decides el horario y el itinerario.",
    ],
  },
  {
    question: "¿Cómo gestionan mis datos personales?",
    answer: [
      "En MeTransfers Barcelona nos tomamos muy en serio la privacidad de tus datos.",
      "Puedes consultar nuestra política de privacidad completa contactando con nuestro equipo.",
    ],
  },
];

export default function FrequentlyAskedQuestionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.join(" "),
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#f7fbff] text-[#082141]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Centro de ayuda"
        title="Preguntas Frecuentes"
        description="Encuentra respuestas claras y rápidas a las dudas más comunes sobre nuestros servicios de transporte privado. Desde reservas y tarifas hasta detalles sobre rutas y vehículos."
      />

      <main className="py-16 sm:py-20">
        <section className="mx-auto max-w-5xl px-6">
          <div className="mb-8 rounded-3xl border border-blue-100 bg-white px-6 py-10 text-center shadow-xl shadow-blue-100/70 sm:px-12">
            <h2 className="text-3xl font-black tracking-tight text-[#07509f]">
              Todo lo que necesitas saber antes de reservar
            </h2>
            <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-[#082141]/80">
              Hemos reunido las consultas más habituales sobre reservas, vehículos, aeropuertos, pagos,
              cancelaciones y atención al cliente para que encuentres la información de forma rápida y ordenada.
            </p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={item.question}
                open
                className="group overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-lg shadow-blue-100/50"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 border-b border-blue-100 px-5 py-5 text-left [&::-webkit-details-marker]:hidden">
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-black text-[#082141]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-black text-[#082141]">{item.question}</span>
                  </span>
                  <Minus className="h-5 w-5 shrink-0 text-[#082141]" aria-hidden="true" />
                </summary>
                <div className="space-y-4 px-5 py-5 pl-[5.25rem] text-base leading-8 text-[#082141]/90 max-sm:pl-5">
                  {item.answer.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </section>

        <MarketingCta
          description="metransfers.es te ayuda a reservar online traslados privados, tours personalizados y servicio de chófer por horas con atención profesional."
        />
      </main>

      <MarketingFooter />
    </div>
  );
}
