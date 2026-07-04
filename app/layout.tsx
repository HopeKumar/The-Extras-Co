import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

const SITE = "https://theextras.co";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "The Extras & Co. — Digital Experiences Worth Remembering",
    template: "%s · The Extras & Co.",
  },
  description:
    "The Extras & Co. is a creative technology studio building extraordinary digital products, AI automations, brands and premium user experiences.",
  keywords: [
    "creative technology studio",
    "digital product design",
    "AI automation",
    "brand design",
    "web experience",
    "The Extras & Co",
  ],
  authors: [{ name: "The Extras & Co." }],
  openGraph: {
    type: "website",
    url: SITE,
    title: "The Extras & Co. — Digital Experiences Worth Remembering",
    description:
      "A creative technology studio building extraordinary digital products, AI automations and brands.",
    siteName: "The Extras & Co.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Extras & Co.",
    description: "Digital experiences worth remembering.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0e0c09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
