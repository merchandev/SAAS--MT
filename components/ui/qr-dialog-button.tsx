"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface QRDialogButtonProps {
  token: string;
  hotelName: string;
}

export function QRDialogButton({ token, hotelName }: QRDialogButtonProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // Generar la URL completa usando el origin del cliente (ej. https://tudominio.com/hotel/token)
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/hotel/${token}`);
    }
  }, [token]);

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        QR / Enlace
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Enlace de Reservas: {hotelName}</DialogTitle>
          <DialogDescription className="text-gray-500">
            Escanea este código QR o usa el enlace directo para que los clientes del hotel realicen sus reservas.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-6 space-y-6">
          {url && (
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <QRCodeCanvas
                value={url}
                size={220}
                bgColor={"#ffffff"}
                fgColor={"#0B0C10"}
                level={"H"}
                includeMargin={false}
              />
            </div>
          )}
          
          <div className="w-full flex items-center space-x-2">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-gray-50 outline-none"
              value={url}
              readOnly
            />
            <Button
              size="sm"
              onClick={() => navigator.clipboard.writeText(url)}
              className="bg-[#D4AF37] hover:bg-[#C5A059] text-[#0B0C10]"
            >
              Copiar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
