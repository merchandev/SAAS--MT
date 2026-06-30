import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import OpenAI from "openai";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

dotenv.config({ path: path.join(root, ".env.local"), override: true });
dotenv.config({ path: path.join(root, ".env"), override: false });

const apiKey = process.env.OPENAI_API_KEY?.trim();
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is missing. Set it in .env.local before running this script.");
}

const client = new OpenAI({ apiKey });
const model = process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";

const fleetRule = [
  "Use only black or dark charcoal Mercedes-Benz chauffeured vehicles matching this MeTransfers fleet:",
  "1. MINI VAN V Class: black Mercedes-Benz V-Class luxury minivan.",
  "2. ECONOMIC CLASS: black Mercedes-Benz E-Class style sedan.",
  "3. BUSINESS CLASS: black Mercedes-Benz S-Class style executive sedan.",
  "4. MINI VAN ECONOMIC: black Mercedes-Benz Vito or V-Class style minivan.",
  "No other car brands, no SUVs, no buses, no generic taxis.",
].join(" ");

const sharedNegative = [
  "No text overlay, no captions, no watermark, no readable license plates.",
  "Avoid distorted wheels, melted body panels, duplicated headlights, malformed badges, cartoon style, CGI look, extreme blur, or dark unreadable framing.",
  "Commercial photorealistic automotive photography, realistic reflections, clean premium travel brand aesthetic.",
].join(" ");

