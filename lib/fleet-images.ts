export const fleetImagePaths = {
  economic: "/images/vehicles/economic-class.png",
  business: "/images/vehicles/business-class.png",
  minivanEconomic: "/images/vehicles/mini-van-economic.png",
  minivanVClass: "/images/vehicles/mini-van-v-class.png",
} as const;

type VehicleImageInput = {
  imageUrl?: string | null;
  name?: string | null;
  slug?: string | null;
};

export function getVehicleImageSrc(vehicle: VehicleImageInput) {
  if (vehicle.imageUrl?.trim()) {
    return vehicle.imageUrl;
  }

  const value = `${vehicle.slug ?? ""} ${vehicle.name ?? ""}`.toLowerCase();

  if (value.includes("v-class") || value.includes("v class") || value.includes("clase v")) {
    return fleetImagePaths.minivanVClass;
  }

  if (value.includes("vito") || (value.includes("mini") && value.includes("economic"))) {
    return fleetImagePaths.minivanEconomic;
  }

  if (value.includes("business") || value.includes("s-class") || value.includes("s class")) {
    return fleetImagePaths.business;
  }

  return fleetImagePaths.economic;
}

const blogImages = [
  {
    src: "/images/blog/airport-transfer.png",
    alt: "Mercedes de MeTransfers en un traslado privado de aeropuerto",
    keywords: ["aeropuerto", "prat", "vuelo", "taxis", "operacion salida", "reserva"],
  },
  {
    src: "/images/blog/costa-brava-tour.png",
    alt: "Mercedes de MeTransfers para rutas privadas por la Costa Brava",
    keywords: ["costa brava", "escapadas", "pueblos", "girona", "playa", "cala"],
  },
  {
    src: "/images/blog/family-v-class.png",
    alt: "Mercedes Clase V de MeTransfers para familias y equipaje",
    keywords: ["familia", "equipaje", "clase v", "semana santa", "ninos", "maletas"],
  },
  {
    src: "/images/blog/cruise-port.png",
    alt: "Mercedes de MeTransfers para traslados privados al puerto",
    keywords: ["puerto", "cruceros", "terminal", "maritima"],
  },
  {
    src: "/images/blog/corporate-vip.png",
    alt: "Mercedes business de MeTransfers para movilidad ejecutiva",
    keywords: ["vip", "artistas", "musicos", "corporativo", "congreso", "negocios", "evento"],
  },
  {
    src: "/images/blog/city-tour.png",
    alt: "Mercedes de MeTransfers para tours privados en Barcelona",
    keywords: ["barcelona", "gotico", "sant josep", "tour", "sagrada familia", "ciudad"],
  },
] as const;

type BlogImageInput = {
  title: string;
  slug: string;
};

export function getBlogArticleImageSrc(post: BlogImageInput) {
  return `/images/blog/articles/${post.slug}.jpg`;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function stableIndex(value: string, modulo: number) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash % modulo;
}

export function getBlogImage(post: BlogImageInput) {
  const articleImage = getBlogArticleImageSrc(post);

  if (post.slug?.trim()) {
    return {
      src: articleImage,
      alt: `Mercedes de MeTransfers para ${post.title}`,
    };
  }

  const haystack = normalizeText(`${post.title} ${post.slug}`);
  const match = blogImages.find((image) =>
    image.keywords.some((keyword) => haystack.includes(keyword))
  );

  return match ?? blogImages[stableIndex(post.slug, blogImages.length)];
}
