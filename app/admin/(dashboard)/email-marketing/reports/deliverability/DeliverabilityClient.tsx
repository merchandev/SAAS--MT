"use client";

import { Card } from "@/components/ui/card";
import { ShieldAlert, MailX, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DeliverabilityClientProps {
  totalSuppressions: number;
  totalHardBounces: number;
  totalComplaints: number;
  bounceReasons: { reason: string; count: number }[];
}

export default function DeliverabilityClient({
  totalSuppressions,
  totalHardBounces,
  totalComplaints,
  bounceReasons,
}: DeliverabilityClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reporte de Entregabilidad</h1>
          <p className="text-muted-foreground">Monitoreo de reputación, rebotes y quejas de spam.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <MailX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Hard Bounces</p>
              <h2 className="text-3xl font-bold">{totalHardBounces}</h2>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Quejas de Spam</p>
              <h2 className="text-3xl font-bold">{totalComplaints}</h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <ShieldAlert className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Supresiones</p>
              <h2 className="text-3xl font-bold">{totalSuppressions}</h2>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Motivos de Supresión (Distribución)</h3>
        {bounceReasons.length > 0 ? (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bounceReasons} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="reason" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" name="Cantidad" fill="#ef4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-muted-foreground bg-gray-50 rounded-lg">
            Aún no hay supresiones o rebotes registrados.
          </div>
        )}
      </Card>
    </div>
  );
}
