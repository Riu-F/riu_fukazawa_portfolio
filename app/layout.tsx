import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riu — Designer",
  description: "Curious by nature, Strategic by design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Only fonts actually used on the page:
          - Title cycling: Playfair Display, DM Serif Display, Libre Baskerville,
            Merriweather, Lora, Zilla Slab, Fraunces,
            DM Sans, Outfit, Unbounded, Syne, Archivo Black
          - Sticky notes: Caveat
        */}
        {/*
          Font loading notes:
          - Title cycling uses italic variants (all cycling fonts are italic-weighted)
          - Playfair Display also loads normal/400 for the deck section headings
          - DM Mono (new) for deck labels, subtitles, and monospace UI text
          - Josefin Sans normal/400 for the tagline (non-cycling UI use)
          - Caveat for sticky note handwriting
        */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Caveat:wght@700&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,700;1,400&family=DM+Serif+Display:ital@1&family=Fraunces:ital,opsz,wght@1,9..144,900&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=Josefin+Sans:ital,wght@0,400;1,700&family=Libre+Baskerville:ital,wght@1,700&family=Lora:ital,wght@1,700&family=Merriweather:ital,wght@1,900&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;1,900&family=Syne:wght@700&family=Unbounded:wght@700&family=Zilla+Slab:ital,wght@1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
