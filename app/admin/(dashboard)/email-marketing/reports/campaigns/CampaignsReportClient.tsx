"use client";

import { Card } from "@/components/ui/card";
import { Mail, MousePointerClick, Percent } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CampaignsClientProps {
  campaignsData: {
    name: string;
    openRate: number;
    clickRate: number;
    deliveryRate: number;
  }[];
  avgOpenRate: number;
  avgClickRate: number;
  totalSent: number;
}

export default function CampaignsReportClient({
  campaignsData,
  avgOpenRate,
  avgClickRate,
  totalSent
}: CampaignsClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reporte de Campañas</h1>
          <p className="text-muted-foreground">Comparativa de rendimiento entre campañas enviadas.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Apertura Promedio</p>
              <h2 className="text-3xl font-bold">{avgOpenRate.toFixed(1)}%</h2>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <MousePointerClick className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Clics Promedio</p>
              <h2 className="text-3xl font-bold">{avgClickRate.toFixed(1)}%</h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Volumen Total Enviado</p>
              <h2 className="text-3xl font-bold">{totalSent}</h2>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Comparativa de Tasas por Campaña (%)</h3>
        {campaignsData.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="deliveryRate" name="Tasa Entrega" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="openRate" name="Tasa Apertura" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clickRate" name="Tasa Clics" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg">
            No hay suficientes campañas para comparar.
          </div>
        )}
      </Card>
    </div>
  );
}
