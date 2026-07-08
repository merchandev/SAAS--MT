import { prisma } from "@/lib/prisma";
import { requireRole } from "@/modules/auth/permissions";
import { DEFAULT_TEMPLATES } from "@/config/email-templates";
import { TemplateEditorClient } from "./TemplateEditorClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Editar Plantilla | Admin",
};

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  await requireRole(["SUPER_ADMIN", "ADMIN"]);

  const { name: templateName } = await params;
  const defaultDef = DEFAULT_TEMPLATES.find((t) => t.name === templateName);
  
  if (!defaultDef) {
    notFound();
  }

  let template = await prisma.notificationTemplate.findUnique({
    where: { name: templateName },
  });

  if (!template) {
    template = {
      id: "new",
      name: templateName,
      subject: defaultDef.subject,
      body: defaultDef.defaultBody || "",
      type: "EMAIL",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } else if (!template.body || template.body === "<p><br></p>") {
    // If it exists but body is empty, initialize with defaultBody
    template.body = defaultDef.defaultBody || "";
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Editar Plantilla: {defaultDef.description}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Las variables como {"{{publicCode}}"} o {"{{customerName}}"} se reemplazarán automáticamente.
        </p>
      </div>

      <TemplateEditorClient initialData={template} />
    </div>
  );
}
