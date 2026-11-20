import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, IBM_Plex_Mono } from "next/font/google";
const displayFont = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-display", display: "swap" });
const sansFont = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans", display: "swap" });
const monoFont = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-mono", display: "swap" });
import "./globals.css";
export const metadata: Metadata = {
  title: "P2 / CONFORMITÉ — RGPD & Loi 19-05",
  description: "P2 — Évaluation de conformité RGPD / Loi 19-05 d'une application web locale. 5 critères, score 0-100.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr" className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}><body>{children}</body></html>;
}
