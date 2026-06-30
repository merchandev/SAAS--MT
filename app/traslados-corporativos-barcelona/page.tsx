import { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";

export const metadata: Metadata = {
  title: "Traslados Corporativos en Barcelona | MeTransfers",
  description: "Servicio de transporte privado para empresas, congresos, ferias y eventos corporativos en Barcelona. Vehículos ejecutivos y máxima puntualidad.",
};

export default function TrasladosCorporativosPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white" style={{ "--brand-accent": "#D4AF37" } as any}>
      <MarketingHeader />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Traslados Corporativos en Barcelona</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Soluciones de movilidad ejecutiva para congresos, MWC, ferias, y reuniones de negocios. Garantizamos puntualidad, discreción y la mejor imagen profesional para ti o para tus invitados VIP.
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
