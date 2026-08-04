import { Suspense } from "react";
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  Send,
  MousePointerClick,
  MailWarning
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function EmailMarketingDashboard() {
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
            <div className="text-2xl font-bold text-gray-900">--</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">--%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tasa de Entrega</CardTitle>
            <Send className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">--%</div>
            <p className="text-xs text-gray-500 mt-1">
              Emails entregados con éxito
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tasa de Apertura</CardTitle>
            <MousePointerClick className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">--%</div>
            <p className="text-xs text-gray-500 mt-1">
              Promedio en últimos 30 días
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tasa de Rebote</CardTitle>
            <MailWarning className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">--%</div>
            <p className="text-xs text-gray-500 mt-1">
              Hard bounces y rechazos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Rendimiento de Campañas</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t border-gray-100 bg-gray-50/50">
            <div className="text-center text-gray-500">
              <BarChart className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              <p>Datos en procesamiento. El worker de analíticas generará los reportes próximamente.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t border-gray-100 bg-gray-50/50">
            <div className="text-center text-gray-500">
              <p>No hay actividad reciente.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
