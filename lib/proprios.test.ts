import { describe, expect, it } from "vitest";
import { buscarRepos, buscarVercel, juntarProprios, printUrl } from "./proprios";

const resposta = (corpo: unknown, status = 200) =>
  (async () => new Response(JSON.stringify(corpo), { status })) as unknown as typeof fetch;

const repo = (extra: Record<string, unknown> = {}) => ({
  name: "meu-app",
  description: "Um app",
  html_url: "https://github.com/grprocopio/meu-app",
  homepage: "",
  language: "TypeScript",
  stargazers_count: 3,
  pushed_at: "2026-09-01T10:00:00Z",
  topics: ["portfolio"],
  private: false,
  fork: false,
  ...extra,
});

describe("buscarRepos", () => {
  it("mantém só repositórios públicos com o tópico portfolio", async () => {
    const r = await buscarRepos(
      resposta([
        repo(),
        repo({ name: "sem-topico", topics: [] }),
        repo({ name: "cliente-privado", private: true }),
      ]),
    );
    expect(r.ok && r.dados.map((x) => x.nome)).toEqual(["meu-app"]);
  });

  it("erro HTTP vira resultado de falha, sem lançar", async () => {
    const r = await buscarRepos(resposta({ message: "rate limit" }, 403));
    expect(r.ok).toBe(false);
  });

  it("falha de rede vira resultado de falha, sem lançar", async () => {
    const quebrado = (async () => {
      throw new Error("offline");
    }) as unknown as typeof fetch;
    const r = await buscarRepos(quebrado);
    expect(r).toEqual({ ok: false, erro: expect.any(String) });
  });
});

describe("buscarVercel", () => {
  it("sem token não chama a API e devolve falha", async () => {
    let chamou = false;
    const espiao = (async () => {
      chamou = true;
      return new Response("{}");
    }) as unknown as typeof fetch;
    const r = await buscarVercel(espiao, undefined);
    expect(r.ok).toBe(false);
    expect(chamou).toBe(false);
  });

  it("lê nome, repositório ligado e domínio de produção", async () => {
    const r = await buscarVercel(
      resposta({
        projects: [
          { name: "meu-app", link: { type: "github", repo: "meu-app" }, targets: { production: { alias: ["meuapp.com.br", "meu-app.vercel.app"] } } },
          { name: "solto" },
        ],
      }),
      "token-falso",
    );
    expect(r).toEqual({
      ok: true,
      dados: [
        { nome: "meu-app", repo: "meu-app", url: "https://meuapp.com.br" },
        { nome: "solto", repo: undefined, url: undefined },
      ],
    });
  });

  it("erro HTTP da Vercel vira falha", async () => {
    expect((await buscarVercel(resposta({}, 401), "x")).ok).toBe(false);
  });
});

describe("juntarProprios", () => {
  it("usa o domínio da Vercel quando o repositório está ligado a um projeto", async () => {
    const r = await buscarRepos(resposta([repo()]));
    if (!r.ok) throw new Error("esperava sucesso");
    const [p] = juntarProprios(r.dados, [{ nome: "x", repo: "Meu-App", url: "https://meuapp.com.br" }]);
    expect(p.link).toBe("https://meuapp.com.br");
  });

  it("sem Vercel, usa o homepage do repositório ou nada", async () => {
    const r = await buscarRepos(resposta([repo({ homepage: "https://site.dev" }), repo({ name: "b" })]));
    if (!r.ok) throw new Error("esperava sucesso");
    const ps = juntarProprios(r.dados, []);
    expect(ps.map((p) => p.link)).toEqual(["https://site.dev", undefined]);
  });

  it("não inclui projetos da Vercel sem repositório público marcado", () => {
    expect(juntarProprios([], [{ nome: "cliente", repo: "cliente-privado", url: "https://c.com" }])).toEqual([]);
  });
});

describe("printUrl", () => {
  it("gera a URL de screenshot com o endereço codificado", () => {
    expect(printUrl("https://a.com/x?y=1")).toContain(encodeURIComponent("https://a.com/x?y=1"));
  });
});
