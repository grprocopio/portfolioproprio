import { site } from "@/data/site";

/** Projetos próprios: repositórios públicos do GitHub (tópico "portfolio") + domínios da Vercel. */

export type Resultado<T> = { ok: true; dados: T } | { ok: false; erro: string };

export type Repo = {
  nome: string;
  descricao: string;
  url: string;
  homepage?: string;
  linguagem?: string;
  estrelas: number;
  atualizado: string;
  topicos: string[];
};

export type ProjetoVercel = { nome: string; repo?: string; url?: string };

export type ProjetoProprio = Repo & { link?: string };

const UMA_HORA = 3600;

type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  topics?: string[];
  private: boolean;
};

export async function buscarRepos(
  fetcher: typeof fetch = fetch,
  token: string | undefined = process.env.GITHUB_TOKEN,
): Promise<Resultado<Repo[]>> {
  try {
    const res = await fetcher(
      `https://api.github.com/users/${site.githubUsuario}/repos?per_page=100&sort=pushed&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: UMA_HORA },
      } as RequestInit,
    );
    if (!res.ok) return { ok: false, erro: `GitHub respondeu ${res.status}` };
    const lista = (await res.json()) as GithubRepo[];
    const dados = lista
      // Nunca expor repositórios privados (de clientes), nem mesmo metadados
      .filter((r) => !r.private && r.topics?.includes(site.githubTopic))
      .map((r) => ({
        nome: r.name,
        descricao: r.description ?? "",
        url: r.html_url,
        homepage: r.homepage || undefined,
        linguagem: r.language ?? undefined,
        estrelas: r.stargazers_count,
        atualizado: r.pushed_at,
        topicos: (r.topics ?? []).filter((t) => t !== site.githubTopic),
      }));
    return { ok: true, dados };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : "Falha de rede" };
  }
}

type VercelProjeto = {
  name: string;
  link?: { repo?: string };
  targets?: { production?: { alias?: string[] } };
};

export async function buscarVercel(
  fetcher: typeof fetch = fetch,
  token: string | undefined = process.env.VERCEL_TOKEN,
  time: string | undefined = process.env.VERCEL_TEAM_ID,
): Promise<Resultado<ProjetoVercel[]>> {
  if (!token) return { ok: false, erro: "VERCEL_TOKEN não configurado" };
  try {
    const qs = new URLSearchParams({ limit: "100", ...(time ? { teamId: time } : {}) });
    const res = await fetcher(`https://api.vercel.com/v9/projects?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: UMA_HORA },
    } as RequestInit);
    if (!res.ok) return { ok: false, erro: `Vercel respondeu ${res.status}` };
    const { projects } = (await res.json()) as { projects: VercelProjeto[] };
    const dados = projects.map((p) => {
      const alias = p.targets?.production?.alias ?? [];
      // Prefere domínio próprio ao subdomínio .vercel.app
      const dominio = alias.find((a) => !a.endsWith(".vercel.app")) ?? alias[0];
      return { nome: p.name, repo: p.link?.repo, url: dominio ? `https://${dominio}` : undefined };
    });
    return { ok: true, dados };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : "Falha de rede" };
  }
}

/** Só repositórios públicos marcados entram; a Vercel apenas completa o link no ar. */
export function juntarProprios(repos: Repo[], vercel: ProjetoVercel[]): ProjetoProprio[] {
  return repos.map((r) => {
    const v = vercel.find((p) => p.repo?.toLowerCase() === r.nome.toLowerCase());
    return { ...r, link: v?.url ?? r.homepage };
  });
}

/** Print automático do site no ar (serviço de screenshot; a imagem passa pelo otimizador do Next e fica em cache). */
export function printUrl(url: string): string {
  const qs = new URLSearchParams({
    url,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    "viewport.width": "1280",
    "viewport.height": "800",
  });
  return `https://api.microlink.io/?${qs}`;
}
