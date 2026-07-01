import { PrismaClient } from "@prisma/client";
import postsData from "../data/posts.json";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando migración de posts...");

  for (const post of postsData) {
    const exists = await prisma.post.findUnique({
      where: { slug: post.slug },
    });

    if (!exists) {
      await prisma.post.create({
        data: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          contentHtml: post.content,
          publishedAt: new Date(post.pubDate),
          isActive: true,
        },
      });
      console.log(`✅ Post creado: ${post.title}`);
    } else {
      console.log(`⏩ Post ya existe: ${post.title}`);
    }
  }

  console.log("🎉 ¡Migración de posts completada con éxito!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
