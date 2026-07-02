"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import GoogleTranslate from "@/components/ui/GoogleTranslate";

export default function MobileMenu({ accentColor = "#D4AF37", isCustomer = false }: { accentColor?: string; isCustomer?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 focus:outline-none"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg p-6 shadow-2xl flex flex-col gap-5 font-bold text-sm uppercase text-white/90">
          <a 
            href="#servicios" 
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            Servicios
          </a>
          <a
            href="#como-funciona"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            Cómo funciona
          </a>
          <Link
            href="/tours-privados"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            Tours
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            Blog
          </Link>
          <Link
            href="/preguntas-frecuentes"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            FAQ
          </Link>
          <Link
            href="/contacto"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            Contacto
          </Link>
          
          <div className="py-2 flex justify-center">
            <GoogleTranslate />
          </div>

          <div className="h-px bg-white/20 w-full my-2"></div>

          {isCustomer ? (
            <Link
              href="/customer/dashboard"
              onClick={() => setIsOpen(false)}
              className="text-black px-4 py-3 rounded-lg transition-colors duration-300 text-center flex items-center justify-center gap-2"
              style={{ backgroundColor: accentColor }}
            >
              <span translate="no" className="notranslate material-symbols-outlined text-[20px]">person</span>
              Mi Panel
            </Link>
          ) : (
            <>
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="text-black px-4 py-3 rounded-lg transition-colors duration-300 text-center"
                style={{ backgroundColor: accentColor }}
              >
                Reservar traslado
              </Link>
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-white px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-transparent transition-colors duration-300 text-center"
              >
                Ingresar
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsOpen(false)}
                className="text-white px-4 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors duration-300 text-center"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
