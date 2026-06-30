"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const pageTypes = ["home", "service", "route", "vehicle", "hotel", "blog"] as const;
const targets = ["hero", "card", "social", "banner"] as const;
const sizes = ["1536x1024", "1024x1024", "1024x1536", "auto"] as const;
const qualities = ["medium", "low", "high", "auto"] as const;

type PageType = (typeof pageTypes)[number];
type Target = (typeof targets)[number];
type ImageSize = (typeof sizes)[number];
type ImageQuality = (typeof qualities)[number];

type GenerateImageButtonProps = {
  defaultPageType?: PageType;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCity?: string;
  defaultServiceType?: string;
  defaultTarget?: Target;
};

type GeneratedImageResponse = {
  image?: string;
  prompt?: string;
  model?: string;
  error?: string;
};

export function GenerateImageButton({
  defaultPageType = "blog",
  defaultTitle = "Traslados premium en Mercedes por Barcelona",
  defaultDescription = "Imagen editorial para la web de MeTransfers con vehiculos Mercedes de la flota.",
  defaultCity = "Barcelona",
  defaultServiceType = "Mercedes chauffeur transfer",
  defaultTarget = "hero",
}: GenerateImageButtonProps) {
  const [pageType, setPageType] = useState<PageType>(defaultPageType);
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const [city, setCity] = useState(defaultCity);
  const [serviceType, setServiceType] = useState(defaultServiceType);
  const [target, setTarget] = useState<Target>(defaultTarget);
  const [size, setSize] = useState<ImageSize>("1536x1024");
  const [quality, setQuality] = useState<ImageQuality>("medium");
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/ai/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageType,
          title,
          description,
          city,
          serviceType,
          target,
          size,
          quality,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as GeneratedImageResponse;

      if (!response.ok || !data.image) {
        throw new Error(data.error || "No se pudo generar la imagen.");
      }

      setImage(data.image);
      setPrompt(data.prompt || null);
      setModel(data.model || null);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "No se pudo generar la imagen.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-5xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-[#D4AF37]" />
          Generador de imagenes
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ai-page-type">Tipo de pagina</Label>
              <select
                id="ai-page-type"
                value={pageType}
                onChange={(event) => setPageType(event.target.value as PageType)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              >
                {pageTypes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-target">Formato</Label>
              <select
                id="ai-target"
                value={target}
                onChange={(event) => setTarget(event.target.value as Target)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              >
                {targets.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ai-title">Titulo</Label>
              <Input id="ai-title" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="ai-description">Descripcion</Label>
              <textarea
                id="ai-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-city">Ciudad</Label>
              <Input id="ai-city" value={city} onChange={(event) => setCity(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-service-type">Servicio</Label>
              <Input id="ai-service-type" value={serviceType} onChange={(event) => setServiceType(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-size">Tamano</Label>
              <select
                id="ai-size"
                value={size}
                onChange={(event) => setSize(event.target.value as ImageSize)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              >
                {sizes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-quality">Calidad</Label>
              <select
                id="ai-quality"
                value={quality}
                onChange={(event) => setQuality(event.target.value as ImageQuality)}
                className="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
              >
                {qualities.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

          <Button type="button" onClick={handleGenerate} disabled={isLoading || title.trim().length < 3}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            {isLoading ? "Generando..." : "Generar imagen"}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {image ? (
              <Image src={image} alt={title} fill unoptimized sizes="360px" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-500">Vista previa</div>
            )}
          </div>
          {model && <p className="text-xs text-gray-500">Modelo: {model}</p>}
          {prompt && (
            <details className="rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600">
              <summary className="cursor-pointer font-medium text-gray-900">Prompt enviado</summary>
              <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-sans">{prompt}</pre>
            </details>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
