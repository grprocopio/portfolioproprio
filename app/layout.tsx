import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const larga = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.nome} | Sites que geram resultado`,
  description: site.descricao,
  openGraph: {
    title: `${site.nome} | Sites que geram resultado`,
    description: site.descricao,
    type: "website",
    locale: "pt_BR",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable} ${larga.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform duration-300 ease-suave focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        {children}
        <div className="granulado" aria-hidden="true" />
      </body>
    </html>
  );
}
