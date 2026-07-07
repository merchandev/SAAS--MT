"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

const LANGUAGES = [
  { code: "es", label: "Español",    flag: "🇪🇸" },
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "it", label: "Italiano",   flag: "🇮🇹" },
  { code: "pt", label: "Português",  flag: "🇵🇹" },
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "sv", label: "Svenska",    flag: "🇸🇪" },
  { code: "zh-CN", label: "中文",    flag: "🇨🇳" },
];

function getGoogleLangCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/googtrans=\/[a-z-]+\/([a-z-]+)/i);
  return match ? match[1] : null;
}

function setGoogleTranslateLang(langCode: string) {
  // Set the googtrans cookie that Google Translate reads
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `googtrans=/es/${langCode}; expires=${expires.toUTCString()}; path=/`;
  // Also set for the domain
  const host = window.location.hostname;
  document.cookie = `googtrans=/es/${langCode}; expires=${expires.toUTCString()}; path=/; domain=${host}`;
  // Reload to apply translation
  window.location.reload();
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>("es");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cookie = getGoogleLangCookie();
    if (cookie) {
      const match = LANGUAGES.find((l) => l.code === cookie);
      if (match) setCurrent(match.code);
    }
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:border-[#D4AF37] hover:bg-white/15"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Cambiar idioma"
      >
        <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{currentLang.code === "zh-CN" ? "ZH" : currentLang.code.toUpperCase().slice(0, 2)}</span>
        <ChevronDown
          className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-xl border border-white/15 bg-gray-900/95 shadow-2xl backdrop-blur-md z-[9999] animate-in fade-in slide-in-from-top-2 duration-150"
          role="listbox"
          aria-label="Seleccionar idioma"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={current === lang.code}
              onClick={() => {
                setCurrent(lang.code);
                setOpen(false);
                if (lang.code === "es") {
                  // Clear translation - reload without cookie
                  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
                  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
                  window.location.reload();
                } else {
                  setGoogleTranslateLang(lang.code);
                }
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                current === lang.code
                  ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                  : "text-white/85 hover:bg-white/10"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.label}</span>
              {current === lang.code && (
                <Check className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Hidden Google Translate element (needed for the cookie mechanism) */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />
    </div>
  );
}
