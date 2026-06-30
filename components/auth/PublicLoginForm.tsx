"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "@/modules/auth/auth.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PublicLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    try {
      const result = await loginAction({ email, password });
      if (result?.error) {
        setError(result.error);
        setIsPending(false);
        return;
      }
      
      if (result?.redirect) {
        router.push(result.redirect);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Bienvenido de nuevo</h1>
        <p className="text-gray-400">Ingresa tus credenciales para acceder a tu cuenta.</p>
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
            <label className="text-sm font-medium text-gray-300">Correo Electrónico</label>
            <Input
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-300">Contraseña</label>
              <Link href="#" className="text-xs text-[#D4AF37] hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
            <Input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8B2C] hover:from-[#C5A030] hover:to-[#997A25] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg group"
          >
            {isPending ? "Iniciando sesión..." : (
              <div className="flex items-center justify-center gap-2">
                Ingresar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-[#D4AF37] hover:text-white font-semibold transition-colors">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
