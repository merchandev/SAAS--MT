"use client";

import { useState } from "react";
import { HardDrive, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearSystemCacheAction } from "@/modules/settings/system.actions";

export function SystemCacheButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function handleClearCache() {
    setIsLoading(true);
    setMessage(null);

    const result = await clearSystemCacheAction();

    setIsLoading(false);
    if (result.error) {
      setMessage({ text: result.error, type: "error" });
    } else {
      setMessage({ text: "Caché limpiada exitosamente. Los cambios visuales están listos.", type: "success" });
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-full bg-blue-100 p-3 text-blue-600">
          <HardDrive className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">Caché del Sistema</h3>
          <p className="mt-1 text-sm text-gray-500">
            Forzar la limpieza de la caché de Next.js. Útil si has actualizado imágenes, textos o rutas y los cambios no se reflejan en la web inmediatamente.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button disabled={isLoading} onClick={handleClearCache}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Limpiar Caché Ahora
            </Button>
            {message && (
              <p className={`text-sm font-medium ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
