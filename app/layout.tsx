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
  title: "MeTransfers | Private Luxury Transfers",
  description: "Premium private transfer services and management platform.",
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await settingsQueries.getAllSettings();
    const siteName = settings.SITE_NAME || settings.COMPANY_NAME || "MeTransfers";
    const title = settings.SITE_TITLE || `${siteName} | Traslados privados premium`;
    const description = settings.SITE_META_DESCRIPTION || fallbackMetadata.description;
    const logoUrl = settings.SITE_LOGO_URL?.trim();
    const faviconUrl = settings.SITE_FAVICON_URL?.trim();

    return {
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
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">{children}</body>
    </html>
  );
}
