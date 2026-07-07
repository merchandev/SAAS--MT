import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePenLine, Plus } from "lucide-react";
import PostsDataTable from "@/components/admin/PostsDataTable";

export default async function AdminPostsList() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FilePenLine className="h-6 w-6 text-[#D4AF37]" />
            Blog y Entradas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona los artículos y noticias del blog corporativo.
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button className="bg-[#D4AF37] hover:bg-[#b5952f] text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Entrada
          </Button>
        </Link>
      </div>

      <PostsDataTable initialPosts={posts} />
    </div>
  );
}
