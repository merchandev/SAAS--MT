import { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";

export const metadata: Metadata = {
  title: "Tours Privados con Chófer en Barcelona | MeTransfers",
  description: "Descubre Barcelona y sus alrededores a tu propio ritmo. Excursiones y tours privados con chófer profesional y atención personalizada.",
};

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
