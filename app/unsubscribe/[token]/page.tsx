"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function UnsubscribePage() {
  const { token } = useParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    let mounted = true;

    async function doUnsubscribe() {
      if (!token) {
        if (mounted) setStatus("error");
        return;
      }

      try {
        const res = await fetch(`/api/email/unsubscribe/${token}`, { method: "POST" });
        if (mounted) {
          setStatus(res.ok ? "success" : "error");
        }
      } catch (e) {
        if (mounted) setStatus("error");
      }
    }

    doUnsubscribe();
    return () => { mounted = false; };
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Preferencias de correo
        </h1>
        
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Procesando tu solicitud...</p>
          </div>
        )}
        
        {status === "success" && (
          <div className="py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700 text-lg">
              Has sido dado de baja correctamente. Ya no recibirás más correos de marketing de nuestra parte.
            </p>
          </div>
        )}
        
        {status === "error" && (
          <div className="py-4">
             <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-700">
              El enlace es inválido o ya fuiste dado de baja previamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
