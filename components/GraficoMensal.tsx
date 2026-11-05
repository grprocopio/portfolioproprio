"use client";

import { useState } from "react";
import type { ModoValores } from "@/data/site";
import { formatarValor, nomeMes } from "@/lib/projetos";

type Props = { porMes: { mes: string; valor: number }[]; modo: ModoValores };

/** Faturamento por mês: barras finas monocromáticas, dica no hover/foco e tabela para leitor de tela. */
export function GraficoMensal({ porMes, modo }: Props) {
  const [ativo, setAtivo] = useState<number | null>(null);

  if (porMes.length === 0) {
    return (
      <div className="grid h-48 place-items-center rounded-xl border border-borda text-sm text-apagado">
        As vendas aparecem aqui assim que o primeiro projeto for registrado.
      </div>
    );
  }

  const max = Math.max(...porMes.map((m) => m.valor));
  const marcas = [0, Math.floor((porMes.length - 1) / 2), porMes.length - 1];

  return (
    <figure>
      <div className="relative">
        {/* Linhas de grade discretas */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((l) => (
            <div key={l} className="h-px bg-white/5" />
          ))}
        </div>

        <div className="relative flex h-48 items-end gap-0.5 md:h-56" onMouseLeave={() => setAtivo(null)}>
          {porMes.map((m, i) => {
            const altura = max ? (m.valor / max) * 100 : 0;
            const destaque = ativo === null || ativo === i;
            return (
              <button
                key={m.mes}
                type="button"
                className="group relative flex h-full flex-1 items-end justify-center focus-visible:outline-offset-0"
                onMouseEnter={() => setAtivo(i)}
                onFocus={() => setAtivo(i)}
                onBlur={() => setAtivo(null)}
                aria-label={`${nomeMes(m.mes)}: ${m.valor ? formatarValor(m.valor, modo) : "sem vendas"}`}
              >
                <span
                  className="block w-full max-w-6 rounded-t bg-texto transition-opacity duration-300 ease-suave"
                  style={{ height: `${Math.max(altura, m.valor ? 2 : 0.5)}%`, opacity: destaque ? 1 : 0.35 }}
                />
                {ativo === i && (
                  <span
                    role="presentation"
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-borda-forte bg-superficie-2 px-3 py-2 text-left text-xs shadow-lg"
                  >
                    <span className="block text-apagado">{nomeMes(m.mes)}</span>
                    <span className="block font-semibold text-forte">
                      {m.valor ? formatarValor(m.valor, modo) : "Sem vendas"}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div aria-hidden="true" className="mt-3 flex justify-between text-xs text-apagado">
        {marcas.map((i) => (
          <span key={i}>{nomeMes(porMes[i].mes)}</span>
        ))}
      </div>

      <figcaption className="sr-only">Faturamento por mês</figcaption>
      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">Mês</th>
            <th scope="col">Faturamento</th>
          </tr>
        </thead>
        <tbody>
          {porMes.map((m) => (
            <tr key={m.mes}>
              <td>{nomeMes(m.mes)}</td>
              <td>{formatarValor(m.valor, modo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
