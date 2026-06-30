import { Metadata } from "next";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";

export const metadata: Metadata = {
  title: "Traslados al Puerto de Cruceros de Barcelona | MeTransfers",
  description: "Transfers privados desde y hacia las terminales de cruceros del Puerto de Barcelona. Inicio o fin de tus vacaciones con total comodidad y sin retrasos.",
};

export default function TrasladosPuertoPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-950 selection:bg-[var(--brand-accent)] selection:text-white" style={{ "--brand-accent": "#D4AF37" } as any}>
      <MarketingHeader />
      <main className="pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Traslados al Puerto de Barcelona</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Inicia o finaliza tu crucero sin estrés. Ofrecemos traslados directos entre el aeropuerto o tu hotel y las diferentes terminales marítimas del Puerto de Barcelona, con espacio garantizado para tu equipaje.
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
