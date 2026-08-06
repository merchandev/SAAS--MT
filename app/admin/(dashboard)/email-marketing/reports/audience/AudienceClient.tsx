"use client";

import { Card } from "@/components/ui/card";
import { Users, UserCheck, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AudienceClientProps {
  totalContacts: number;
  activeContacts: number;
  growthData: { date: string; total: number; nuevos: number }[];
}

export default function AudienceClient({ totalContacts, activeContacts, growthData }: AudienceClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reporte de Audiencia</h1>
          <p className="text-muted-foreground">Análisis de crecimiento y estado de tus suscriptores.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Suscriptores</p>
              <h2 className="text-3xl font-bold">{totalContacts}</h2>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contactos Activos (Con Consentimiento)</p>
              <h2 className="text-3xl font-bold">{activeContacts}</h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Crecimiento (Últimos 30 días)</p>
              <h2 className="text-3xl font-bold">
                {growthData.reduce((acc, curr) => acc + curr.nuevos, 0)} Nuevos
              </h2>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Crecimiento de la Audiencia</h3>
        {growthData.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="total" name="Total Acumulado" stroke="#4f46e5" fill="#e0e7ff" />
                <Area type="monotone" dataKey="nuevos" name="Nuevos Contactos" stroke="#16a34a" fill="#dcfce7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg">
            No hay datos suficientes para graficar el crecimiento.
          </div>
        )}
      </Card>
    </div>
  );
}
