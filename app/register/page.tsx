import Link from "next/link";
import Image from "next/image";
import PublicRegisterForm from "@/components/auth/PublicRegisterForm";

export const metadata = {
  title: "Registro | MeTransfers Premium Mobility",
  description: "Crea tu cuenta en MeTransfers y accede a servicios de movilidad VIP.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black flex selection:bg-[#D4AF37] selection:text-white">
      {/* Left side: Premium Image */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_light.png"
            alt="MeTransfers Fleet"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/80"></div>
        </div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2C] rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
              MT
            </div>
            <span className="font-serif font-bold text-xl tracking-widest text-white uppercase">MeTransfers</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">
            Eleva tus estándares de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8B2C] italic">viaje</span>.
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Al registrarte en MeTransfers obtienes un perfil de cliente con historial de traslados, gastos y seguimiento de tus servicios.
          </p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:px-12 relative overflow-y-auto">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden absolute top-6 left-6 z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2C] rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
              MT
            </div>
            <span className="font-serif font-bold text-xl tracking-widest text-white uppercase drop-shadow-md">MeTransfers</span>
          </Link>
        </div>

        {/* Mobile background overlay */}
        <div className="lg:hidden absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Image
            src="/images/chauffeur_day.png"
            alt="MeTransfers Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 my-auto pt-16 lg:pt-0">
          <PublicRegisterForm />
        </div>
      </div>
    </div>
  );
}
