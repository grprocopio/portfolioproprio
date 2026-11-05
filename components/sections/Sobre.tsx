import { Contador } from "@/components/Contador";
import { GraficoMensal } from "@/components/GraficoMensal";
import { RevelarPalavras } from "@/components/RevelarPalavras";
import { site } from "@/data/site";
import { formatarTotal, formatarValor, type Resumo } from "@/lib/projetos";

type Props = { resumo: Resumo; exemplos: boolean };

export function Sobre({ resumo, exemplos }: Props) {
  const modo = site.modoValores;
  const numeros = [
    {
      rotulo: "Faturamento total",
      el: (
        <Contador valor={resumo.total} formato="moeda" textoFixo={modo === "faixa" ? formatarTotal(resumo.total, modo) : undefined} />
      ),
    },
    { rotulo: "Projetos entregues", el: <Contador valor={resumo.quantidade} formato="numero" /> },
    {
      rotulo: "Ticket médio",
      el: (
        <Contador
          valor={resumo.ticketMedio}
          formato="moeda"
          textoFixo={modo === "faixa" ? formatarValor(resumo.ticketMedio, modo) : undefined}
        />
      ),
    },
  ];

  return (
    <section id="sobre" aria-labelledby="titulo-sobre" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="md:w-7/12">
          <h2 id="titulo-sobre" className="text-sm text-apagado">
            Sobre mim
          </h2>
          <div className="mt-4 h-px w-full max-w-sm bg-borda" aria-hidden="true" />
          <RevelarPalavras
            className="titulo mt-8 text-4xl md:text-5xl"
            texto={`Sou ${site.nome.split(" ")[0]}, desenvolvedor freelancer. Desenho e programo sites que carregam rápido, aparecem no Google e transformam visita em *conversa* no WhatsApp. Você fala direto comigo, do primeiro rascunho ao site no ar.`}
          />
        </div>

        <div className="mt-24 md:w-7/12">
          <h3 className="titulo text-4xl md:text-5xl">
            Resultados em <em>números</em>.
          </h3>
          <dl className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {numeros.map((n) => (
              <div key={n.rotulo} className="border-t border-borda pt-4">
                <dt className="text-sm text-apagado">{n.rotulo}</dt>
                <dd className="titulo mt-2 text-4xl text-forte lg:text-5xl">{n.el}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 rounded-2xl border border-borda bg-superficie/70 p-6 backdrop-blur-md">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-base font-semibold text-forte">Faturamento por mês</h4>
              <p className="text-sm text-apagado">Passe o mouse nas barras para ver cada mês</p>
            </div>
            <div className="mt-8">
              <GraficoMensal porMes={resumo.porMes} modo={modo} />
            </div>
          </div>
          {exemplos && (
            <p className="mt-4 text-xs text-apagado">Números de exemplo, calculados a partir de projetos fictícios.</p>
          )}
        </div>
      </div>
    </section>
  );
}
