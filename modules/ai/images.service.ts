import { getOpenAIClient, getOpenAIImageModel } from "@/lib/openai";
import { buildWebsiteImagePrompt, type ImageContext, type ImageQuality, type ImageSize } from "./image-prompts";

export type GenerateWebsiteImageInput = ImageContext & {
  size: ImageSize;
  quality: ImageQuality;
  userId?: string;
};

export async function generateWebsiteImage(input: GenerateWebsiteImageInput) {
  const prompt = buildWebsiteImagePrompt(input);
  const model = getOpenAIImageModel();

  const result = await getOpenAIClient().images.generate({
    model,
    prompt,
    size: input.size,
    quality: input.quality,
    output_format: "webp",
    n: 1,
    user: input.userId,
  });

  const imageBase64 = result.data?.[0]?.b64_json;

  if (!imageBase64) {
    throw new Error("OpenAI did not return image data.");
  }

  return {
    imageDataUrl: `data:image/webp;base64,${imageBase64}`,
    prompt,
    usage: result.usage ?? null,
    model,
    size: result.size ?? input.size,
    quality: result.quality ?? input.quality,
    outputFormat: result.output_format ?? "webp",
  };
}
