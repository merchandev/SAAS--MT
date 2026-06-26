"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Props {
  bookingId: string;
  receiptToken?: string;
}

export function InvoiceDownloadButton({ bookingId, receiptToken }: Props) {
  const downloadUrl = `/api/invoices/${bookingId}${receiptToken ? `?token=${encodeURIComponent(receiptToken)}` : ""}`;

  return (
    <Button variant="outline" className="flex items-center gap-2" type="button" onClick={() => window.open(downloadUrl, "_blank")}>
      <Download className="h-4 w-4" />
      Descargar Factura
    </Button>
  );
}
