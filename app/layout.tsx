import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Martian_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";
import { site } from "@/lib/site";
import "./globals.css";

// Body text. Headings and labels use the mono face below.
const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
// "wdth" lets headings run slightly condensed; see globals.css.
const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian",
  display: "swap",
  axes: ["wdth"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | Portfolio`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0c" },
  ],
};

// Runs before first paint so the saved (or system) theme never flashes.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
