import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PricingPage() { 
  return (
    <div className="space-y-6 max-w-5xl mx-auto pt-6">
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-gray-900">Estructura de Precios</h3>
        <p className="text-gray-500 mt-2">Configuración de tarifas base, suplementos nocturnos y festivos.</p>
      </div>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Módulo en Desarrollo</CardTitle>
          <CardDescription>Esta sección se activará en la siguiente fase de desarrollo.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p className="text-lg">Próximamente disponible</p>
        </CardContent>
      </Card>
    </div>
  ) 
}
