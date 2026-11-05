/** Um projeto vendido: o site no ar e quanto rendeu. */
export type Ganho = {
  id: string;
  link: string;
  nome: string;
  valor: number;
  /** ISO 8601 */
  criadoEm: string;
};

/**
 * Lê um valor em reais do jeito que a pessoa digitar.
 * "4850", "4.850", "4.850,00", "R$ 4.850,50", "4850.5". Devolve null se não for um valor positivo.
 */
export function lerValorBR(entrada: string): number | null {
  let s = entrada.replace(/R\$/gi, "").replace(/\s/g, "");
  if (!/^\d[\d.,]*$/.test(s)) return null;
  if (s.includes(",")) {
    // Vírgula é o decimal; pontos são separadores de milhar
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(".")) {
    const partes = s.split(".");
    const ultima = partes[partes.length - 1];
    // "4.850" ou "1.250.000": pontos de milhar. "4850.5" ou "99.90": decimal.
    s = partes.length > 2 || ultima.length === 3 ? partes.join("") : s;
  }
  const v = Number(s);
  if (!Number.isFinite(v) || v <= 0) return null;
  return Math.round(v * 100) / 100;
}

/** Aceita o link com ou sem https. Devolve null se não for um endereço de site público. */
export function normalizarLink(entrada: string): string | null {
  const t = entrada.trim();
  if (!t || /\s/.test(t)) return null;
  const comProtocolo = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  try {
    const u = new URL(comProtocolo);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

/** Nome padrão a partir do link: "clinica-vertebra.vercel.app" → "Clinica Vertebra"; domínio próprio fica como está. */
export function nomeDoLink(link: string): string {
  const host = new URL(link).hostname.replace(/^www\./, "");
  if (host.endsWith(".vercel.app")) {
    return host
      .replace(/\.vercel\.app$/, "")
      .split("-")
      .filter(Boolean)
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join(" ");
  }
  return host;
}

export const saldo = (ganhos: Pick<Ganho, "valor">[]) => Math.round(ganhos.reduce((s, g) => s + g.valor, 0) * 100) / 100;

const real = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatarReal = (v: number) => real.format(v).replace(/,00$/, "");

/** Print automático do site no ar (serviço de screenshot; se falhar, a capa tipográfica aparece no lugar). */
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
