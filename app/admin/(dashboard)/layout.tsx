import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { authService } from "@/modules/auth/auth.service";
import { settingsQueries } from "@/modules/settings/settings.queries";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await authService.getSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  // Add explicit server-side role verification
  const { requireRole } = await import("@/modules/auth/permissions");
  await requireRole(["SUPER_ADMIN", "ADMIN", "OPERATOR"]);
  const settings = await settingsQueries.getAllSettings();

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-gray-50">
      {/* Sidebar - Componente Cliente */}
      <AdminSidebar
        role={session.role}
        companyName={settings.SITE_NAME || settings.COMPANY_NAME}
        logoUrl={settings.SITE_LOGO_URL}
        accentColor={settings.BRAND_ACCENT_COLOR}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            Panel de Control
          </h2>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
