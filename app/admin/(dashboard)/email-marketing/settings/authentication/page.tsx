"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

export default function AuthenticationSettingsPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [dnsStatus, setDnsStatus] = useState<any>(null);

  const handleCheckDns = async () => {
    setIsChecking(true);
    // Simulated DNS check for demo purposes. In a real scenario, call an API that uses `dns` module
    setTimeout(() => {
      setDnsStatus({
        spf: { ok: true, value: "v=spf1 mx a include:_spf.saas.merchan.dev ~all" },
        dkim: { ok: true, value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG..." },
        dmarc: { ok: false, value: "Not found", message: "Missing _dmarc TXT record" },
        mx: { ok: true, value: "mail.saas.merchan.dev" },
      });
      setIsChecking(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">DNS y Autenticación</h1>
        <p className="text-sm text-gray-500 mt-1">Verifica la configuración de los registros DNS para mejorar la entregabilidad de tus correos.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
          <div>
            <h2 className="text-lg font-semibold">Estado de Registros</h2>
            <p className="text-sm text-gray-500">Dominio principal: <span className="font-medium text-gray-800">saas.merchan.dev</span></p>
          </div>
          <button 
            onClick={handleCheckDns}
            disabled={isChecking}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center whitespace-nowrap"
          >
            {isChecking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Verificar Registros DNS
          </button>
        </div>

        {dnsStatus && (
          <div className="space-y-4">
            <DnsRecordRow 
              name="SPF (Sender Policy Framework)" 
              description="Autoriza a tu servidor a enviar correos en nombre de tu dominio."
              status={dnsStatus.spf}
            />
            <DnsRecordRow 
              name="DKIM (DomainKeys Identified Mail)" 
              description="Firma criptográfica que asegura que el correo no ha sido alterado."
              status={dnsStatus.dkim}
            />
            <DnsRecordRow 
              name="DMARC (Domain-based Message Authentication)" 
              description="Le indica a los servidores receptores qué hacer si fallan SPF o DKIM."
              status={dnsStatus.dmarc}
            />
            <DnsRecordRow 
              name="MX (Mail Exchanger)" 
              description="Apunta a tu servidor de correo para recibir rebotes."
              status={dnsStatus.mx}
            />
          </div>
        )}

        {!dnsStatus && !isChecking && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Haz clic en "Verificar Registros DNS" para comprobar tu configuración actual.
          </div>
        )}
      </div>
    </div>
  );
}

function DnsRecordRow({ name, description, status }: { name: string, description: string, status: any }) {
  return (
    <div className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex-shrink-0 mt-0.5">
        {status.ok ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
        )}
      </div>
      <div className="ml-3 flex-1 overflow-hidden">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
        <div className="mt-2 p-2 bg-gray-800 text-gray-200 text-xs rounded font-mono overflow-x-auto whitespace-pre-wrap break-all">
          {status.value}
        </div>
        {!status.ok && status.message && (
          <p className="text-xs text-red-600 mt-2 font-medium">{status.message}</p>
        )}
      </div>
    </div>
  );
}
