import { CmsEditorForm } from "@/components/admin/CmsEditorForm";

export default function NewPage() {
  return (
    <CmsEditorForm 
      initialData={{ isActive: true }} 
      type="page" 
      apiEndpoint="/api/admin/pages" 
    />
  );
}
