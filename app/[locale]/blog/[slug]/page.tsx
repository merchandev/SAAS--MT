import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import MarketingFooter from "@/components/marketing/MarketingFooter";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import MarketingCta from "@/components/marketing/MarketingCta";
import { getBlogImage } from "@/lib/fleet-images";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post || !post.isActive) {
    return {
      title: "Artículo no encontrado | Transfers in Barcelona",
    };
  }

  // mock image object for seo
  const image = getBlogImage({ slug: post.slug, title: post.title });

  return {
    title: post.metaTitle || `${post.title} | Blog Transfers in Barcelona`,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || `${post.title} | Blog Transfers in Barcelona`,
      description: post.metaDescription || post.excerpt,
      images: [
        {
          url: post.imageUrl || image.src,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [post.imageUrl || image.src],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!post || !post.isActive) {
    notFound();
  }

  // Format date
  const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const image = getBlogImage({ slug: post.slug, title: post.title });

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
                {"Transfersinbarcelona-Blog"}
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

          <div className="relative aspect-[21/9] bg-white rounded-3xl overflow-hidden mb-12 border border-gray-200 shadow-sm">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          <div 
            className="prose prose-lg prose-gray max-w-none prose-headings:font-black prose-a:text-[#D4AF37] prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }}
          />
        </article>

        <div className="mt-20">
          <MarketingCta
            title="¿Listo para disfrutar de un traslado premium?"
            description="Reserva ahora mismo y asegura tu transporte privado en Barcelona con Transfers in Barcelona."
          />
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
