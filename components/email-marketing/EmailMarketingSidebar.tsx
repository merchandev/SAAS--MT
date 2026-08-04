"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Send,
  LayoutTemplate,
  BarChart,
  Settings,
  ShieldCheck,
  Globe,
  MailWarning,
  Workflow,
  Tags,
  Filter,
  UserX
} from "lucide-react";
import { cn } from "@/lib/utils";

type SubMenuItem = {
  name: string;
  href: string;
  icon?: any;
};

type MenuItem = {
  name: string;
  href?: string;
  icon: any;
  items?: SubMenuItem[];
};

const navigation: MenuItem[] = [
  {
    name: "Dashboard",
    href: "/admin/email-marketing",
    icon: LayoutDashboard,
  },
  {
    name: "Suscriptores",
    icon: Users,
    items: [
      { name: "Contactos", href: "/admin/email-marketing/contacts", icon: Users },
      { name: "Listas", href: "/admin/email-marketing/lists", icon: LayoutTemplate },
      { name: "Segmentos", href: "/admin/email-marketing/segments", icon: Filter },
      { name: "Etiquetas", href: "/admin/email-marketing/tags", icon: Tags },
      { name: "Supresiones", href: "/admin/email-marketing/suppressions", icon: UserX },
    ],
  },
  {
    name: "Campañas",
    icon: Send,
    items: [
      { name: "Todas", href: "/admin/email-marketing/campaigns" },
      { name: "Nueva Campaña", href: "/admin/email-marketing/campaigns/new" },
    ],
  },
  {
    name: "Plantillas",
    href: "/admin/email-marketing/templates",
    icon: LayoutTemplate,
  },
  {
    name: "Informes",
    icon: BarChart,
    items: [
      { name: "Resumen", href: "/admin/email-marketing/reports" },
      { name: "Campañas", href: "/admin/email-marketing/reports/campaigns" },
      { name: "Audiencia", href: "/admin/email-marketing/reports/audience" },
      { name: "Entregabilidad", href: "/admin/email-marketing/reports/deliverability" },
    ],
  },
  {
    name: "Configuración del Canal",
    icon: Settings,
    items: [
      { name: "Dominios", href: "/admin/email-marketing/settings/domains", icon: Globe },
      { name: "Remitentes", href: "/admin/email-marketing/settings/senders", icon: ShieldCheck },
      { name: "DNS y Autenticación", href: "/admin/email-marketing/settings/authentication", icon: ShieldCheck },
      { name: "Estado del Sistema", href: "/admin/email-marketing/settings/system", icon: MailWarning },
    ],
  },
];

export function EmailMarketingSidebar() {
  const pathname = usePathname();

  function isItemActive(href: string) {
    if (href === "/admin/email-marketing") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function isGroupActive(items?: SubMenuItem[]) {
    if (!items) return false;
    return items.some((item) => isItemActive(item.href));
  }

  return (
    <div className="w-full md:w-64 bg-gray-50/80 border-r border-gray-200 flex flex-col flex-shrink-0 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-800 tracking-tight uppercase flex items-center">
          <Send className="w-4 h-4 mr-2 text-indigo-600" />
          Email Marketing
        </h2>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-6">
        {navigation.map((group) => {
          const Icon = group.icon;
          const groupActive = isGroupActive(group.items);
          
          if (!group.items) {
            const active = isItemActive(group.href!);
            return (
              <Link
                key={group.name}
                href={group.href!}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("w-4 h-4", active ? "text-indigo-600" : "text-gray-400")} />
                {group.name}
              </Link>
            );
          }

          return (
            <div key={group.name} className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <Icon className="w-4 h-4" />
                {group.name}
              </div>
              <div className="pl-9 space-y-1">
                {group.items.map((item) => {
                  const active = isItemActive(item.href);
                  const ItemIcon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                        active
                          ? "bg-indigo-50 text-indigo-700 font-medium"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      )}
                    >
                      {ItemIcon && <ItemIcon className={cn("w-3.5 h-3.5", active ? "text-indigo-500" : "text-gray-400")} />}
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
