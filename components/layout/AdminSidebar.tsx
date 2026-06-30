"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Banknote,
  Building2,
  Car,
  ChevronLeft,
  ChevronRight,
  Gauge,
  HardDrive,
  Hotel,
  LogOut,
  Settings,
  Tags,
  Trash2,
  UserCog,
  Users,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { logoutAction } from "@/modules/auth/auth.actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  role: string;
  companyName?: string;
  logoUrl?: string;
  accentColor?: string;
}

type NavigationItem = {
  name: string;
  href: string;
  roles: string[];
  icon: LucideIcon;
};

export function AdminSidebar({ role, companyName = "MeTransfers", logoUrl, accentColor = "#D4AF37" }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("admin-sidebar-collapsed") === "true";
  });

  function toggleCollapsed() {
    setIsCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("admin-sidebar-collapsed", String(next));
      return next;
    });
  }

  const allNavigation: NavigationItem[] = [
    { name: "Dashboard", href: "/admin/dashboard", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"], icon: Gauge },
    { name: "Reservas", href: "/admin/bookings", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"], icon: ClipboardList },
    { name: "Papelera", href: "/admin/bookings/trash", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"], icon: Trash2 },
    { name: "Clientes", href: "/admin/customers", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"], icon: Users },
    { name: "Vehículos", href: "/admin/vehicles", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"], icon: Car },
    { name: "Conductores", href: "/admin/drivers", roles: ["SUPER_ADMIN", "ADMIN", "OPERATOR"], icon: UserCog },
    { name: "Hoteles", href: "/admin/hotels", roles: ["SUPER_ADMIN", "ADMIN"], icon: Hotel },
    { name: "Agencias", href: "/admin/agencies", roles: ["SUPER_ADMIN", "ADMIN"], icon: Building2 },
    { name: "Pagos", href: "/admin/payments", roles: ["SUPER_ADMIN", "ADMIN"], icon: Banknote },
    { name: "Precios", href: "/admin/pricing", roles: ["SUPER_ADMIN", "ADMIN"], icon: Tags },
    { name: "Usuarios", href: "/admin/users", roles: ["SUPER_ADMIN", "ADMIN"], icon: Users },
    { name: "Ajustes", href: "/admin/settings", roles: ["SUPER_ADMIN", "ADMIN"], icon: Settings },
    { name: "Sistema", href: "/admin/system", roles: ["SUPER_ADMIN", "ADMIN"], icon: HardDrive },
  ];

  const navigation = allNavigation.filter((item) => item.roles.includes(role));

  function isItemActive(item: NavigationItem) {
    if (item.href === "/admin/bookings") {
      return pathname === "/admin/bookings" || (pathname.startsWith("/admin/bookings/") && !pathname.startsWith("/admin/bookings/trash"));
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <aside
      className={cn(
        "w-full bg-white border-r border-gray-200 flex flex-col transition-[width] duration-200 ease-in-out relative",
        isCollapsed ? "md:w-20" : "md:w-64"
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-gray-200", isCollapsed ? "justify-center px-0" : "px-4")}>
        <Link href="/admin/dashboard" className="relative block w-full h-10">
          <img
            src="/images/MeTransfers-exp.png"
            alt={companyName}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 left-0 h-9 w-auto object-contain transition-opacity duration-500 ease-in-out",
              isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
          />
          <img
            src="/images/MeTransfers-x.png"
            alt="MT"
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-9 w-auto object-contain transition-opacity duration-500 ease-in-out",
              isCollapsed ? "opacity-100 left-1/2 -translate-x-1/2" : "opacity-0 left-0 pointer-events-none"
            )}
          />
        </Link>
      </div>

      <button
        type="button"
        onClick={toggleCollapsed}
        className="hidden md:flex absolute -right-3 top-5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900 shadow-sm rounded-full w-6 h-6 items-center justify-center z-50 transition-colors"
        aria-label={isCollapsed ? "Expandir menú lateral" : "Contraer menú lateral"}
        title={isCollapsed ? "Expandir menú lateral" : "Contraer menú lateral"}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const active = isItemActive(item);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                "group flex h-10 items-center rounded-md px-2 text-sm font-medium transition-colors",
                isCollapsed ? "justify-center" : "gap-3",
                active
                  ? "bg-gray-100 text-gray-950"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-950"
              )}
              style={active ? { boxShadow: `inset 0 0 0 1px ${accentColor}` } : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="outline"
            className={cn(
              "w-full text-red-600 hover:text-red-700 hover:bg-red-50",
              isCollapsed ? "justify-center px-0" : "justify-start"
            )}
            title={isCollapsed ? "Cerrar sesión" : undefined}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && "Cerrar sesión"}
          </Button>
        </form>
      </div>
    </aside>
  );
}
