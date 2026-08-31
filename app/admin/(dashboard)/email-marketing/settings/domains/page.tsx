"use client";

import { useState } from "react";
import { Globe, Plus, CheckCircle2, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DomainsSettingsPage() {
  const [domains] = useState([
    { id: "1", name: "saas.merchan.dev", status: "verified", addedOn: "2026-01-15" }
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dominios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los dominios desde los cuales enviarás correos electrónicos.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Añadir Dominio
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-600 text-xs uppercase font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Dominio</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Añadido el</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {domains.map((domain) => (
                <tr key={domain.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-2" />
                    {domain.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verificado
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(domain.addedOn).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {domains.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No has añadido ningún dominio todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
