import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AgenciesPage() { 
  return (
    <div className="space-y-6 max-w-5xl mx-auto pt-6">
      <div>
        <h3 className="text-3xl font-bold tracking-tight text-gray-900">Agencias (B2B)</h3>
        <p className="text-gray-500 mt-2">Gestión de agencias de viajes asociadas y comisiones.</p>
      </div>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Módulo en Desarrollo</CardTitle>
          <CardDescription>Esta sección se activará en la siguiente fase de desarrollo.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <p className="text-lg">Próximamente disponible</p>
        </CardContent>
      </Card>
    </div>
  ) 
}
