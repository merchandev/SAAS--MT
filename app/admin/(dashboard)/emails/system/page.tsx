import { requireRole } from "@/modules/auth/permissions";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/admin/Header";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default async function SystemEmailDashboard() {
  await requireRole(["SUPER_ADMIN"]);

  // Obtener estado del worker
  const heartbeats = await prisma.emailWorkerHeartbeat.findMany({
    orderBy: { lastSeenAt: 'desc' }
  });

  // Estadísticas de colas
  const queueStats = await prisma.outboundEmail.groupBy({
    by: ['status'],
    _count: { id: true }
  });

  const queued = queueStats.find(q => q.status === 'QUEUED')?._count.id || 0;
  const deferred = queueStats.find(q => q.status === 'DEFERRED')?._count.id || 0;
  const processing = queueStats.find(q => q.status === 'PROCESSING')?._count.id || 0;

  // Supresiones
  const suppressedCount = await prisma.emailSuppression.count();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Estado del Sistema de Correo" />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Métricas de la Cola</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm font-medium text-indigo-600">En Cola</p>
                <p className="mt-2 text-3xl font-bold text-indigo-900">{queued}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-600">Retrasados (Deferred)</p>
                <p className="mt-2 text-3xl font-bold text-yellow-900">{deferred}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-600">Procesando</p>
                <p className="mt-2 text-3xl font-bold text-blue-900">{processing}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-600">Lista de Supresión</p>
                <p className="mt-2 text-3xl font-bold text-red-900">{suppressedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Workers Activos</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostname</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Conexión</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {heartbeats.map(h => {
                    const isAlive = (Date.now() - h.lastSeenAt.getTime()) < 60000;
                    return (
                      <tr key={h.workerId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{h.workerId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{h.hostname}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDistanceToNow(h.lastSeenAt, { addSuffix: true, locale: es })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isAlive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {isAlive ? 'Activo' : 'Caído'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {heartbeats.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay workers registrados. El servicio podría estar apagado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
