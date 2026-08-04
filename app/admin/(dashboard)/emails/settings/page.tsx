"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";

export default function EmailSettingsPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [dnsStatus, setDnsStatus] = useState<any>(null);

  const handleCheckDns = async () => {
    setIsChecking(true);
    // Simulated DNS check for demo purposes. In a real scenario, call an API that uses `dns` module
    setTimeout(() => {
      setDnsStatus({
        spf: { ok: true, value: "v=spf1 mx a include:_spf.transfersinbarcelona.com ~all" },
        dkim: { ok: true, value: "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG..." },
        dmarc: { ok: false, value: "Not found", message: "Missing _dmarc TXT record" },
        mx: { ok: true, value: "mail.transfersinbarcelona.com" },
      });
      setIsChecking(false);
    }, 1500);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Email Infrastructure Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure your self-hosted email parameters and verify DNS records.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold">Domain & Deliverability Verification</h2>
            <p className="text-sm text-gray-500">Domain: <span className="font-medium text-gray-800">transfersinbarcelona.com</span></p>
          </div>
          <button 
            onClick={handleCheckDns}
            disabled={isChecking}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 flex items-center"
          >
            {isChecking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Check DNS Records
          </button>
        </div>

        {dnsStatus && (
          <div className="space-y-4">
            <DnsRecordRow 
              name="SPF (Sender Policy Framework)" 
              description="Authorizes your server to send emails on behalf of your domain."
              status={dnsStatus.spf}
            />
            <DnsRecordRow 
              name="DKIM (DomainKeys Identified Mail)" 
              description="Cryptographic signature that ensures the email hasn't been tampered with."
              status={dnsStatus.dkim}
            />
            <DnsRecordRow 
              name="DMARC (Domain-based Message Authentication)" 
              description="Tells receiving servers what to do if SPF or DKIM fails."
              status={dnsStatus.dmarc}
            />
            <DnsRecordRow 
              name="MX (Mail Exchanger)" 
              description="Points to your mail server to receive bounces."
              status={dnsStatus.mx}
            />
          </div>
        )}

        {!dnsStatus && !isChecking && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Click "Check DNS Records" to verify your current domain setup.
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Rate Limits & Warmup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Global Rate Limit (Emails / minute)</label>
            <input type="number" disabled value={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50" />
            <p className="text-xs text-gray-500 mt-1">Locked by Hostinger VPS limits</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Daily Marketing Limit</label>
            <input type="number" disabled value={5000} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50" />
            <p className="text-xs text-gray-500 mt-1">Max configurable rate</p>
          </div>
        </div>
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
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
        <div className="mt-2 p-2 bg-gray-800 text-gray-200 text-xs rounded font-mono overflow-x-auto">
          {status.value}
        </div>
        {!status.ok && status.message && (
          <p className="text-xs text-red-600 mt-2 font-medium">{status.message}</p>
        )}
      </div>
    </div>
  );
}
