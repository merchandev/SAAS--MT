"use client";

import { useState } from "react";
import { Plus, Trash2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SendersSettingsPage() {
  const [senders] = useState([
    { id: "1", name: "Transfers in Barcelona", email: "info@transfersinbarcelona.com", isDefault: true }
  ]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Remitentes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los nombres y direcciones de correo electrónico que aparecerán como remitente.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Añadir Remitente
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-600 text-xs uppercase font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Nombre (From Name)</th>
                <th className="px-6 py-4">Correo (From Email)</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {senders.map((sender) => (
                <tr key={sender.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {sender.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    {sender.email}
                  </td>
                  <td className="px-6 py-4">
                    {sender.isDefault ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Por defecto
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        Secundario
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {senders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No has añadido ningún remitente todavía.
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
