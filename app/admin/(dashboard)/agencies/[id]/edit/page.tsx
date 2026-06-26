import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { b2bQueries } from "@/modules/b2b/b2b.queries";
import { AgencyForm } from "../../AgencyForm";

export const dynamic = "force-dynamic";

export default async function EditAgencyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const agency = await b2bQueries.getAgencyById(params.id);

  if (!agency) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/agencies" className="text-gray-500 hover:text-gray-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">Editar agencia</h3>
          <p className="text-gray-500">{agency.name}</p>
        </div>
      </div>

      <AgencyForm mode="edit" agency={agency} />
    </div>
  );
}
