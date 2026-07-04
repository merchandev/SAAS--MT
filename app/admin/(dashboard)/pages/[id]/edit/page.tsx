import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CmsEditorForm } from "@/components/admin/CmsEditorForm";

export default async function EditPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const pageData = await prisma.routePage.findUnique({
    where: { id: params.id },
  });

  if (!pageData) {
    notFound();
  }

  return (
    <CmsEditorForm 
      initialData={pageData} 
      type="page" 
      apiEndpoint="/api/admin/pages" 
    />
  );
}
