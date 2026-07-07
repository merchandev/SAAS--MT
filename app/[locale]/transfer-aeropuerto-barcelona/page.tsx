import { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";

export const metadata: Metadata = {
  title: "Transfer Aeropuerto Barcelona | Transfers in Barcelona",
  description: "Reserva tu traslado privado desde o hacia el Aeropuerto de Barcelona (El Prat). Precio cerrado, conductor profesional y puntualidad garantizada.",
};

export default function TransferAeropuertoPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white" style={{ "--brand-accent": "#D4AF37" } as any}>
      <MarketingHeader />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Transfer Aeropuerto Barcelona</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Llega a tu destino sin complicaciones. Nuestro servicio de transfer privado te recoge en la terminal de llegadas del Aeropuerto Josep Tarradellas Barcelona-El Prat (BCN) y te lleva directamente a tu hotel, reunión o evento.
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
