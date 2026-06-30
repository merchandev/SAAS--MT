export const IMAGE_PAGE_TYPES = ["home", "service", "route", "vehicle", "hotel", "blog"] as const;
export const IMAGE_TARGETS = ["hero", "card", "social", "banner"] as const;
export const IMAGE_SIZES = ["1024x1024", "1536x1024", "1024x1536", "auto"] as const;
export const IMAGE_QUALITIES = ["low", "medium", "high", "auto"] as const;

export type ImagePageType = (typeof IMAGE_PAGE_TYPES)[number];
export type ImageTarget = (typeof IMAGE_TARGETS)[number];
export type ImageSize = (typeof IMAGE_SIZES)[number];
export type ImageQuality = (typeof IMAGE_QUALITIES)[number];

export type ImageContext = {
  pageType: ImagePageType;
  title: string;
  description?: string;
  city?: string;
  serviceType?: string;
  target?: ImageTarget;
};

const pageTypeLabels: Record<ImagePageType, string> = {
  home: "homepage",
  service: "service page",
  route: "route landing page",
  vehicle: "vehicle fleet page",
  hotel: "hotel partner page",
  blog: "editorial blog article",
};

const targetDirections: Record<ImageTarget, string> = {
  hero: "wide hero composition with generous negative space for website copy",
  card: "compact card thumbnail composition with a clear single focal subject",
  social: "balanced social sharing composition, centered and easy to crop",
  banner: "horizontal banner composition with strong depth and clean edges",
};

function clean(value: string | undefined) {
  return value?.replace(/\s+/g, " ").trim();
}

export function buildWebsiteImagePrompt(ctx: ImageContext) {
  const title = clean(ctx.title);
  const description = clean(ctx.description);
  const city = clean(ctx.city) || "Barcelona";
  const serviceType = clean(ctx.serviceType);
  const target = ctx.target || "hero";

  return [
    "Create a photorealistic premium transportation website image for MeTransfers.",
    `Context: ${pageTypeLabels[ctx.pageType]}${title ? ` titled "${title}"` : ""}.`,
    description ? `Content summary: ${description}.` : null,
    `Location mood: ${city}, Spain and nearby Mediterranean travel routes.`,
    serviceType ? `Service focus: ${serviceType}.` : null,
    `Composition: ${targetDirections[target]}.`,
    "Fleet: elegant black Mercedes-Benz vehicles used for chauffeured transfers, including E-Class style sedan for Economic Class, S-Class style sedan for Business Class, Mercedes-Benz V-Class/Vito style minivan for Mini Van Economic, and Mercedes-Benz V-Class luxury minivan for Mini Van V Class.",
    "Show a professional chauffeur transfer scene suitable for airport, cruise port, hotel, city tour, corporate travel, or private route content depending on the context.",
    "Visual style: polished commercial automotive photography, realistic lighting, clean vehicle reflections, premium but practical SaaS travel brand aesthetic.",
    "Avoid: text overlays, captions, logos added as graphics, visible license plates, watermarks, distorted wheels, duplicated cars, malformed vehicle badges, cartoon styling, excessive blur, dark unreadable framing.",
  ].filter(Boolean).join("\n");
}
