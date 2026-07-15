"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import LanguageSwitcher from "@/components/marketing/LanguageSwitcher";
import { useParams } from "next/navigation";
import { localizedPath } from "@/lib/i18n-utils";
import MarketingLogo from "@/components/marketing/MarketingLogo";

export default function MobileMenu({ accentColor = "#D4AF37", isCustomer = false }: { accentColor?: string; isCustomer?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const currentLocale = (params.locale as string) || "es";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(true)}
        className="text-white p-2 focus:outline-none"
        aria-label="Abrir menú"
      >
        <Menu className="h-7 w-7" />
      </button>

      {/* Full screen overlay */}
      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col overflow-y-auto">
          {/* Header inside menu */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <MarketingLogo locale={currentLocale} />
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white p-2 focus:outline-none rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col px-6 py-8 gap-6 text-lg font-medium text-white/90">
            <a 
              href="#servicios" 
              onClick={() => setIsOpen(false)}
              className="hover:text-[#D4AF37] transition-colors duration-300 py-2 border-b border-white/5"
            >
              Servicios
            </a>
            <a
              href="#como-funciona"
              onClick={() => setIsOpen(false)}
              className="hover:text-[#D4AF37] transition-colors duration-300 py-2 border-b border-white/5"
            >
              Cómo funciona
            </a>
            <Link
              href={localizedPath("/tours-privados", currentLocale)}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#D4AF37] transition-colors duration-300 py-2 border-b border-white/5"
            >
              Tours Privados
            </Link>
            <Link
              href={localizedPath("/blog", currentLocale)}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#D4AF37] transition-colors duration-300 py-2 border-b border-white/5"
            >
              Blog
            </Link>
            <Link
              href={localizedPath("/preguntas-frecuentes", currentLocale)}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#D4AF37] transition-colors duration-300 py-2 border-b border-white/5"
            >
              Preguntas Frecuentes
            </Link>
            <Link
              href={localizedPath("/contacto", currentLocale)}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#D4AF37] transition-colors duration-300 py-2 border-b border-white/5"
            >
              Contacto
            </Link>
            
            <div className="py-4">
              <p className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-bold">Idioma</p>
              <LanguageSwitcher align="left" direction="up" />
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {isCustomer ? (
                <Link
                  href={localizedPath("/customer/dashboard", currentLocale)}
                  onClick={() => setIsOpen(false)}
                  className="text-black font-bold px-4 py-4 rounded-xl transition-colors duration-300 text-center flex items-center justify-center gap-2 text-base"
                  style={{ backgroundColor: accentColor }}
                >
                  <User className="h-6 w-6" />
                  Mi Panel de Cliente
                </Link>
              ) : (
                <>
                  <Link
                    href={localizedPath("/booking", currentLocale)}
                    onClick={() => setIsOpen(false)}
                    className="text-black font-bold px-4 py-4 rounded-xl transition-transform active:scale-95 duration-300 text-center text-base shadow-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    RESERVAR TRASLADO
                  </Link>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <Link 
                      href={localizedPath("/login", currentLocale)}
                      onClick={() => setIsOpen(false)}
                      className="text-white font-semibold px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-transparent transition-colors duration-300 text-center"
                    >
                      Ingresar
                    </Link>
                    <Link 
                      href={localizedPath("/register", currentLocale)}
                      onClick={() => setIsOpen(false)}
                      className="text-white font-semibold px-4 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors duration-300 text-center"
                    >
                      Registrarse
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