const assets = [
  {
    file: "public/images/hero_light.png",
    width: 1024,
    height: 1024,
    size: "1024x1024",
    prompt: [
      "Use case: photorealistic-natural. Asset type: homepage hero image.",
      "Scene: premium Barcelona hotel entrance in daylight, elegant arrival area, clean architecture, subtle Mediterranean city atmosphere.",
      "Subject: a black Mercedes-Benz V-Class luxury minivan in the foreground with a black Mercedes-Benz executive sedan secondary in the background, professional chauffeur transfer mood.",
      "Composition: square hero image, vehicle angled three-quarter front, generous clean negative space near the upper left for website copy.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/chauffeur_day.png",
    width: 1024,
    height: 1024,
    size: "1024x1024",
    prompt: [
      "Use case: photorealistic-natural. Asset type: chauffeur service section image.",
      "Scene: bright hotel or airport terminal curbside in Barcelona, polished pavement, premium transfer pickup.",
      "Subject: a black Mercedes-Benz S-Class style executive sedan with a professional chauffeur opening the rear door, discreet business travel mood.",
      "Composition: square image, human figure natural and secondary, car remains the clear focal subject, editorial website photography.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/fleet_light.png",
    width: 1024,
    height: 1024,
    size: "1024x1024",
    prompt: [
      "Use case: photorealistic-natural. Asset type: fleet section image.",
      "Scene: clean premium vehicle lineup outside a modern Barcelona hotel or private terminal in soft daylight.",
      "Subject: four black Mercedes-Benz chauffeured vehicles visible as a fleet lineup: V-Class luxury minivan, E-Class style sedan, S-Class style sedan, and Vito or V-Class economic minivan.",
      "Composition: square image, three-quarter front lineup, cars separated clearly, all vehicles realistic and proportional.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/vehicles/economic-class.png",
    width: 960,
    height: 540,
    size: "1536x1024",
    prompt: [
      "Use case: product-mockup. Asset type: vehicle catalog card.",
      "Scene: bright clean studio or neutral premium driveway background.",
      "Subject: one black Mercedes-Benz E-Class style sedan representing ECONOMIC CLASS.",
      "Composition: horizontal 16:9 catalog image, side/front three-quarter angle, entire vehicle fully visible with generous margins.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/vehicles/business-class.png",
    width: 960,
    height: 540,
    size: "1536x1024",
    prompt: [
      "Use case: product-mockup. Asset type: vehicle catalog card.",
      "Scene: refined dark studio or luxury hotel forecourt with soft controlled lighting.",
      "Subject: one black Mercedes-Benz S-Class style executive sedan representing BUSINESS CLASS.",
      "Composition: horizontal 16:9 catalog image, front three-quarter angle, entire vehicle fully visible with elegant reflections.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/vehicles/mini-van-economic.png",
    width: 960,
    height: 540,
    size: "1536x1024",
    prompt: [
      "Use case: product-mockup. Asset type: vehicle catalog card.",
      "Scene: clean neutral transport forecourt in daylight.",
      "Subject: one black Mercedes-Benz Vito or V-Class style minivan representing MINI VAN ECONOMIC.",
      "Composition: horizontal 16:9 catalog image, side/front three-quarter angle, full minivan visible, practical premium transfer look.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/vehicles/mini-van-v-class.png",
    width: 960,
    height: 540,
    size: "1536x1024",
    prompt: [
      "Use case: product-mockup. Asset type: vehicle catalog card.",
      "Scene: premium hotel arrival area with soft daylight and clean architectural background.",
      "Subject: one black Mercedes-Benz V-Class luxury minivan representing MINI VAN V Class.",
      "Composition: horizontal 16:9 catalog image, front three-quarter angle, full vehicle visible, luxury chauffeured van look.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/blog/airport-transfer.png",
    width: 1600,
    height: 900,
    size: "1600x896",
    prompt: [
      "Use case: photorealistic-natural. Asset type: blog article cover about airport transfers.",
      "Scene: Barcelona El Prat airport curbside pickup area, daylight, terminal glass in the background.",
      "Subject: black Mercedes-Benz E-Class style sedan and discreet chauffeur airport transfer scene with luggage, no airline branding.",
      "Composition: wide 16:9 editorial cover, car as focal point, clean space for article layout.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/blog/costa-brava-tour.png",
    width: 1600,
    height: 900,
    size: "1600x896",
    prompt: [
      "Use case: photorealistic-natural. Asset type: blog article cover about private Costa Brava tours.",
      "Scene: scenic Mediterranean coastal road near Costa Brava with blue sea and stone village atmosphere.",
      "Subject: black Mercedes-Benz V-Class luxury minivan stopped safely at a viewpoint, premium private tour mood.",
      "Composition: wide 16:9 editorial travel cover, vehicle prominent but landscape visible.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/blog/family-v-class.png",
    width: 1600,
    height: 900,
    size: "1600x896",
    prompt: [
      "Use case: photorealistic-natural. Asset type: blog article cover about family transfers and luggage.",
      "Scene: hotel entrance or apartment pickup in Barcelona in warm daylight.",
      "Subject: black Mercedes-Benz V-Class luxury minivan with neatly arranged suitcases nearby, family transfer context without close-up faces.",
      "Composition: wide 16:9 editorial cover, minivan and luggage clear, calm premium family travel mood.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/blog/cruise-port.png",
    width: 1600,
    height: 900,
    size: "1600x896",
    prompt: [
      "Use case: photorealistic-natural. Asset type: blog article cover about cruise port transfers.",
      "Scene: Barcelona cruise port terminal in daylight, ship silhouette and port architecture in the background.",
      "Subject: black Mercedes-Benz S-Class style executive sedan waiting at a private pickup area.",
      "Composition: wide 16:9 editorial cover, refined transfer mood, vehicle sharp and realistic.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/blog/corporate-vip.png",
    width: 1600,
    height: 900,
    size: "1600x896",
    prompt: [
      "Use case: photorealistic-natural. Asset type: blog article cover about corporate and VIP mobility.",
      "Scene: modern business district or conference hotel entrance in Barcelona at blue hour.",
      "Subject: black Mercedes-Benz S-Class style executive sedan with a discreet chauffeur and business traveler silhouette.",
      "Composition: wide 16:9 premium editorial cover, sharp car reflections, professional corporate mood.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
  {
    file: "public/images/blog/city-tour.png",
    width: 1600,
    height: 900,
    size: "1600x896",
    prompt: [
      "Use case: photorealistic-natural. Asset type: blog article cover about private Barcelona city tours.",
      "Scene: elegant Barcelona street with recognizable modernist architecture mood, no copyrighted signage.",
      "Subject: black Mercedes-Benz V-Class luxury minivan used for a private city tour, parked safely by the curb.",
      "Composition: wide 16:9 editorial cover, vehicle foreground, city atmosphere visible and bright.",
      fleetRule,
      sharedNegative,
    ].join("\n"),
  },
];

async function ensureParent(filePath) {
  await fs.mkdir(path.dirname(path.join(root, filePath)), { recursive: true });
}

async function generateAsset(asset, index) {
  console.log(`[${index + 1}/${assets.length}] Generating ${asset.file}`);
  const result = await client.images.generate({
    model,
    prompt: asset.prompt,
    size: asset.size,
    quality: "medium",
    output_format: "png",
    n: 1,
  });

  const imageBase64 = result.data?.[0]?.b64_json;
  if (!imageBase64) {
    throw new Error(`OpenAI did not return image data for ${asset.file}`);
  }

  const buffer = Buffer.from(imageBase64, "base64");
  const outputPath = path.join(root, asset.file);
  await ensureParent(asset.file);

  await sharp(buffer)
    .resize(asset.width, asset.height, {
      fit: "cover",
      position: sharp.strategy.attention,
    })
    .png({ compressionLevel: 8 })
    .toFile(outputPath);

  console.log(`[${index + 1}/${assets.length}] Saved ${asset.file}`);
}

for (const [index, asset] of assets.entries()) {
  await generateAsset(asset, index);
}

console.log(`Generated ${assets.length} Mercedes fleet image assets with ${model}.`);
