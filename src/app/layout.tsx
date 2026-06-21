import type { Metadata, Viewport } from "next";
import { EB_Garamond, Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { ReadingSettingsProvider } from "@/components/reading-settings/ReadingSettingsProvider";
import { Header } from "@/components/layout/Header";
import { SectionAccentWrapper } from "@/components/layout/SectionAccentWrapper";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const siteTitle = "¡LEE! — Literatura en español";
const siteDescription =
  "LEE es una antología digital comentada de literatura en español: fragmentos elegidos y anotados, de la Edad Media a nuestros días.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfaf4",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: {
    default: siteTitle,
    template: "%s · ¡LEE!",
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: "¡LEE!",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${garamond.variable} ${fraunces.variable} ${manrope.variable} h-full`}
      data-theme="light"
      suppressHydrationWarning
    >
      {/* Anti-flash: apply saved theme before first paint */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('lee-theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink antialiased">
        <ReadingSettingsProvider>
          <Header />
          <main className="flex-1">
            <SectionAccentWrapper>{children}</SectionAccentWrapper>
          </main>
          <footer className="border-t border-line px-4 py-8 text-center text-sm text-ink-soft">
            <p>
              «LEE» — Literatura en español. Antología digital comentada, de
              acceso libre. Sin registro, sin cookies de seguimiento.
            </p>
          </footer>
        </ReadingSettingsProvider>
      </body>
    </html>
  );
}
