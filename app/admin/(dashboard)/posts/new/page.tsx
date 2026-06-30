import { CmsEditorForm } from "@/components/admin/CmsEditorForm";

export default function NewPost() {
  return (
    <CmsEditorForm 
      initialData={{ isActive: true }} 
      type="post" 
      apiEndpoint="/api/admin/posts" 
    />
  );
}
