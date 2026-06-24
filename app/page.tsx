import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <header className="absolute inset-x-0 top-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
            MT
          </div>
          <span className="font-bold text-2xl tracking-tight text-gray-900">MeTransfers</span>
        </div>
        <nav className="hidden md:flex gap-8 font-semibold text-gray-800">
          <Link href="/booking" className="hover:text-blue-600 transition">Reservar</Link>
          <a href="#" className="hover:text-blue-600 transition">Servicios</a>
          <a href="#" className="hover:text-blue-600 transition">Flota</a>
          <Link href="/admin/login" className="hover:text-blue-600 transition">Acceso Partners</Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
            <div className="w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Tu traslado privado, <br />
              <span className="text-blue-600">sin complicaciones.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Reserva en menos de 2 minutos. Conductores profesionales, precios cerrados y puntualidad garantizada para tu tranquilidad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold shadow-lg shadow-blue-600/20">
                  Reservar Ahora
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold">
                  ¿Cómo funciona?
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="como-funciona" className="py-20 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mx-auto text-blue-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold">1. Indica tu ruta</h3>
                <p className="text-gray-500">Dinos dónde te recogemos y a dónde vas. Aeropuertos, hoteles o domicilios.</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mx-auto text-blue-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold">2. Elige vehículo</h3>
                <p className="text-gray-500">Selecciona el coche que mejor se adapte a tu grupo y equipaje. Precio final, sin sorpresas.</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border flex items-center justify-center mx-auto text-blue-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold">3. Confirmación</h3>
                <p className="text-gray-500">Recibe tu reserva al instante. Tu conductor te estará esperando a la hora acordada.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-12 border-t mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
          <p>© {new Date().getFullYear()} MeTransfers. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
