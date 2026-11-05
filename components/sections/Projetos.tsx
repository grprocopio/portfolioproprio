"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { FadeIn } from "@/components/anim/FadeIn";
import { Capa, ProjetoCard } from "@/components/ProjetoCard";
import { ProjetoDialog } from "@/components/ProjetoDialog";
import { BotaoProjeto } from "@/components/ui/Botao";
import type { ModoValores } from "@/data/site";
import { formatarValor, tipos as listarTipos, type ProjetoPublico } from "@/lib/projetos";

const DESTAQUES = 4;
const raio = "rounded-[40px] sm:rounded-[50px] md:rounded-[60px]";

function Imagem({ projeto, src, altura, extra = "" }: { projeto: ProjetoPublico; src?: string; altura: string; extra?: string }) {
  return (
    <div className={`overflow-hidden ${raio} ${extra}`} style={{ height: altura }}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`Tela do site ${projeto.nome}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : (
        <Capa projeto={projeto} />
      )}
    </div>
  );
}

type CartaoProps = {
  projeto: ProjetoPublico;
  i: number;
  total: number;
  progresso: MotionValue<number>;
  modo: ModoValores;
  aoAbrir: (id: string) => void;
};

function Cartao({ projeto, i, total, progresso, modo, aoAbrir }: CartaoProps) {
  const escalaFinal = 1 - (total - 1 - i) * 0.03;
  const escala = useTransform(progresso, [i / total, 1], [1, escalaFinal]);
  const [a, b, c] = [projeto.imagens?.[0] ?? projeto.imagem, projeto.imagens?.[1], projeto.imagens?.[2]];

  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.article
        style={{ scale: escala, top: i * 28 }}
        className={`relative w-full origin-top border-2 border-claro bg-fundo p-4 sm:p-6 md:p-8 ${raio}`}
      >
        <div className="flex flex-wrap items-end justify-between gap-4 px-2 pb-4 sm:pb-6">
          <div className="flex items-end gap-4 sm:gap-6">
            <span aria-hidden="true" className="hero-heading font-black leading-none" style={{ fontSize: "clamp(3rem, 8vw, 110px)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="pb-1 sm:pb-3">
              <p className="text-xs font-light uppercase tracking-widest text-claro/70 sm:text-sm">
                Cliente{projeto.cliente ? ` · ${projeto.cliente}` : ""}
              </p>
              <h3 className="font-medium uppercase text-claro" style={{ fontSize: "clamp(1.1rem, 2.4vw, 2.2rem)" }}>
                {projeto.nome}
              </h3>
              <p className="text-sm font-light text-claro/70">
                {projeto.tipo} · {formatarValor(projeto.valor, modo)}
              </p>
            </div>
          </div>
          {projeto.link ? (
            <BotaoProjeto href={projeto.link} />
          ) : (
            <button
              type="button"
              onClick={() => aoAbrir(projeto.id)}
              aria-haspopup="dialog"
              className="shrink-0 rounded-full border-2 border-claro px-8 py-3 text-sm font-medium uppercase tracking-widest text-claro transition-colors duration-200 hover:bg-claro/10 sm:px-10 sm:py-3.5 sm:text-base"
            >
              Ver detalhes
            </button>
          )}
        </div>
        <div className="flex gap-3 sm:gap-4">
          <div className="flex w-[40%] flex-col gap-3 sm:gap-4">
            <Imagem projeto={projeto} src={b} altura="clamp(130px, 16vw, 230px)" />
            <Imagem projeto={projeto} src={c} altura="clamp(160px, 22vw, 340px)" />
          </div>
          <div className="w-[60%]">
            <Imagem projeto={projeto} src={a} altura="calc(clamp(130px, 16vw, 230px) + clamp(160px, 22vw, 340px) + 16px)" />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

type Props = { projetos: ProjetoPublico[]; modo: ModoValores; exemplos: boolean };

export function Projetos({ projetos, modo, exemplos }: Props) {
  const pilha = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: pilha, offset: ["start start", "end end"] });
  const [aberto, setAberto] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string | null>(null);

  const destaques = projetos.slice(0, DESTAQUES);
  const resto = projetos.slice(DESTAQUES);
  const tipos = useMemo(() => listarTipos(resto), [resto]);
  const visiveis = filtro ? resto.filter((p) => p.tipo === filtro) : resto;
  const projetoAberto = projetos.find((p) => p.id === aberto) ?? null;

  return (
    <section
      id="projetos"
      aria-labelledby="titulo-projetos"
      className="relative z-10 -mt-10 rounded-t-[40px] bg-fundo px-5 pb-24 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28"
    >
      <FadeIn
        as="h2"
        id="titulo-projetos"
        y={40}
        className="hero-heading text-center font-black uppercase leading-none tracking-tight"
        style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
      >
        Projetos
      </FadeIn>
      {exemplos && <p className="mt-6 text-center text-xs font-light text-claro/60">Projetos de exemplo, até os reais serem cadastrados.</p>}

      {projetos.length === 0 ? (
        <p className="mx-auto mt-16 max-w-md text-center text-claro/70">Nenhum projeto cadastrado ainda.</p>
      ) : (
        <div ref={pilha} className="mx-auto mt-12 max-w-6xl md:mt-20">
          {destaques.map((p, i) => (
            <Cartao key={p.id} projeto={p} i={i} total={destaques.length} progresso={scrollYProgress} modo={modo} aoAbrir={setAberto} />
          ))}
        </div>
      )}

      {resto.length > 0 && (
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-xl font-medium uppercase tracking-wider text-claro md:text-2xl">Mais projetos</h3>
            <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
              {[null, ...tipos].map((t) => (
                <button
                  key={t ?? "todos"}
                  type="button"
                  aria-pressed={filtro === t}
                  onClick={() => setFiltro(t)}
                  className="rounded-full border border-claro/30 px-4 py-2 text-xs font-medium uppercase tracking-widest text-claro transition-colors duration-200 hover:bg-claro/10 aria-pressed:border-claro aria-pressed:bg-claro aria-pressed:text-fundo"
                >
                  {t ?? "Todos"}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            {visiveis.map((p) => (
              <ProjetoCard key={p.id} projeto={p} modo={modo} aoAbrir={setAberto} />
            ))}
          </div>
        </div>
      )}

      <ProjetoDialog projeto={projetoAberto} modo={modo} aoFechar={() => setAberto(null)} />
    </section>
  );
}
