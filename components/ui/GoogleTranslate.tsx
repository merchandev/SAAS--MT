"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Definimos la función global que requiere Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "es",
          includedLanguages: "es,en,pt-PT,fr,de,it,ru,sv,zh-CN",
          // Desactivar el autodisplay para evitar inyecciones extras si es posible
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Función para ocultar agresivamente el banner de Google
    const hideGoogleBar = () => {
      const iframes = document.querySelectorAll<HTMLElement>(
        "iframe.goog-te-banner-frame, .goog-te-banner-frame, iframe.skiptranslate"
      );
      iframes.forEach((f) => {
        f.style.display = "none";
        f.style.visibility = "hidden";
        f.style.opacity = "0";
      });
      if (document.body.style.top) {
        document.body.style.top = "0px";
      }
      if (document.body.style.marginTop) {
        document.body.style.marginTop = "0px";
      }
    };

    // Ejecutar múltiples veces como en el plugin original
    setTimeout(hideGoogleBar, 100);
    setTimeout(hideGoogleBar, 500);
    setTimeout(hideGoogleBar, 1000);
    setTimeout(hideGoogleBar, 2000);
    
    // Monitoreo continuo (limpiamos el intervalo al desmontar el componente)
    const interval = setInterval(hideGoogleBar, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      
      {/* 
        Contenedor estiliado 
        El CSS apunta al <select> que Google genera en el interior de este div.
      */}
      <div className="relative inline-flex items-center">
        <div 
          id="google_translate_element" 
          className="
            [&>div]:flex [&>div]:items-center 
            [&_select]:bg-black/50 [&_select]:text-white [&_select]:font-semibold 
            [&_select]:border [&_select]:border-white/15 [&_select]:rounded-lg 
            [&_select]:px-3 [&_select]:py-1.5 [&_select]:text-sm [&_select]:outline-none 
            [&_select]:transition-colors [&_select:focus]:border-[#D4AF37] [&_select]:hover:border-[#D4AF37]
            [&_select]:appearance-none [&_select]:cursor-pointer [&_select]:pr-7
          "
        ></div>
        {/* Icono decorativo para el dropdown */}
        <span 
          translate="no" 
          className="notranslate pointer-events-none absolute right-2 text-white/70 material-symbols-outlined text-[16px]"
        >
          language
        </span>
      </div>
    </>
  );
}
