"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/modules/auth/auth.actions";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
  role: string;
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();

  // Define full navigation
  const allNavigation = [
    { name: "Dashboard", href: "/admin/dashboard", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"] },
    { name: "Reservas", href: "/admin/bookings", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"] },
    { name: "Clientes", href: "/admin/customers", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"] },
    { name: "Vehículos", href: "/admin/vehicles", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"] },
    { name: "Conductores", href: "/admin/drivers", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"] },
    { name: "Hoteles", href: "/admin/hotels", roles: ["SUPER_ADMIN", "ADMIN"] },
    { name: "Agencias", href: "/admin/agencies", roles: ["SUPER_ADMIN", "ADMIN"] },
    { name: "Pagos", href: "/admin/payments", roles: ["SUPER_ADMIN", "ADMIN"] },
    { name: "Precios", href: "/admin/pricing", roles: ["SUPER_ADMIN", "ADMIN"] },
    { name: "Ajustes", href: "/admin/settings", roles: ["SUPER_ADMIN", "ADMIN"] },
  ];

  // Filter based on user role
  const navigation = allNavigation.filter(item => item.roles.includes(role));

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
        <h1 className="text-xl font-bold text-gray-900">MeTransfers</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <form action={logoutAction}>
          <Button type="submit" variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            Cerrar Sesión
          </Button>
        </form>
      </div>
    </aside>
  );
}
