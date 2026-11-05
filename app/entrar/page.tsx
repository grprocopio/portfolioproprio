import type { Metadata } from "next";
import { CeuNoturno } from "@/components/CeuNoturno";
import { FormEntrar } from "@/components/crm/FormEntrar";
import { cartao } from "@/components/crm/estilos";

export const metadata: Metadata = { title: "Entrar | CRM Procopio", robots: { index: false, follow: false } };

export default function Entrar() {
  return (
    <>
      <CeuNoturno />
      <main id="conteudo" className="relative z-10 grid min-h-svh place-items-center px-4">
        <div className={`${cartao} w-full max-w-sm p-8`}>
          <div className="mx-auto mb-6 size-20 overflow-hidden rounded-full border-2 border-claro/30 bg-[#1a1a24]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/personagem.webp" alt="" width={706} height={978} className="h-auto w-full translate-y-1 scale-[1.9] object-cover object-top" style={{ transformOrigin: "50% 12%" }} />
          </div>
          <h1 className="hero-heading mb-8 text-center text-4xl font-black uppercase leading-none tracking-tight">CRM Procopio</h1>
          <FormEntrar />
        </div>
      </main>
    </>
  );
}
