"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { emptyTrashAction } from "@/modules/bookings/bookings.actions";

export function EmptyTrashButton() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleEmptyTrash() {
    const confirmed = window.confirm(
      "¿Estás seguro de vaciar la papelera? Esta acción eliminará permanentemente todos los traslados en la papelera y no se puede deshacer."
    );

    if (!confirmed) return;

    setIsDeleting(true);
    const result = await emptyTrashAction();
    setIsDeleting(false);

    if (result.error) {
      alert(result.error);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleEmptyTrash}
      disabled={isDeleting}
      className="h-10 w-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center hover:bg-red-100 transition-colors disabled:opacity-50"
      title="Vaciar papelera"
    >
      <Trash2 className={`w-5 h-5 ${isDeleting ? 'animate-pulse' : ''}`} />
    </button>
  );
}
