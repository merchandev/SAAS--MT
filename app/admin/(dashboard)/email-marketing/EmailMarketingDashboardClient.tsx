"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Send,
  MousePointerClick,
  MailWarning,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface DashboardProps {
  metrics: {
    totalContacts: number;
    activeContacts: number;
    activePercentage: string;
    totalSent: number;
    deliveryRate: string;
    openRate: string;
    bounceRate: string;
  };
  dailyData: any[];
  recentCampaigns: any[];
}

export default function EmailMarketingDashboardClient({ metrics, dailyData, recentCampaigns }: DashboardProps) {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Resumen del rendimiento de email marketing.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <Link href="/admin/email-marketing/contacts" className={buttonVariants({ variant: "outline" })}>
            Añadir Contactos
          </Link>
          <Link href="/admin/email-marketing/campaigns/new" className={buttonVariants()}>
            Crear Campaña
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Contactos Activos</CardTitle>
            <Users className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.activeContacts}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">{metrics.activePercentage}%</span> del total ({metrics.totalContacts})
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tasa de Entrega</CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.deliveryRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              De {metrics.totalSent} correos enviados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tasa de Apertura</CardTitle>
            <MousePointerClick className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.openRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              Promedio general
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tasa de Rebote</CardTitle>
            <MailWarning className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metrics.bounceRate}%</div>
            <p className="text-xs text-gray-500 mt-1">
              Hard bounces y rechazos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Rendimiento de Campañas (Últimos 7 días)</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {dailyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="entregados" stroke="#10b981" name="Entregados" strokeWidth={2} />
                  <Line yAxisId="left" type="monotone" dataKey="aperturas" stroke="#3b82f6" name="Aperturas" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="rebotes" stroke="#f97316" name="Rebotes" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                <p>No hay datos suficientes para mostrar el gráfico.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3 overflow-hidden">
          <CardHeader>
            <CardTitle>Campañas Recientes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentCampaigns.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentCampaigns.map((camp) => (
                  <div key={camp.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-gray-900 truncate max-w-[200px]">{camp.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        camp.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        camp.status === 'SENDING' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-4 mt-2">
                      <span className="flex items-center" title="Enviados">
                        <Send className="w-3 h-3 mr-1" /> {camp.totalCount}
                      </span>
                      <span className="flex items-center text-green-600" title="Entregados">
                        <Activity className="w-3 h-3 mr-1" /> {camp.deliveredCount}
                      </span>
                      <span className="flex items-center text-blue-600" title="Aperturas">
                        <MousePointerClick className="w-3 h-3 mr-1" /> {camp.openedCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-gray-500 text-sm">
                <p>No hay campañas recientes.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
