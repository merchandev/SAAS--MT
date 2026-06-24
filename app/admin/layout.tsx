"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/modules/auth/auth.actions";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // No renderizar el layout en la página de login
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Reservas", href: "/admin/bookings" },
    { name: "Vehículos", href: "/admin/vehicles" },
    { name: "Hoteles", href: "/admin/hotels" },
    { name: "Pagos", href: "/admin/payments" },
    { name: "Ajustes", href: "/admin/settings" },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
          <h1 className="text-xl font-bold text-gray-900">MeTransfers</h1>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
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
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              Cerrar Sesión
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {pathname.split("/").pop() || "Panel"}
          </h2>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
