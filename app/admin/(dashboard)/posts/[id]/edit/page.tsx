import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CmsEditorForm } from "@/components/admin/CmsEditorForm";

export default async function EditPost(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const postData = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!postData) {
    notFound();
  }

  return (
    <CmsEditorForm 
      initialData={postData} 
      type="post" 
      apiEndpoint="/api/admin/posts" 
    />
  );
}
