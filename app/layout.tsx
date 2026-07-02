import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { settingsQueries } from "@/modules/settings/settings.queries";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fallbackMetadata: Metadata = {
  metadataBase: new URL("https://metransfers.es"),
  title: "Traslados privados y chófer en Barcelona | MeTransfers",
  description: "Reserva transfers de aeropuerto, traslados privados, tours y coches con chófer en Barcelona. Precio cerrado, conductor profesional y vehículos premium.",
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await settingsQueries.getAllSettings();
    const siteName = settings.SITE_NAME || settings.COMPANY_NAME || "MeTransfers";
    const title = settings.SITE_TITLE || `Traslados privados y chófer en Barcelona | ${siteName}`;
    const description = settings.SITE_META_DESCRIPTION || fallbackMetadata.description;
    const logoUrl = settings.SITE_LOGO_URL?.trim();
    const faviconUrl = settings.SITE_FAVICON_URL?.trim();
    const siteUrl = settings.SITE_URL?.trim() || "https://metransfers.es";

    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      applicationName: siteName,
      icons: faviconUrl ? { icon: faviconUrl } : undefined,
      openGraph: {
        title,
        description: description ?? undefined,
        siteName,
        images: logoUrl ? [logoUrl] : undefined,
      },
    };
  } catch {
    return fallbackMetadata;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${inter.variable} h-full antialiased dark`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden">{children}</body>
    </html>
  );
}
