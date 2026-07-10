"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDays = searchParams.get("days") || "30daysAgo";

  const handleValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set("days", value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-48">
      <select 
        value={currentDays} 
        onChange={handleValueChange}
        className="w-full bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
      >
        <option value="7daysAgo">Últimos 7 días</option>
        <option value="30daysAgo">Últimos 30 días</option>
        <option value="60daysAgo">Últimos 60 días</option>
        <option value="90daysAgo">Últimos 90 días</option>
        <option value="120daysAgo">Últimos 120 días</option>
        <option value="2020-01-01">Desde siempre</option>
      </select>
    </div>
  );
}
