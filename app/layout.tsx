import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "P2 / CONFORMITÉ — RGPD & Loi 19-05",
  description: "P2 — Évaluation de conformité RGPD / Loi 19-05 d'une application web locale. 5 critères, score 0-100.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
