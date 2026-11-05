import type { ModoValores } from "@/data/site";
import { formatarValor, type ProjetoPublico } from "@/lib/projetos";

/** Capa: print do site quando existe; senão, uma capa tipográfica com o nome do projeto. */
export function Capa({ projeto, className = "" }: { projeto: ProjetoPublico; className?: string }) {
  if (projeto.imagem) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={projeto.imagem}
        alt={`Página inicial do site ${projeto.nome}`}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover object-top grayscale ${className}`}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className={`relative grid h-full w-full place-items-center overflow-hidden bg-[#131313] ${className}`}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0,transparent_11px,rgb(255_255_255/0.035)_11px,rgb(255_255_255/0.035)_12px)]" />
      <span className="titulo relative px-6 text-center text-3xl text-white/80">{projeto.nome}</span>
    </div>
  );
}

type Props = { projeto: ProjetoPublico; modo: ModoValores; aoAbrir: (id: string) => void };

export function ProjetoCard({ projeto, modo, aoAbrir }: Props) {
  return (
    <article className="group">
      <button
        type="button"
        onClick={() => aoAbrir(projeto.id)}
        className="block w-full rounded-2xl border border-borda bg-superficie p-2 text-left transition duration-500 ease-suave hover:-translate-y-1 hover:border-borda-forte hover:bg-superficie-2 active:scale-[0.98]"
        aria-haspopup="dialog"
      >
        <div className="aspect-[4/3] overflow-hidden rounded-lg">
          <Capa projeto={projeto} className="transition-transform duration-700 ease-suave group-hover:scale-[1.03]" />
        </div>
        <div className="flex items-start justify-between gap-4 px-2 pb-2 pt-4">
          <div>
            <h3 className="text-lg font-semibold text-forte">{projeto.nome}</h3>
            <p className="mt-1 text-sm text-apagado">
              {projeto.tipo}
              {projeto.cliente ? ` para ${projeto.cliente}` : ""}
            </p>
          </div>
          <p className="shrink-0 pt-1 text-sm tabular-nums text-texto">{formatarValor(projeto.valor, modo)}</p>
        </div>
      </button>
    </article>
  );
}
