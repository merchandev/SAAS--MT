"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Globe } from "lucide-react";

const GoogleTranslate = dynamic(() => import("@/components/ui/GoogleTranslate"), {
  ssr: false,
});

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="animate-in fade-in zoom-in duration-300">
        <GoogleTranslate />
      </div>
    );
  }

  return (
    <button 
      type="button" 
      onClick={() => setOpen(true)}
      className="flex items-center justify-center w-[130px] h-[34px] rounded-lg border border-white/20 bg-white/10 text-white font-semibold text-sm transition-colors hover:border-[#D4AF37] hover:bg-white/15"
      aria-label="Cambiar idioma"
      title="Cambiar idioma"
    >
      <Globe className="w-4 h-4 mr-2" />
      Idioma
    </button>
  );
}
