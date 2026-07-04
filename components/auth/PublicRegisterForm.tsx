"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerAction } from "@/modules/auth/auth.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PublicRegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;
    const preferredLanguage = formData.get("preferredLanguage") as "es" | "en" | "de" | "fr";
    const password = formData.get("password") as string;

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setIsPending(false);
      return;
    }

    try {
      const result = await registerAction({
        fullName,
        email,
        phone,
        country,
        preferredLanguage,
        password,
      });

      if (result?.error) {
        setError(result.error);
        setIsPending(false);
        return;
      }

      if (result?.redirect) {
        router.push(result.redirect);
      }
    } catch {
      setError("Ocurrió un error inesperado al registrarse.");
      setIsPending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2">Crear cuenta</h1>
        <p className="text-gray-400">Registro exclusivo para clientes Transfers in Barcelona.</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nombre completo <span className="text-[#D4AF37]">*</span></label>
            <Input
              name="fullName"
              type="text"
              required
              minLength={2}
              placeholder="Juan Pérez"
              className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Correo electrónico <span className="text-[#D4AF37]">*</span></label>
            <Input
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Teléfono <span className="text-[#D4AF37]">*</span></label>
            <Input
              name="phone"
              type="tel"
              required
              placeholder="+34 600 000 000"
              className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">País <span className="text-[#D4AF37]">*</span></label>
              <Input
                name="country"
                type="text"
                required
                placeholder="España"
                className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Idioma</label>
              <select
                name="preferredLanguage"
                defaultValue="es"
                className="h-10 w-full rounded-xl border border-white/10 bg-black/50 px-3 text-sm text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Contraseña <span className="text-[#D4AF37]">*</span></label>
            <Input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="********"
              className="bg-black/50 border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37] placeholder:text-gray-600 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8B2C] hover:from-[#C5A030] hover:to-[#997A25] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg group mt-2"
          >
            {isPending ? "Creando cuenta..." : (
              <div className="flex items-center justify-center gap-2">
                Completar registro
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[#D4AF37] hover:text-white font-semibold transition-colors">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
