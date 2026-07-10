import { 
  getAnalyticsKPIs, 
  getTrafficSources, 
  getTopPages, 
  getTrafficTrend,
  getTrafficCountries,
  getTrafficDevices,
  getEmailCampaignTraffic
} from "@/lib/google-analytics";
import { requireRole } from "@/modules/auth/permissions";
import { Users, Eye, MousePointerClick, ArrowUpRight, Mail, Globe, Smartphone } from "lucide-react";
import AnalyticsCharts from "./AnalyticsCharts";
import DateFilter from "./DateFilter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Estadísticas Web | Admin",
};

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const days = typeof searchParams.days === "string" ? searchParams.days : "30daysAgo";
  
  const titleText = days === "7daysAgo" ? "Últimos 7 días" 
    : days === "30daysAgo" ? "Últimos 30 días"
    : days === "60daysAgo" ? "Últimos 60 días"
    : days === "90daysAgo" ? "Últimos 90 días"
    : days === "120daysAgo" ? "Últimos 120 días"
    : "Desde siempre";

  const [kpis, sources, topPages, trend, countries, devices, emailTraffic] = await Promise.all([
    getAnalyticsKPIs(days),
    getTrafficSources(days),
    getTopPages(days),
    getTrafficTrend(days),
    getTrafficCountries(days),
    getTrafficDevices(days),
    getEmailCampaignTraffic(days)
  ]);

  if (!kpis) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas Web</h1>
          <p className="text-gray-500">Integración con Google Analytics 4</p>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <p>Error al cargar los datos de Google Analytics. Por favor, verifica que la Cuenta de Servicio tiene permisos de Lector en la propiedad de GA4 o que el Property ID es correcto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estadísticas Web ({titleText})</h1>
          <p className="text-gray-500">Datos obtenidos en tiempo real desde Google Analytics 4</p>
        </div>
        <DateFilter />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-sm">Usuarios Totales</h3>
          </div>
          <p className="text-3xl font-black text-gray-900">{parseInt(kpis.totalUsers).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <ArrowUpRight className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-sm">Usuarios Activos</h3>
          </div>
          <p className="text-3xl font-black text-gray-900">{parseInt(kpis.activeUsers).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <MousePointerClick className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-sm">Sesiones</h3>
          </div>
          <p className="text-3xl font-black text-gray-900">{parseInt(kpis.sessions).toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Eye className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-sm">Vistas de Página</h3>
          </div>
          <p className="text-3xl font-black text-gray-900">{parseInt(kpis.pageViews).toLocaleString()}</p>
        </div>
      </div>

      {/* Traffic Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Tráfico ({titleText})</h3>
          <div className="h-[300px]">
            <AnalyticsCharts type="trend" data={trend} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-500" />
              Impacto de Campañas Email
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-indigo-600 font-medium mb-1">Sesiones</p>
                <p className="text-2xl font-black text-indigo-900">{parseInt(emailTraffic.sessions).toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">Usuarios</p>
                <p className="text-2xl font-black text-blue-900">{parseInt(emailTraffic.activeUsers).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">Datos basados en tráfico etiquetado como "Email" por Google Analytics.</p>
          </div>
          <hr className="border-gray-100" />
          <div className="flex-1">
             <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-pink-500" />
              Dispositivos
            </h3>
            <div className="h-[180px]">
              <AnalyticsCharts type="devices" data={devices} />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-green-500" />
            Top Países
          </h3>
          <div className="h-[300px]">
            <AnalyticsCharts type="countries" data={countries} />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Fuentes de Tráfico</h3>
          <div className="h-[300px]">
            <AnalyticsCharts type="sources" data={sources} />
          </div>
        </div>
      </div>

      {/* Top Pages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Páginas Más Visitadas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Página</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ruta</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Vistas</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topPages.map((page, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{page.title || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{page.path}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{page.views.toLocaleString()}</td>
                </tr>
              ))}
              {topPages.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">No hay datos suficientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
