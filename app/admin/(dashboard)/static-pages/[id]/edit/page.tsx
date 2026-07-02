import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StaticPageForm from "./StaticPageForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function EditStaticPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.staticPage.findUnique({
    where: { id },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Editar SEO: {page.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            URL: {page.slug === "inicio" ? "/" : `/${page.slug}`}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <StaticPageForm page={page} />
      </div>
    </div>
  );
}
