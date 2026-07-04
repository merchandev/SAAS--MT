"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SeoPreviewCardProps {
  title: string;
  description: string;
  slug: string;
  baseUrl?: string;
}

export function SeoPreviewCard({ 
  title, 
  description, 
  slug, 
  baseUrl = "https://transfersinbarcelona.com" 
}: SeoPreviewCardProps) {
  // Truncate text as Google does
  const displayTitle = title || "Ejemplo de Título SEO para la Página | MeTransfers";
  const truncatedTitle = displayTitle.length > 60 ? displayTitle.substring(0, 60) + "..." : displayTitle;
  
  const displayDesc = description || "Proporciona una meta descripción detallada que resuma el contenido de esta página. Intenta mantenerla entre 120 y 160 caracteres para un SEO óptimo.";
  const truncatedDesc = displayDesc.length > 160 ? displayDesc.substring(0, 157) + "..." : displayDesc;

  const urlPath = slug ? (slug.startsWith("/") ? slug : `/rutas/${slug}`) : "/ejemplo-de-ruta";

  return (
    <Card className="border-gray-200 shadow-sm mt-6">
      <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
        <CardTitle className="text-lg flex items-center gap-2">
          <span translate="no" className="notranslate material-symbols-outlined text-[20px] text-green-600">search</span>
          Vista previa de Google (Yoast SEO)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="bg-white p-4 rounded-lg border border-gray-100 font-sans max-w-[600px]">
          {/* Breadcrumb / URL */}
          <div className="flex items-center text-sm text-[#202124] mb-1">
            <span className="truncate">{baseUrl}</span>
            <span className="mx-2 text-[#70757a]">›</span>
            <span className="truncate text-[#4d5156]">{urlPath.replace(/^\//, "").split('/').join(' › ')}</span>
          </div>
          
          {/* Title */}
          <div className="text-[20px] leading-[1.3] text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1 truncate">
            {truncatedTitle}
          </div>
          
          {/* Description */}
          <div className="text-[14px] leading-[1.58] text-[#4d5156] break-words">
            {truncatedDesc}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          * Esta es una aproximación de cómo los resultados de búsqueda podrían mostrar tu página. La visualización real puede variar dependiendo del dispositivo y las actualizaciones de Google.
        </p>
      </CardContent>
    </Card>
  );
}
