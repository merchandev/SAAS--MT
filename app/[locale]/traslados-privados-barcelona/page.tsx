import { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";

export const metadata: Metadata = {
  title: "Traslados Privados en Barcelona | Transfers in Barcelona",
  description: "Servicio premium de traslados privados en Barcelona. Vehículos de alta gama, precio cerrado y conductores profesionales para cualquier desplazamiento.",
};

export default function TrasladosPrivadosPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white" style={{ "--brand-accent": "#D4AF37" } as any}>
      <MarketingHeader />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Traslados Privados en Barcelona</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                La forma más exclusiva y segura de moverte por Barcelona. Ponemos a tu disposición una flota de vehículos premium para traslados punto a punto, con la máxima discreción y confort.
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
