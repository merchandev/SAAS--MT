"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
  data: { name: string; value: number }[];
}

const COLORS: Record<string, string> = {
  'PENDING_PAYMENT': '#facc15',
  'PAID': '#3b82f6',
  'CONFIRMADA': '#60a5fa',
  'ASIGNADA': '#818cf8',
  'EN_CURSO': '#c084fc',
  'COMPLETADA': '#22c55e',
  'CANCELADA': '#ef4444',
  'NO_SHOW': '#9ca3af',
  'REEMBOLSADA': '#f97316',
};

const DEFAULT_COLOR = '#cbd5e1';

export function StatusChart({ data }: Props) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || DEFAULT_COLOR} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-xs text-gray-600 font-medium">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
