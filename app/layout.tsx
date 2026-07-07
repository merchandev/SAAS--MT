import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import { settingsQueries } from "@/modules/settings/settings.queries";
import DeveloperCredits from "@/components/DeveloperCredits";
import Script from "next/script";
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
  metadataBase: new URL("https://transfersinbarcelona.com"),
  title: "Private Transfers in Barcelona | Airport, Cruise Port & Chauffeur",
  description: "Book private transfers in Barcelona with fixed price, professional chauffeur, airport pickup, cruise port transfers and secure online payment.",
};

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await settingsQueries.getAllSettings();
    const siteName = settings.SITE_NAME || settings.COMPANY_NAME || "Transfers in Barcelona";
    const title = settings.SITE_TITLE || `Traslados privados y chófer en Barcelona | ${siteName}`;
    const description = settings.SITE_META_DESCRIPTION || fallbackMetadata.description;
    const logoUrl = settings.SITE_LOGO_URL?.trim();
    const faviconUrl = settings.SITE_FAVICON_URL?.trim();
    const siteUrl = settings.SITE_URL?.trim() || "https://transfersinbarcelona.com";

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
        {/* Hide Google Translate top bar */}
        <style>{`
          .goog-te-banner-frame, .skiptranslate iframe { display: none !important; }
          body { top: 0px !important; margin-top: 0 !important; }
          .goog-te-gadget { font-size: 0 !important; }
          .goog-te-gadget span { display: none !important; }
          #google_translate_element { display: none !important; }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden">
        <DeveloperCredits />
        {children}
        {/* Google Translate – loaded globally so the cookie mechanism works on all pages */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.googleTranslateElementInit = function() {
                new window.google.translate.TranslateElement(
                  { pageLanguage: 'es', includedLanguages: 'es,en,fr,de,it,pt-PT,ru,sv,zh-CN', autoDisplay: false },
                  'google_translate_element'
                );
              };
            `,
          }}
        />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <div id="google_translate_element" aria-hidden="true" style={{ display: "none" }} />
      </body>
    </html>
  );
}

