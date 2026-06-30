import { SystemCacheButton } from "./SystemCacheButton";

export const dynamic = "force-dynamic";

export default function SystemPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h3 className="text-2xl font-bold tracking-tight">Sistema y Mantenimiento</h3>
        <p className="text-gray-500">
          Herramientas de administración avanzada para el correcto funcionamiento de la plataforma.
        </p>
      </div>

      <SystemCacheButton />
    </div>
  );
}
