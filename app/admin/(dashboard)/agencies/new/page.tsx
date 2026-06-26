import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AgencyForm } from "../AgencyForm";

export const dynamic = "force-dynamic";

export default function NewAgencyPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/agencies" className="text-gray-500 hover:text-gray-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Nueva agencia</h3>
          <p className="text-gray-500">Crea una agencia B2B con comisión, descuento y token propio.</p>
        </div>
      </div>

      <AgencyForm mode="create" />
    </div>
  );
}
