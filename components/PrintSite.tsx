"use client";

import { useState } from "react";
import { printUrl } from "@/lib/proprios";

/** Print automático do site; se o serviço falhar ou não houver link, mostra uma capa tipográfica. */
export function PrintSite({ link, nome }: { link?: string; nome: string }) {
  const [falhou, setFalhou] = useState(false);
  if (!link || falhou) {
    return (
      <div aria-hidden="true" className="relative grid h-full w-full place-items-center overflow-hidden bg-[#081030]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_11px,rgb(143_155_255/0.06)_11px,rgb(143_155_255/0.06)_12px)]" />
        <span className="titulo relative px-6 text-center text-3xl text-[#c9d1f2] font-sans font-semibold tracking-tight">{nome}</span>
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
