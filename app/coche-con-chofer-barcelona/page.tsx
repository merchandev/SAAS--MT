import { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";

export const metadata: Metadata = {
  title: "Coche con Chófer en Barcelona | Transfers in Barcelona",
  description: "Alquiler de coche con conductor por horas en Barcelona. Ideal para reuniones, eventos, compras o agendas flexibles con varias paradas.",
};

export default function CocheConChoferPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white" style={{ "--brand-accent": "#D4AF37" } as any}>
      <MarketingHeader />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Coche con Chófer en Barcelona</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Disfruta de la máxima flexibilidad alquilando un coche con chófer privado por horas. Nuestro conductor estará a tu disposición para llevarte a tus reuniones, eventos o donde necesites, esperando por ti el tiempo que sea necesario.
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
