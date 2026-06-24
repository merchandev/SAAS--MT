import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B0C10] font-sans text-gray-100 selection:bg-[#D4AF37] selection:text-black">
      {/* Navbar */}
      <header className="absolute inset-x-0 top-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2C] rounded-sm flex items-center justify-center text-[#0B0C10] font-serif font-bold text-2xl shadow-lg shadow-[#D4AF37]/20">
            MT
          </div>
          <span className="font-serif font-bold text-2xl tracking-widest text-white uppercase">MeTransfers</span>
        </div>
        <nav className="hidden md:flex gap-10 font-medium text-sm tracking-widest uppercase text-gray-300">
          <Link href="/booking" className="hover:text-[#D4AF37] transition-colors duration-300">Reservar</Link>
          <a href="#servicios" className="hover:text-[#D4AF37] transition-colors duration-300">Servicios</a>
          <a href="#flota" className="hover:text-[#D4AF37] transition-colors duration-300">Flota Exclusiva</a>
          <Link href="/admin/login" className="hover:text-[#D4AF37] transition-colors duration-300">Acceso VIP</Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-40 overflow-hidden min-h-screen flex items-center">
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-[#D4AF37] rounded-full blur-[150px] opacity-[0.05] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="max-w-4xl">
              <h2 className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm font-semibold mb-6">Transporte Privado de Alta Gama</h2>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-8 leading-[1.1] text-white">
                La excelencia en <br />
                <span className="italic text-gray-300">cada trayecto.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed font-light">
                Disfruta del confort absoluto con nuestros chóferes privados. Puntualidad garantizada, discreción y la flota más exclusiva a tu disposición.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/booking">
                  <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-medium bg-[#D4AF37] text-[#0B0C10] hover:bg-[#C5A059] transition-all duration-300 rounded-sm">
                    Reservar Trayecto
                  </Button>
                </Link>
                <Link href="#como-funciona">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-medium border-gray-600 text-gray-300 hover:text-white hover:border-[#D4AF37] hover:bg-transparent transition-all duration-300 rounded-sm">
                    Descubrir Más
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The Experience Section */}
        <section id="como-funciona" className="py-32 bg-[#08090C] border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm font-semibold mb-4">El Estándar MeTransfers</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-white">Privilegios Exclusivos</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-10 bg-[#13151A] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 rounded-sm">
                <div className="w-14 h-14 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-full flex items-center justify-center mb-8 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500">
                  <span className="font-serif font-bold text-xl">I</span>
                </div>
                <h4 className="text-2xl font-serif font-bold text-white mb-4">Reserva Inmediata</h4>
                <p className="text-gray-400 font-light leading-relaxed">Indica tu origen y destino. Nuestro sistema calculará la mejor ruta y te ofrecerá una cotización cerrada al instante.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="group p-10 bg-[#13151A] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 rounded-sm">
                <div className="w-14 h-14 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-full flex items-center justify-center mb-8 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500">
                  <span className="font-serif font-bold text-xl">II</span>
                </div>
                <h4 className="text-2xl font-serif font-bold text-white mb-4">Flota Premium</h4>
                <p className="text-gray-400 font-light leading-relaxed">Selecciona el vehículo que se ajuste a tus exigencias. Desde berlinas de representación hasta Minivans de lujo.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="group p-10 bg-[#13151A] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 rounded-sm">
                <div className="w-14 h-14 border border-[#D4AF37]/30 bg-[#D4AF37]/5 rounded-full flex items-center justify-center mb-8 text-[#D4AF37] group-hover:scale-110 transition-transform duration-500">
                  <span className="font-serif font-bold text-xl">III</span>
                </div>
                <h4 className="text-2xl font-serif font-bold text-white mb-4">Servicio Impecable</h4>
                <p className="text-gray-400 font-light leading-relaxed">Tu chofer uniformado te esperará en el punto acordado, asistiéndote con el equipaje y garantizando un viaje sublime.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0B0C10] py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <span className="font-serif font-bold text-xl tracking-widest text-white uppercase">MeTransfers</span>
          </div>
          <p className="text-gray-500 font-light text-sm tracking-wide">
            © {new Date().getFullYear()} MeTransfers Premium Mobility. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
