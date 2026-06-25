"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

interface Props {
  booking: any;
  publicCode?: string; // Para clientes públicos
}

export function InvoiceDownloadButton({ booking, publicCode }: Props) {
  // Construir la URL de descarga. Si hay publicCode, lo añadimos para autorizar la descarga pública.
  const downloadUrl = `/api/invoices/${booking.id}${publicCode ? `?publicCode=${publicCode}` : ""}`;

  return (
    <Button variant="outline" className="flex items-center gap-2" type="button" onClick={() => window.open(downloadUrl, "_blank")}>
      <Download className="h-4 w-4" />
      Descargar Factura
    </Button>
  );
}
