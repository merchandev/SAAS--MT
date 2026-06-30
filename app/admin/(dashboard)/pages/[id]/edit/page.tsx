import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CmsEditorForm } from "@/components/admin/CmsEditorForm";

export default async function EditPage({ params }: { params: { id: string } }) {
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
