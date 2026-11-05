"use client";

import { ArrowUpRightIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useCallback, useState, useTransition } from "react";
import { excluirProjeto, removerPagamento } from "@/app/acoes";
import { falta, recebido, situacao, type Projeto, type Situacao } from "@/lib/financeiro";
import { dataBR, formatarReal } from "@/lib/formato";
import { Dialogo } from "./Dialogo";
import { FormPagamento } from "./FormPagamento";
import { FormProjeto } from "./FormProjeto";
import { botaoPrincipal, botaoVazado, cartao } from "./estilos";

const filtros: { id: "todos" | "receber" | "pago"; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "receber", rotulo: "A receber" },
  { id: "pago", rotulo: "Pagos" },
];

const selo: Record<Situacao, { texto: string; classe: string }> = {
  pago: { texto: "Pago", classe: "border-[#8ff0b4]/40 text-[#8ff0b4]" },
  parcial: { texto: "Parcial", classe: "border-[#ffd27a]/40 text-[#ffd27a]" },
  pendente: { texto: "Pendente", classe: "border-[#ff8fa6]/40 text-[#ff8fa6]" },
};

type Janela = { tipo: "novo" } | { tipo: "editar"; p: Projeto } | { tipo: "pagar"; p: Projeto } | null;

export function ListaProjetos({ projetos, bancoOk }: { projetos: Projeto[]; bancoOk: boolean }) {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["id"]>("todos");
  const [janela, setJanela] = useState<Janela>(null);
  const [aviso, setAviso] = useState("");
  const [abertos, setAbertos] = useState<Set<string>>(new Set());
  const [, iniciar] = useTransition();

  const fechar = useCallback(() => setJanela(null), []);
  const aoSalvar = useCallback((msg: string) => {
    setJanela(null);
    setAviso(msg);
  }, []);

  const visiveis = projetos.filter((p) => (filtro === "todos" ? true : filtro === "pago" ? situacao(p) === "pago" : situacao(p) !== "pago"));
  const alternar = (id: string) =>
    setAbertos((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <section aria-labelledby="titulo-projetos" className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="titulo-projetos" className="hero-heading text-4xl font-black uppercase leading-none tracking-tight md:text-5xl">
          Projetos
        </h2>
        <button type="button" disabled={!bancoOk} onClick={() => setJanela({ tipo: "novo" })} className={`${botaoPrincipal} inline-flex items-center gap-2`}>
          <PlusIcon weight="bold" className="size-4" aria-hidden="true" /> Novo projeto
        </button>
      </div>

      <div role="group" aria-label="Filtrar projetos" className="mt-6 flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filtro === f.id}
            onClick={() => setFiltro(f.id)}
            className="rounded-full border border-claro/25 px-4 py-2 text-xs font-medium uppercase tracking-widest text-claro transition-colors duration-200 hover:bg-claro/10 aria-pressed:border-claro aria-pressed:bg-claro aria-pressed:text-fundo"
          >
            {f.rotulo}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-4 min-h-5 text-sm text-[#8ff0b4]">
        {aviso}
      </p>

      {visiveis.length === 0 ? (
        <div className={`${cartao} mt-2 px-6 py-14 text-center font-light text-claro/80`}>
          {projetos.length === 0 ? "Nenhum projeto ainda. Clique em “Novo projeto” para cadastrar a primeira venda." : "Nenhum projeto neste filtro."}
        </div>
      ) : (
        <ul className="mt-2 flex flex-col gap-3">
          {visiveis.map((p) => {
            const r = recebido(p);
            const f = falta(p);
            const s = situacao(p);
            const pct = p.valor ? Math.min(100, (r / p.valor) * 100) : 0;
            const aberto = abertos.has(p.id);
            return (
              <li key={p.id} className={`${cartao} p-5 sm:p-6`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-widest text-claro/80">
                      {p.cliente} · {dataBR(p.data)}
                    </p>
                    <h3 className="mt-1 flex items-center gap-2 text-xl font-medium uppercase text-white">
                      <span className="truncate">{p.nome}</span>
                      {p.link && (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" aria-label={`Abrir o site ${p.nome}`} className="shrink-0 text-claro/80 hover:text-white">
                          <ArrowUpRightIcon className="size-4" />
                        </a>
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-widest ${selo[s].classe}`}>{selo[s].texto}</span>
                    <p className="hero-heading text-2xl font-black tracking-tight">{formatarReal(p.valor)}</p>
                  </div>
                </div>

                {/* Progresso do pagamento */}
                <div className="mt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-claro/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label={`Recebido ${Math.round(pct)}%`}>
                    <div className="h-full rounded-full bg-gradient-to-r from-[#7621b0] to-[#d94bc8]" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-2 text-sm font-light text-claro">
                    Recebido <strong className="font-medium text-white">{formatarReal(r)}</strong>
                    {f > 0 && (
                      <>
                        {" "}
                        · falta <strong className="font-medium text-white">{formatarReal(f)}</strong>
                      </>
                    )}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {f > 0 && (
                    <button type="button" onClick={() => setJanela({ tipo: "pagar", p })} className={botaoVazado}>
                      Registrar pagamento
                    </button>
                  )}
                  <button type="button" onClick={() => setJanela({ tipo: "editar", p })} className={botaoVazado}>
                    Editar
                  </button>
                  {p.pagamentos.length > 0 && (
                    <button type="button" aria-expanded={aberto} onClick={() => alternar(p.id)} className={botaoVazado}>
                      {aberto ? "Esconder pagamentos" : `Pagamentos (${p.pagamentos.length})`}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Excluir ${p.nome} (${p.cliente})? Isso apaga também os pagamentos registrados.`)) iniciar(() => excluirProjeto(p.id));
                    }}
                    className={`${botaoVazado} hover:border-[#ff8fa6] hover:text-[#ff8fa6]`}
                  >
                    Excluir
                  </button>
                </div>

                {aberto && (
                  <ul className="mt-4 flex flex-col divide-y divide-claro/10 rounded-2xl border border-claro/10">
                    {[...p.pagamentos]
                      .sort((a, b) => a.data.localeCompare(b.data))
                      .map((x) => (
                        <li key={x.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                          <span className="text-claro">{dataBR(x.data)}</span>
                          <span className="ml-auto font-medium text-white">{formatarReal(x.valor)}</span>
                          <button
                            type="button"
                            aria-label={`Remover pagamento de ${formatarReal(x.valor)} em ${dataBR(x.data)}`}
                            onClick={() => {
                              if (confirm(`Remover o pagamento de ${formatarReal(x.valor)}?`)) iniciar(() => removerPagamento(p.id, x.id));
                            }}
                            className="grid size-8 place-items-center rounded-full text-claro/80 hover:bg-claro/10 hover:text-[#ff8fa6]"
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Dialogo aberto={janela?.tipo === "novo" || janela?.tipo === "editar"} aoFechar={fechar} titulo={janela?.tipo === "editar" ? "Editar projeto" : "Novo projeto"}>
        {(janela?.tipo === "novo" || janela?.tipo === "editar") && (
          <FormProjeto key={janela.tipo === "editar" ? janela.p.id : "novo"} projeto={janela.tipo === "editar" ? janela.p : undefined} aoSalvar={aoSalvar} />
        )}
      </Dialogo>
      <Dialogo aberto={janela?.tipo === "pagar"} aoFechar={fechar} titulo="Pagamento">
        {janela?.tipo === "pagar" && <FormPagamento key={janela.p.id} projeto={janela.p} aoSalvar={aoSalvar} />}
      </Dialogo>
    </section>
  );
}
