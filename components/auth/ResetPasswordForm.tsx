"use client";
import { useState } from "react";
import { resetPasswordAction } from "@/modules/auth/recovery.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!token) {
      setError("No hay un token de recuperación válido en la URL.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsPending(true);

    try {
      const result = await resetPasswordAction(token, password);
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

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Contraseña Actualizada</h3>
          <p className="text-sm text-gray-400">
            Tu contraseña ha sido cambiada exitosamente. Ya puedes iniciar sesión con tus nuevas credenciales.
          </p>
        </div>
        <Link href="/login" className="inline-block mt-4 w-full bg-[#D4AF37] hover:bg-[#C5A030] text-black font-bold py-3 rounded-xl transition-colors">
          Ir al Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Nueva Contraseña</h1>
        <p className="text-gray-400">Ingresa tu nueva contraseña para acceder a tu cuenta.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nueva Contraseña</label>
            <Input
              name="password"
              type="password"
              required
              minLength={10}
              placeholder="Mínimo 10 caracteres"
              className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Confirmar Contraseña</label>
            <Input
              name="confirmPassword"
              type="password"
              required
              minLength={10}
              placeholder="Repite tu contraseña"
              className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8B2C] hover:from-[#C5A030] hover:to-[#997A25] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg group"
          >
            {isPending ? "Guardando..." : (
              <div className="flex items-center justify-center gap-2">
                Actualizar Contraseña
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
