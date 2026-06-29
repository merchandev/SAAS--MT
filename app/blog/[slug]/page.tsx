import { notFound } from "next/navigation";
import postsData from "@/data/posts.json";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import { ArrowLeft, Calendar, Clock, Newspaper } from "lucide-react";
import Link from "next/link";
import MarketingCta from "@/components/marketing/MarketingCta";

export const dynamic = "force-static";

export function generateStaticParams() {
  return postsData.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = postsData.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: "Artículo no encontrado | MeTransfers",
    };
  }

  return {
    title: `${post.title} | Blog MeTransfers`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = postsData.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Format date
  const date = new Date(post.pubDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <MarketingHeader />

      <main className="pt-28 pb-20">
        <article className="mx-auto max-w-4xl px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#D4AF37] mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>

          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-500 mb-6">
              <span className="inline-flex items-center rounded-full bg-[#D4AF37]/10 px-3 py-1 text-[#D4AF37] uppercase tracking-wider text-xs font-black">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {date}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 mb-6">
              {post.title}
            </h1>
          </header>

          <div className="relative aspect-[21/9] bg-white rounded-3xl overflow-hidden mb-12 flex items-center justify-center border border-gray-200 shadow-sm">
            <div className="text-[#D4AF37] opacity-10">
              <Newspaper className="h-40 w-40" />
            </div>
          </div>

          <div 
            className="prose prose-lg prose-gray max-w-none prose-headings:font-black prose-a:text-[#D4AF37] prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        <div className="mt-20">
          <MarketingCta
            title="¿Listo para disfrutar de un traslado premium?"
            description="Reserva ahora mismo y asegura tu transporte privado en Barcelona con MeTransfers."
          />
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
