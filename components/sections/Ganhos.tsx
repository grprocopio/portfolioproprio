import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { BotaoRemover } from "@/components/BotaoRemover";
import { Contador } from "@/components/Contador";
import { FormProjeto } from "@/components/FormProjeto";
import { PrintSite } from "@/components/PrintSite";
import { FadeIn } from "@/components/anim/FadeIn";
import { armazem } from "@/lib/armazem";
import { formatarReal, saldo, type Ganho } from "@/lib/ganhos";

async function carregar(): Promise<{ configurado: boolean; ganhos: Ganho[]; erro: boolean }> {
  const banco = armazem();
  if (!banco) return { configurado: false, ganhos: [], erro: false };
  try {
    const ganhos = (await banco.listar()).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
    return { configurado: true, ganhos, erro: false };
  } catch {
    return { configurado: true, ganhos: [], erro: true };
  }
}

const titulo = "hero-heading font-black uppercase leading-none tracking-tight";

export async function Ganhos() {
  const { configurado, ganhos, erro } = await carregar();
  const total = saldo(ganhos);

  return (
    <section id="ganhos" aria-labelledby="titulo-ganhos" className="px-5 py-24 sm:px-8 md:px-10 md:py-32">
      {/* Saldo */}
      <div className="flex flex-col items-center gap-4 text-center">
        <FadeIn as="h2" id="titulo-ganhos" y={20} className="text-sm font-medium uppercase tracking-[0.3em] text-claro md:text-base">
          O que já ganhei
        </FadeIn>
        <FadeIn y={40} delay={0.1}>
          <p className={titulo} style={{ fontSize: "clamp(3rem, 13vw, 180px)" }}>
            <Contador valor={total} formato="moeda" />
          </p>
        </FadeIn>
        <FadeIn as="p" delay={0.2} className="font-light uppercase tracking-widest text-claro/70">
          {ganhos.length === 1 ? "em 1 projeto vendido" : `em ${ganhos.length} projetos vendidos`}
        </FadeIn>
      </div>

      {/* Projetos */}
      <div id="projetos" className="mx-auto mt-20 max-w-6xl scroll-mt-10 md:mt-28">
        {erro && <p className="rounded-3xl border-2 border-[#ff8fa6]/40 p-6 text-center text-claro">Não consegui ler os projetos agora. Recarregue a página em alguns segundos.</p>}
        {!erro && ganhos.length === 0 && (
          <p className="rounded-[40px] border-2 border-dashed border-claro/25 px-6 py-16 text-center font-light text-claro/70">
            Nenhum projeto ainda. Adicione o primeiro logo abaixo e ele aparece aqui com o print do site.
          </p>
        )}
        {ganhos.length > 0 && (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ganhos.map((g, i) => (
              <FadeIn as="li" key={g.id} delay={Math.min(i, 6) * 0.06} className="group flex flex-col overflow-hidden rounded-[36px] border-2 border-claro/80 bg-fundo p-3">
                <div className="aspect-[16/10] overflow-hidden rounded-[26px]">
                  <PrintSite link={g.link} nome={g.nome} />
                </div>
                <div className="flex flex-1 flex-col gap-4 px-3 pb-2 pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-medium uppercase text-white">{g.nome}</h3>
                      <a
                        href={g.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-sm font-light text-claro/70 transition-opacity duration-200 hover:opacity-70"
                      >
                        {new URL(g.link).hostname.replace(/^www\./, "")}
                        <ArrowUpRightIcon aria-hidden="true" className="size-3.5 shrink-0" />
                      </a>
                    </div>
                    <p className={`${titulo} shrink-0 text-2xl`}>{formatarReal(g.valor)}</p>
                  </div>
                  <div className="mt-auto">
                    <BotaoRemover id={g.id} nome={g.nome} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </ul>
        )}
      </div>

      {/* Adicionar */}
      <div id="adicionar" className="mx-auto mt-24 max-w-2xl scroll-mt-10 md:mt-32">
        <FadeIn as="h2" y={40} className={`${titulo} mb-10 text-center`} style={{ fontSize: "clamp(2.5rem, 8vw, 96px)" }}>
          Adicionar projeto
        </FadeIn>
        {!configurado && (
          <div className="mb-8 rounded-3xl border-2 border-claro/25 p-6 text-sm font-light leading-relaxed text-claro">
            <p className="font-medium text-white">Falta ativar o banco onde os projetos ficam guardados.</p>
            <p className="mt-2">
              Na Vercel: abra o projeto, vá em <strong className="font-medium text-white">Storage</strong>, crie um banco <strong className="font-medium text-white">Upstash Redis</strong> (gratuito) e conecte a este projeto. Depois faça um novo deploy.
            </p>
          </div>
        )}
        <div className="rounded-[40px] border-2 border-claro/80 p-6 sm:p-10">
          <FormProjeto desativado={!configurado} />
        </div>
      </div>
    </section>
  );
}
