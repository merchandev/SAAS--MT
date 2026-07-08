"use client";
import { useState } from "react";
import { forgotPasswordAction } from "@/modules/auth/recovery.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    try {
      const result = await forgotPasswordAction(email);
      if (result?.error) {
        setError(result.error);
        setIsPending(false);
        return;
      }
      
      setSuccess(true);
      setIsPending(false);
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Recuperar Acceso</h1>
        <p className="text-gray-400">Ingresa tu correo para recibir un enlace de recuperación.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        {success ? (
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Revisa tu bandeja de entrada</h3>
              <p className="text-sm text-gray-400">
                Si el correo está registrado en nuestro sistema, en breve recibirás un enlace seguro para restablecer tu contraseña.
              </p>
            </div>
            <Link href="/login" className="inline-block mt-4 text-[#D4AF37] hover:text-white font-semibold transition-colors">
              Volver a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Correo Electrónico</label>
              <Input
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
                className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8B2C] hover:from-[#C5A030] hover:to-[#997A25] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg group"
            >
              {isPending ? "Procesando..." : (
                <div className="flex items-center justify-center gap-2">
                  Recuperar Contraseña
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        )}

        {!success && (
          <div className="mt-8 text-center text-sm text-gray-400">
            <Link href="/login" className="flex items-center justify-center gap-2 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver al Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
