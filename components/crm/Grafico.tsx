"use client";

import { useState } from "react";
import { formatarReal } from "@/lib/formato";

const nomeMes = (mes: string) => {
  const [a, m] = mes.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(new Date(a, m - 1, 1)).replace(".", "");
};
const mesAno = (mes: string) => {
  const [a, m] = mes.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(a, m - 1, 1));
};

/** Recebido por mês: barras finas de uma série só, dica no hover/foco e tabela para leitor de tela. */
export function Grafico({ meses }: { meses: { mes: string; valor: number }[] }) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const max = Math.max(...meses.map((m) => m.valor), 0);

  if (max === 0) {
    return (
      <p className="grid h-48 place-items-center rounded-2xl border border-dashed border-claro/20 px-6 text-center text-sm font-light text-claro/80">
        Os recebimentos aparecem aqui assim que você registrar o primeiro pagamento.
      </p>
    );
  }

  return (
    <figure>
      <div className="relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((l) => (
            <div key={l} className="h-px bg-claro/10" />
          ))}
        </div>
        <div className="relative flex h-52 items-end gap-1 sm:gap-2" onMouseLeave={() => setAtivo(null)}>
          {meses.map((m, i) => {
            const altura = (m.valor / max) * 100;
            const atual = i === meses.length - 1;
            return (
              <button
                key={m.mes}
                type="button"
                onMouseEnter={() => setAtivo(i)}
                onFocus={() => setAtivo(i)}
                onBlur={() => setAtivo(null)}
                aria-label={`${mesAno(m.mes)}: ${m.valor ? formatarReal(m.valor) : "nada recebido"}`}
                className="relative flex h-full flex-1 items-end justify-center"
              >
                <span
                  className={`block w-full max-w-7 rounded-t-[4px] transition-opacity duration-200 ${atual ? "bg-[#d94bc8]" : "bg-claro/80"}`}
                  style={{ height: `${m.valor ? Math.max(altura, 2) : 0.6}%`, opacity: ativo === null || ativo === i ? 1 : 0.4 }}
                />
                {ativo === i && (
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-claro/20 bg-[#101012] px-3 py-2 text-left text-xs">
                    <span className="block capitalize text-claro/80">{mesAno(m.mes)}</span>
                    <span className="block font-medium text-white">{m.valor ? formatarReal(m.valor) : "Nada recebido"}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div aria-hidden="true" className="mt-3 flex gap-1 text-[11px] uppercase text-claro/70 sm:gap-2">
        {meses.map((m) => (
          <span key={m.mes} className="flex-1 text-center">
            {nomeMes(m.mes)}
          </span>
        ))}
      </div>
      <figcaption className="sr-only">Valor recebido em cada um dos últimos {meses.length} meses</figcaption>
      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">Mês</th>
            <th scope="col">Recebido</th>
          </tr>
        </thead>
        <tbody>
          {meses.map((m) => (
            <tr key={m.mes}>
              <td>{mesAno(m.mes)}</td>
              <td>{formatarReal(m.valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
