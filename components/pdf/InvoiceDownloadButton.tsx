"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoiceDocument } from "./InvoiceDocument";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Props {
  booking: any;
  customer: any;
  settings: Record<string, string>;
}

export function InvoiceDownloadButton({ booking, customer, settings }: Props) {
  const [isClient, setIsClient] = useState(false);

  // Solucionar problemas de SSR de react-pdf (se debe renderizar solo en cliente)
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Button variant="outline" className="flex items-center gap-2" disabled>
        <Download className="h-4 w-4" />
        Preparando Factura...
      </Button>
    );
  }

  const fileName = `Factura_${booking.publicCode.slice(0, 8).toUpperCase()}.pdf`;

  return (
    <PDFDownloadLink
      document={<InvoiceDocument booking={booking} customer={customer} settings={settings} />}
      fileName={fileName}
      className="inline-block"
    >
      {({ blob, url, loading, error }) => (
        <Button variant="outline" className="flex items-center gap-2" disabled={loading}>
          <Download className="h-4 w-4" />
          {loading ? "Generando PDF..." : "Descargar Factura"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
