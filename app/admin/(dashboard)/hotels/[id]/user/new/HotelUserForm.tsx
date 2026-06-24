"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createHotelUserAction } from "@/modules/b2b/b2b.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HotelUserForm({ hotelId, hotelName, hotelEmail }: { hotelId: string, hotelName: string, hotelEmail: string | null }) {
  const router = useRouter();
  const [data, setData] = useState({
    hotelId,
    fullName: "",
    email: hotelEmail || "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await createHotelUserAction(data);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push("/admin/hotels");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mt-6">
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
        <h4 className="font-semibold text-gray-900 border-b pb-2">Datos de Acceso para {hotelName}</h4>
        
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-gray-700">Nombre de la persona o rol</Label>
          <Input 
            id="fullName" 
            name="fullName" 
            value={data.fullName} 
            onChange={handleChange} 
            placeholder="Ej: Recepción Central" 
            className="text-gray-900 bg-white"
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">Correo Electrónico (Usuario)</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={data.email} 
            onChange={handleChange} 
            className="text-gray-900 bg-white"
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            value={data.password} 
            onChange={handleChange} 
            className="text-gray-900 bg-white"
            required 
            minLength={6}
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/hotels")} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Acceso B2B"}
          </Button>
        </div>
      </div>
    </form>
  );
}
