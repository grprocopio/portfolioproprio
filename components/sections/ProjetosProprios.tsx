import { ArrowUpRightIcon, GithubLogoIcon, StarIcon } from "@phosphor-icons/react/dist/ssr";
import { PrintSite } from "@/components/PrintSite";
import { site } from "@/data/site";
import { buscarRepos, buscarVercel, juntarProprios } from "@/lib/proprios";

const perfil = `https://github.com/${site.githubUsuario}`;

function Cabecalho() {
  return (
    <div className="max-w-md">
      <p className="text-sm text-apagado">Projetos próprios</p>
      <h2 id="titulo-proprios" className="titulo mt-4 text-5xl md:text-6xl">
        O que eu construo por <em>conta</em> própria.
      </h2>
      <p className="mt-6 max-w-sm text-base text-texto">
        Experimentos e ferramentas que publico no GitHub. Atualizados sozinhos a cada hora.
      </p>
    </div>
  );
}

function Moldura({ children }: { children: React.ReactNode }) {
  return (
    <section id="proprios" aria-labelledby="titulo-proprios" className="relative px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Cabecalho />
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function Aviso({ texto }: { texto: string }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-borda bg-superficie/70 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-texto">{texto}</p>
      <a
        href={perfil}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-forte transition duration-300 ease-suave hover:bg-white/10 active:scale-[0.98]"
      >
        <GithubLogoIcon className="size-4" aria-hidden="true" /> Abrir perfil no GitHub
      </a>
    </div>
  );
}

export function ProjetosPropriosCarregando() {
  return (
    <Moldura>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Carregando projetos">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-borda bg-superficie p-2">
            <div className="aspect-[16/10] animate-pulse rounded-lg bg-superficie-2" />
            <div className="space-y-2 p-2 pt-4">
              <div className="h-4 w-1/2 animate-pulse rounded bg-superficie-2" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-superficie-2" />
            </div>
          </div>
        ))}
      </div>
    </Moldura>
  );
}

export async function ProjetosProprios() {
  const [repos, vercel] = await Promise.all([buscarRepos(), buscarVercel()]);

  if (!repos.ok) {
    return (
      <Moldura>
        <Aviso texto="Não foi possível carregar os projetos do GitHub agora. Eles continuam disponíveis direto no perfil." />
      </Moldura>
    );
  }

  const projetos = juntarProprios(repos.dados, vercel.ok ? vercel.dados : []);

  if (projetos.length === 0) {
    return (
      <Moldura>
        <Aviso texto={`Nenhum repositório com o tópico "${site.githubTopic}" ainda. Enquanto isso, o perfil tem tudo o que está público.`} />
      </Moldura>
    );
  }

  return (
    <Moldura>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projetos.map((p) => (
          <li key={p.nome} className="group flex flex-col rounded-2xl border border-borda bg-superficie p-2 transition duration-500 ease-suave hover:border-borda-forte hover:bg-superficie-2">
            <div className="aspect-[16/10] overflow-hidden rounded-lg">
              <PrintSite link={p.link} nome={p.nome} />
            </div>
            <div className="flex flex-1 flex-col p-2 pt-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-forte">{p.nome}</h3>
                {p.estrelas > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-apagado">
                    <StarIcon className="size-3" aria-hidden="true" />
                    <span className="sr-only">Estrelas:</span> {p.estrelas}
                  </span>
                )}
              </div>
              {p.descricao && <p className="mt-1 text-sm text-apagado">{p.descricao}</p>}
              {p.linguagem && <p className="mt-3 text-xs text-apagado">{p.linguagem}</p>}
              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm font-semibold text-black transition duration-300 ease-suave hover:bg-neutral-200 active:scale-[0.98]"
                  >
                    Ver no ar <ArrowUpRightIcon className="size-4" aria-hidden="true" />
                    <span className="sr-only">: {p.nome}</span>
                  </a>
                )}
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-2 text-sm font-semibold text-forte transition duration-300 ease-suave hover:bg-white/10 active:scale-[0.98]"
                >
                  Código <ArrowUpRightIcon className="size-4" aria-hidden="true" />
                  <span className="sr-only">: {p.nome}</span>
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Moldura>
  );
}
