import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import OpenAI from "openai";
import sharp from "sharp";
import posts from "../data/posts.json" with { type: "json" };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/images/blog/articles");
const force = process.argv.includes("--force");
const maxItemsArg = process.argv.find((arg) => arg.startsWith("--limit="));
const maxItems = maxItemsArg ? Number(maxItemsArg.slice("--limit=".length)) : Number.POSITIVE_INFINITY;

dotenv.config({ path: path.join(root, ".env.local"), override: true, quiet: true });
dotenv.config({ path: path.join(root, ".env"), override: false, quiet: true });

const apiKey = process.env.OPENAI_API_KEY?.trim();
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing. Set it in .env.local before running this script.");
}

const client = new OpenAI({ apiKey });
const model = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
const quality = process.env.OPENAI_BLOG_IMAGE_QUALITY?.trim() || "medium";
const concurrency = Number(process.env.OPENAI_BLOG_IMAGE_CONCURRENCY || 3);

const fleetRule = [
  "Use only black or dark charcoal Mercedes-Benz chauffeured vehicles from the MeTransfers fleet:",
  "Mercedes-Benz V-Class luxury minivan, Mercedes-Benz Vito or V-Class economic minivan, Mercedes-Benz E-Class style sedan, and Mercedes-Benz S-Class style executive sedan.",
  "No other car brands, no SUVs, no buses, no taxis.",
].join(" ");

const sharedAvoid = [
  "No text overlay, no titles, no captions, no watermarks, no readable license plates.",
  "Avoid distorted wheels, duplicated cars, malformed badges, melted bodywork, cartoon/CGI style, excessive darkness, excessive blur, or generic stock-photo composition.",
].join(" ");

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickScene(post) {
  const text = normalize(`${post.title} ${post.slug} ${post.excerpt} ${post.category}`);

  if (/aeropuerto|prat|vuelo|terminal|escala|maleta|equipaje/.test(text)) {
    return {
      vehicle: "black Mercedes-Benz E-Class style sedan",
      scene: "Barcelona El Prat airport curbside pickup area with glass terminal architecture",
      mood: "punctual airport transfer, luggage nearby, clean daylight",
    };
  }

  if (/familia|infantil|nino|ninos|silla|semana santa|equipaje sin limites/.test(text)) {
    return {
      vehicle: "black Mercedes-Benz V-Class luxury minivan",
      scene: "Barcelona hotel entrance or apartment pickup area",
      mood: "family transfer with luggage, calm premium daylight, no close-up faces",
    };
  }

  if (/puerto|crucero|maritima|terminal maritima/.test(text)) {
    return {
      vehicle: "black Mercedes-Benz S-Class style executive sedan",
      scene: "Barcelona cruise port private pickup area with ship silhouette in the distance",
      mood: "refined cruise transfer, bright coastal daylight",
    };
  }

  if (/vip|corporativo|empresa|congreso|negocio|evento|artista|musico|festival/.test(text)) {
    return {
      vehicle: "black Mercedes-Benz S-Class style executive sedan",
      scene: "modern Barcelona business hotel or conference entrance",
      mood: "corporate chauffeur service at blue hour with discreet traveler silhouettes",
    };
  }

  if (/andorra|montserrat|costa brava|sitges|costa dorada|girona|figueres|dali|penedes|vinedo|pueblo|playa|cala|escapada/.test(text)) {
    return {
      vehicle: "black Mercedes-Benz V-Class luxury minivan",
      scene: "scenic private route in Catalonia with mountains, coast, village, or vineyard atmosphere matching the article topic",
      mood: "premium day trip transfer, natural Mediterranean light",
    };
  }

  if (/gaudi|sagrada familia|barcelona|gotico|picasso|museo|gourmet|restaurante|ciudad|tour/.test(text)) {
    return {
      vehicle: "black Mercedes-Benz V-Class luxury minivan",
      scene: "elegant Barcelona street with modernist architecture mood and premium hotel surroundings",
      mood: "private city tour, bright editorial travel photography",
    };
  }

  return {
    vehicle: "black Mercedes-Benz E-Class style sedan",
    scene: "premium Barcelona hotel entrance or private transfer pickup area",
    mood: "professional chauffeur transfer, clean daylight, polished travel brand mood",
  };
}

