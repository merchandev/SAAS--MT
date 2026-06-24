"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/modules/auth/auth.actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await loginAction({ email, password });
    
    if (result && result.error) {
      setError(result.error);
      setIsLoading(false);
    }
    // Si es exitoso, loginAction maneja el redirect internamente.
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#D4AF37] to-[#AA8B2C] rounded-sm flex items-center justify-center text-[#0B0C10] font-serif font-bold text-3xl shadow-lg shadow-[#D4AF37]/20">
          MT
        </div>
        <h2 className="mt-8 text-center text-3xl font-serif font-bold text-white tracking-wide">
          Acceso Exclusivo
        </h2>
        <p className="mt-3 text-center text-sm font-medium tracking-[0.2em] uppercase text-[#D4AF37]">
          MeTransfers Partners
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#13151A] py-10 px-6 shadow-2xl sm:rounded-sm sm:px-10 border border-white/5 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] rounded-full blur-[80px] opacity-10 pointer-events-none"></div>

          <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-950/50 text-red-400 p-4 rounded-sm text-sm font-medium border border-red-900/50">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="email" className="block text-xs font-medium tracking-wide uppercase text-gray-400">
                Correo Electrónico
              </Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full h-12 px-4 bg-[#0B0C10] border border-white/10 text-white rounded-sm placeholder-gray-600 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                  placeholder="admin@metransfers.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-xs font-medium tracking-wide uppercase text-gray-400">
                Contraseña
              </Label>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full h-12 px-4 bg-[#0B0C10] border border-white/10 text-white rounded-sm placeholder-gray-600 focus:outline-none focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 h-14 border border-transparent rounded-sm shadow-sm text-lg font-medium text-[#0B0C10] bg-[#D4AF37] hover:bg-[#C5A059] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all"
              >
                {isLoading ? "Verificando Credenciales..." : "Ingresar al Panel"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
