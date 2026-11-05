"use client";

import { ArrowUpRightIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import type { ModoValores } from "@/data/site";
import { formatarValor, mesPorExtenso, type ProjetoPublico } from "@/lib/projetos";
import { Capa } from "./ProjetoCard";

type Props = { projeto: ProjetoPublico | null; modo: ModoValores; aoFechar: () => void };

export function ProjetoDialog({ projeto, modo, aoFechar }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (projeto && !d.open) d.showModal();
    if (!projeto && d.open) d.close();
  }, [projeto]);

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => e.target === ref.current && aoFechar()}
      aria-labelledby="dialogo-titulo"
      data-lenis-prevent
      className="m-auto max-h-[90svh] w-[calc(100%-32px)] max-w-2xl overflow-y-auto rounded-2xl border border-borda bg-superficie p-0 text-texto backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      {projeto && (
        <div className="p-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Capa projeto={projeto} />
            <button
              type="button"
              onClick={aoFechar}
              aria-label="Fechar detalhes"
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-black/70 text-white backdrop-blur-md transition duration-300 ease-suave hover:bg-black active:scale-[0.98]"
            >
              <XIcon className="size-4" weight="bold" />
            </button>
          </div>

          <div className="p-4 md:p-6">
            <p className="text-sm text-apagado">
              {projeto.tipo}
              {projeto.cliente ? ` para ${projeto.cliente}` : ""}
            </p>
            <h2 id="dialogo-titulo" className="titulo mt-2 text-4xl">
              {projeto.nome}
            </h2>
            {projeto.descricao && <p className="mt-4 text-base text-texto">{projeto.descricao}</p>}

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-borda p-3">
                <dt className="text-xs text-apagado">Valor</dt>
                <dd className="mt-1 text-sm font-semibold text-forte">{formatarValor(projeto.valor, modo)}</dd>
              </div>
              <div className="rounded-xl border border-borda p-3">
                <dt className="text-xs text-apagado">Prazo</dt>
                <dd className="mt-1 text-sm font-semibold text-forte">{projeto.prazo}</dd>
              </div>
              <div className="rounded-xl border border-borda p-3">
                <dt className="text-xs text-apagado">Entrega</dt>
                <dd className="mt-1 text-sm font-semibold text-forte first-letter:uppercase">{mesPorExtenso(projeto.data)}</dd>
              </div>
            </dl>

            <h3 className="mt-6 text-xs text-apagado">Tecnologias</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {projeto.stack.map((s) => (
                <li key={s} className="rounded-full border border-borda px-3 py-1 text-xs text-texto">
                  {s}
                </li>
              ))}
            </ul>

            {projeto.depoimento && (
              <figure className="mt-6 rounded-xl bg-black/40 p-4">
                <blockquote className="titulo text-2xl text-forte">“{projeto.depoimento.texto}”</blockquote>
                {projeto.depoimento.autor && (
                  <figcaption className="mt-3 text-sm text-apagado">{projeto.depoimento.autor}</figcaption>
                )}
              </figure>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {projeto.link ? (
                <a
                  href={projeto.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition duration-300 ease-suave hover:bg-neutral-200 active:scale-[0.98]"
                >
                  Ver site no ar <ArrowUpRightIcon className="size-4" weight="bold" aria-hidden="true" />
                </a>
              ) : (
                <span className="rounded-full border border-borda px-4 py-2 text-sm text-apagado">
                  Site sem link público
                </span>
              )}
              {projeto.repositorio && (
                <a
                  href={projeto.repositorio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-forte transition duration-300 ease-suave hover:bg-white/10 active:scale-[0.98]"
                >
                  Repositório <ArrowUpRightIcon className="size-4" weight="bold" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