function uniqueDetail(post) {
  const title = stripHtml(post.title);
  const excerpt = stripHtml(post.excerpt);
  const content = stripHtml(post.content).slice(0, 260);
  return [title, excerpt, content].filter(Boolean).join(" ").slice(0, 650);
}

function buildPrompt(post) {
  const scene = pickScene(post);

  return [
    "Use case: photorealistic-natural.",
    "Asset type: individual blog article cover for a premium private transfer website.",
    `Article title: ${stripHtml(post.title)}.`,
    `Category: ${stripHtml(post.category)}.`,
    `Article context to inspire the scene: ${uniqueDetail(post)}.`,
    `Scene/backdrop: ${scene.scene}.`,
    `Subject: ${scene.vehicle} as the clear focal vehicle.`,
    `Mood: ${scene.mood}.`,
    "Composition/framing: wide 16:9 editorial cover, professional automotive travel photography, realistic reflections, vehicle fully believable and well proportioned, enough clean space for website cropping.",
    fleetRule,
    sharedAvoid,
  ].join("\n");
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithRetry(post, outputPath, index, total) {
  const prompt = buildPrompt(post);
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      console.log(`[${index + 1}/${total}] Generating ${post.slug}${attempt > 1 ? ` attempt ${attempt}` : ""}`);
      const result = await client.images.generate({
        model,
        prompt,
        size: "1600x896",
        quality,
        output_format: "png",
        n: 1,
      });

      const imageBase64 = result.data?.[0]?.b64_json;
      if (!imageBase64) {
        throw new Error("OpenAI did not return image data.");
      }

      await sharp(Buffer.from(imageBase64, "base64"))
        .resize(1600, 900, {
          fit: "cover",
          position: sharp.strategy.attention,
        })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(outputPath);

      console.log(`[${index + 1}/${total}] Saved ${path.relative(root, outputPath)}`);
      return;
    } catch (error) {
      const waitMs = attempt * 20000;
      console.error(`[${index + 1}/${total}] Failed ${post.slug}: ${error?.message || error}`);

      if (attempt === maxAttempts) {
        throw error;
      }

      console.error(`[${index + 1}/${total}] Retrying ${post.slug} in ${Math.round(waitMs / 1000)}s`);
      await sleep(waitMs);
    }
  }
}

async function worker(queue, total, failed) {
  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) return;

    try {
      await generateWithRetry(item.post, item.outputPath, item.index, total);
    } catch (error) {
      failed.push({
        slug: item.post.slug,
        title: item.post.title,
        error: error?.message || String(error),
      });
    }
  }
}

await fs.mkdir(outDir, { recursive: true });

const queue = [];
for (const [index, post] of posts.entries()) {
  const outputPath = path.join(outDir, `${post.slug}.jpg`);
  if (!force && await exists(outputPath)) {
    console.log(`[${index + 1}/${posts.length}] Skipping existing ${post.slug}`);
    continue;
  }
  queue.push({ post, outputPath, index });
}

const limitedQueue = queue.slice(0, maxItems);
const failed = [];

console.log(`Preparing ${limitedQueue.length} missing article images from ${posts.length} posts.`);
console.log(`Model: ${model}. Quality: ${quality}. Concurrency: ${concurrency}.`);

await Promise.all(
  Array.from({ length: Math.max(1, Math.min(concurrency, limitedQueue.length)) }, () =>
    worker(limitedQueue, posts.length, failed)
  )
);

if (failed.length > 0) {
  const failedPath = path.join(root, ".next/openai-blog-image-failures.json");
  await fs.mkdir(path.dirname(failedPath), { recursive: true });
  await fs.writeFile(failedPath, JSON.stringify(failed, null, 2));
  throw new Error(`${failed.length} article images failed. See ${path.relative(root, failedPath)}.`);
}

console.log("All missing blog article images generated.");
