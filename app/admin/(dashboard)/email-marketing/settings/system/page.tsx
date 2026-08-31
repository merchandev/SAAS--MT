"use client";

import { Activity, Server, ShieldAlert } from "lucide-react";

export default function SystemSettingsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Estado del Sistema</h1>
        <p className="text-sm text-gray-500 mt-1">Límites de envío y estado de las conexiones internas del módulo de Email Marketing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">Límites de Envío</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Límite Global de Tasa (Correos / minuto)</label>
              <div className="mt-1 flex items-center">
                <input type="number" disabled value={4} className="block w-full border-gray-300 rounded-md shadow-sm bg-gray-50/50 text-gray-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <ShieldAlert className="w-3 h-3 mr-1" />
                Bloqueado por límites del VPS de Hostinger para prevenir penalizaciones.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Límite Diario de Campañas</label>
              <input type="number" disabled value={5000} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50/50 text-gray-500" />
              <p className="text-xs text-gray-500 mt-1">Configuración máxima recomendada por día.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Server className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">Conexión SMTP</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 text-green-800 rounded-lg border border-green-100">
              <span className="text-sm font-medium">Estado del Servidor</span>
              <span className="px-2 py-1 bg-green-200 text-green-900 rounded-full text-xs font-bold uppercase tracking-wider">Online</span>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p><span className="font-medium text-gray-900">Host:</span> smtp.hostinger.com</p>
              <p><span className="font-medium text-gray-900">Puerto:</span> 465 (SSL)</p>
              <p><span className="font-medium text-gray-900">Usuario:</span> info@saas.merchan.dev</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
