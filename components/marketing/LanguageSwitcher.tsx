"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Globe, ChevronDown, Check } from "lucide-react";

const LANGUAGES = [
  { code: "es", label: "Español",    flag: "🇪🇸" },
  { code: "ca", label: "Català",     flag: "" },
  { code: "en", label: "English",    flag: "🇬🇧" },
  { code: "fr", label: "Français",   flag: "🇫🇷" },
  { code: "de", label: "Deutsch",    flag: "🇩🇪" },
  { code: "it", label: "Italiano",   flag: "🇮🇹" },
  { code: "pt", label: "Português",  flag: "🇵🇹" },
  { code: "ru", label: "Русский",    flag: "🇷🇺" },
  { code: "sv", label: "Svenska",    flag: "🇸🇪" },
  { code: "zh-CN", label: "中文",    flag: "🇨🇳" },
];

interface LanguageSwitcherProps {
  variant?: "dark" | "light";
  align?: "left" | "right";
  direction?: "up" | "down";
}

function getGoogleLangCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/googtrans=\/[a-z-]+\/([a-z-]+)/i);
  return match ? match[1] : null;
}

export default function LanguageSwitcher({ variant = "dark", align = "right", direction = "down" }: LanguageSwitcherProps = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>("es");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync the language button with the URL path segment (for public routes)
    const segment = pathname?.split('/')[1] || '';
    let match = LANGUAGES.find((l) => l.code.toLowerCase() === segment.toLowerCase());
    
    // Fallback to cookie for admin/ignored routes where URL doesn't have locale
    if (!match) {
      const cookieLang = getGoogleLangCookie();
      if (cookieLang) {
        match = LANGUAGES.find((l) => l.code.toLowerCase() === cookieLang.toLowerCase());
      }
    }

    if (match) {
      setCurrent(match.code);
    } else {
      setCurrent("es");
    }
  }, [pathname]);

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

  const isLight = variant === "light";

  return (
    <div ref={ref} className="relative notranslate">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
          isLight
            ? "border-gray-200 bg-white text-gray-700 hover:border-[#D4AF37] hover:bg-gray-50"
            : "border-white/20 bg-white/10 text-white hover:border-[#D4AF37] hover:bg-white/15"
        }`}
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
          className={`absolute ${align === "right" ? "right-0" : "left-0"} ${direction === "down" ? "top-full mt-2 slide-in-from-top-2" : "bottom-full mb-2 slide-in-from-bottom-2"} w-44 overflow-hidden rounded-xl border shadow-2xl backdrop-blur-md z-[9999] animate-in fade-in duration-150 ${
            isLight
              ? "border-gray-200 bg-white"
              : "border-white/15 bg-gray-900/95"
          }`}
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

                // Check if we are in an admin or ignored route
                const isIgnoredRoute = 
                  window.location.pathname.startsWith('/admin') || 
                  window.location.pathname.startsWith('/customer') || 
                  window.location.pathname.startsWith('/hotel');

                let newPath = window.location.href;

                if (!isIgnoredRoute) {
                  // Update Next.js route if it uses [locale]
                  const pathParts = window.location.pathname.split("/");
                  const currentFirstSegment = pathParts[1];
                  const isCurrentFirstSegmentLocale = LANGUAGES.some(
                    (l) => l.code.toLowerCase() === currentFirstSegment?.toLowerCase()
                  );

                  if (isCurrentFirstSegmentLocale) {
                    pathParts[1] = lang.code;
                  } else if (pathParts[1] !== "") {
                    // If there was no locale but there is a path, we insert the locale
                    pathParts.splice(1, 0, lang.code);
                  } else {
                    // Root path
                    pathParts[1] = lang.code;
                  }
                  newPath = pathParts.join("/") + window.location.search + window.location.hash;
                }

                if (lang.code === "es") {
                  // Clear translation - reload without cookie
                  document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
                  document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
                  if (!isIgnoredRoute) {
                    window.location.href = newPath;
                  } else {
                    window.location.reload();
                  }
                } else {
                  // Set the googtrans cookie that Google Translate reads
                  const expires = new Date();
                  expires.setFullYear(expires.getFullYear() + 1);
                  document.cookie = `googtrans=/es/${lang.code}; expires=${expires.toUTCString()}; path=/`;
                  document.cookie = `googtrans=/es/${lang.code}; expires=${expires.toUTCString()}; path=/; domain=${window.location.hostname}`;
                  if (!isIgnoredRoute) {
                    window.location.href = newPath;
                  } else {
                    window.location.reload();
                  }
                }
              }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                current === lang.code
                  ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                  : isLight
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white/85 hover:bg-white/10"
              }`}
            >
              <span className="w-6 shrink-0 text-center text-base">{lang.flag}</span>
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
