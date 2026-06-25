"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 font-bold text-sm tracking-widest uppercase text-white/90">
          <Link 
            href="/booking" 
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            Reservar
          </Link>
          <a 
            href="#servicios" 
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            Servicios
          </a>
          <a 
            href="#flota" 
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            Flota
          </a>
          
          <div className="h-px bg-white/20 w-full my-2"></div>
          
          <Link 
            href="/login" 
            onClick={() => setIsOpen(false)}
            className="hover:text-[#D4AF37] transition-colors duration-300"
          >
            Ingresar
          </Link>
          <Link 
            href="/register" 
            onClick={() => setIsOpen(false)}
            className="bg-[#D4AF37] hover:bg-[#AA8B2C] text-white px-4 py-3 rounded-xl transition-colors duration-300 text-center"
          >
            Registrarse
          </Link>
        </div>
      )}
    </div>
  );
}
