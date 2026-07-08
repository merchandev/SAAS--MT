"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, LayoutTemplate, Send } from "lucide-react";

export function EmailsTabs() {
  const pathname = usePathname() || "";
  
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <Link
        href="/admin/emails"
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          pathname === "/admin/emails"
            ? "border-[#D4AF37] text-[#D4AF37]"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        <Mail className="h-4 w-4" />
        Registro de Envíos
      </Link>
      <Link
        href="/admin/emails/templates"
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          pathname.includes("/admin/emails/templates")
            ? "border-[#D4AF37] text-[#D4AF37]"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        <LayoutTemplate className="h-4 w-4" />
        Plantillas
      </Link>
      <Link
        href="/admin/emails/campaigns"
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          pathname.includes("/admin/emails/campaigns")
            ? "border-[#D4AF37] text-[#D4AF37]"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        }`}
      >
        <Send className="h-4 w-4" />
        Campañas
      </Link>
    </div>
  );
}
