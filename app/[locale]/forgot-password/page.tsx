import Link from "next/link";
import Image from "next/image";
import MarketingLogo from "@/components/marketing/MarketingLogo";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Recuperar Contraseña | Transfers in Barcelona Premium Mobility",
  description: "Recupera el acceso a tu cuenta.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-black flex selection:bg-[#D4AF37] selection:text-white">
      {/* Left side: Premium Image */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/chauffeur_day.png"
            alt="Transfers in Barcelona Chauffeur"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/80"></div>
        </div>
        
        <div className="relative z-10">
          <MarketingLogo />
        </div>

        <div className="relative z-10 max-w-lg mb-12">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">
            Recupera tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8B2C] italic">acceso</span>.
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Te enviaremos un enlace seguro a tu correo para que puedas volver a gestionar tus traslados corporativos.
          </p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 md:px-12 relative">
        <div className="lg:hidden absolute top-6 left-6 z-10">
          <MarketingLogo className="drop-shadow-md" />
        </div>

        <div className="lg:hidden absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/hero_light.png"
            alt="Transfers in Barcelona Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
