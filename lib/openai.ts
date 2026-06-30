import OpenAI from "openai";

export class OpenAIConfigurationError extends Error {
  constructor(message = "Missing OPENAI_API_KEY") {
    super(message);
    this.name = "OpenAIConfigurationError";
  }
}

let cachedClient: OpenAI | null = null;

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new OpenAIConfigurationError();
  }

  cachedClient ??= new OpenAI({ apiKey });
  return cachedClient;
}

export function getOpenAIImageModel() {
  return process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
}
