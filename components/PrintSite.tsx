"use client";

import { useState } from "react";
import { printUrl } from "@/lib/ganhos";

/** Print automático do site; se o serviço falhar ou não houver link, mostra uma capa tipográfica. */
export function PrintSite({ link, nome }: { link?: string; nome: string }) {
  const [falhou, setFalhou] = useState(false);
  if (!link || falhou) {
    return (
      <div aria-hidden="true" className="relative grid h-full w-full place-items-center overflow-hidden bg-[linear-gradient(160deg,#1b1b1f,#0f0f11)]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_11px,rgb(215_226_234/0.04)_11px,rgb(215_226_234/0.04)_12px)]" />
        <span className="titulo relative px-4 text-center text-lg sm:text-3xl hero-heading font-black uppercase leading-none tracking-tight">{nome}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={printUrl(link)}
      alt={`Página inicial de ${nome}`}
      loading="lazy"
      decoding="async"
      onError={() => setFalhou(true)}
      className="h-full w-full object-cover object-top transition duration-700 ease-suave group-hover:scale-[1.03]"
    />
  );
}
