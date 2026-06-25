import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import HomeBookingFormClient from "@/components/home/HomeBookingFormClient";
import MobileMenu from "@/components/home/MobileMenu";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-[#D4AF37] selection:text-white">
      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full bg-black/40 backdrop-blur-md mt-4 rounded-2xl border border-white/10 shadow-2xl transition-all">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2C] rounded-lg flex items-center justify-center text-white font-serif font-bold text-2xl shadow-lg">
            MT
          </div>
          <span className="font-serif font-bold text-2xl tracking-widest text-white uppercase">MeTransfers</span>
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 font-bold text-sm tracking-widest uppercase text-white/80">
          <Link href="/booking" className="hover:text-[#D4AF37] transition-colors duration-300">Reservar</Link>
          <a href="#servicios" className="hover:text-[#D4AF37] transition-colors duration-300">Servicios</a>
          <a href="#flota" className="hover:text-[#D4AF37] transition-colors duration-300">Flota</a>
          <div className="flex items-center gap-4 ml-2 pl-4 border-l border-white/20">
            <Link href="/login" className="hover:text-[#D4AF37] transition-colors duration-300">Ingresar</Link>
            <Link href="/register" className="bg-[#D4AF37] hover:bg-[#AA8B2C] text-white px-4 py-1.5 rounded-full transition-colors duration-300">Registrarse</Link>
          </div>
        </nav>

        {/* Mobile Nav */}
        <MobileMenu />
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 min-h-screen flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('/images/hero_light.png')] bg-cover bg-center"></div>
            {/* Dark Premium Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
            <div className="absolute inset-0 bg-black/20"></div> {/* Extra darkening for contrast */}
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              
              {/* Left Content */}
              <div className="w-full lg:w-1/2 text-white">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-8 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse"></div>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-200">Traslados Privados & Tours Premium</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-6 leading-[1.1]">
                  Viaja con<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8B2C] italic">Elegancia</span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-300 max-w-lg mb-8 leading-relaxed font-light">
                  Tu chófer privado de lujo en España te espera. Vehículos de alta gama para traslados al aeropuerto, tours exclusivos y eventos corporativos.
                </p>
              </div>

              {/* Right Content - Form */}
              <div className="w-full lg:w-1/2 flex justify-end fade-in-up delay-200">
                <HomeBookingFormClient />
              </div>

            </div>
          </div>
        </section>

        {/* The Experience Section */}
        <section id="como-funciona" className="py-32 bg-white border-t border-gray-200 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20 fade-in-up">
              <h2 className="text-[#D4AF37] uppercase tracking-[0.3em] text-base font-bold mb-4">El Estándar MeTransfers</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Privilegios Exclusivos</h3>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              {/* Image Side */}
              <div className="w-full lg:w-1/2 fade-in-up">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                  <Image 
                    src="/images/chauffeur_day.png" 
                    alt="Servicio de Chofer"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text Side */}
              <div className="w-full lg:w-1/2 space-y-8">
                {/* Feature 1 */}
                <div className="group p-8 bg-gray-50 border border-gray-200 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-500 rounded-xl fade-in-up">
                  <div className="w-16 h-16 bg-white shadow-md rounded-full flex items-center justify-center mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500">
                    <span className="font-serif font-bold text-2xl">I</span>
                  </div>
                  <h4 className="text-3xl font-serif font-bold text-gray-900 mb-4">Reserva Inmediata</h4>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">Indica tu origen y destino. Nuestro sistema calculará la mejor ruta y te ofrecerá una cotización cerrada al instante.</p>
                </div>
                
                {/* Feature 2 */}
                <div className="group p-8 bg-gray-50 border border-gray-200 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-500 rounded-xl fade-in-up">
                  <div className="w-16 h-16 bg-white shadow-md rounded-full flex items-center justify-center mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500">
                    <span className="font-serif font-bold text-2xl">II</span>
                  </div>
                  <h4 className="text-3xl font-serif font-bold text-gray-900 mb-4">Flota Premium</h4>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">Selecciona el vehículo que se ajuste a tus exigencias. Desde berlinas de representación hasta Minivans de lujo.</p>
                </div>
                
                {/* Feature 3 */}
                <div className="group p-8 bg-gray-50 border border-gray-200 hover:border-[#D4AF37] hover:shadow-xl transition-all duration-500 rounded-xl fade-in-up">
                  <div className="w-16 h-16 bg-white shadow-md rounded-full flex items-center justify-center mb-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500">
                    <span className="font-serif font-bold text-2xl">III</span>
                  </div>
                  <h4 className="text-3xl font-serif font-bold text-gray-900 mb-4">Servicio Impecable</h4>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">Tu chofer te esperará en el punto acordado, asistiéndote con el equipaje y garantizando un viaje sublime.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <span className="font-serif font-bold text-2xl tracking-widest text-gray-900 uppercase">MeTransfers</span>
          </div>
          <p className="text-gray-500 font-medium text-base tracking-wide">
            © {new Date().getFullYear()} MeTransfers Premium Mobility. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
