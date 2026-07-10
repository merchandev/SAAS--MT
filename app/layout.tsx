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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W36RVDFG');`,
          }}
        />
        {/* Hide Google Translate top bar */}
        <style>{`
          .goog-te-banner-frame, .skiptranslate iframe { display: none !important; }
          body { top: 0px !important; margin-top: 0 !important; }
          .goog-te-gadget { font-size: 0 !important; }
          .goog-te-gadget span { display: none !important; }
          #google_translate_element { display: none !important; }
        `}</style>
        {/* Material Symbols Outlined */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W36RVDFG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SPEWG8MDJ9"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SPEWG8MDJ9');
            `,
          }}
        />
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
                  { pageLanguage: 'es', includedLanguages: 'es,en,fr,de,it,pt,ru,sv,zh-CN', autoDisplay: false },
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

