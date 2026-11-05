/**
 * Sessão do CRM: token "expiração.assinatura" (HMAC-SHA256), guardado num cookie httpOnly.
 * Só Web Crypto: funciona no proxy, nas páginas e nas server actions.
 */

export const COOKIE = "crm_sessao";
export const VALIDADE_DIAS = 30;

const enc = new TextEncoder();

function base64url(bytes: ArrayBuffer) {
  let s = "";
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(segredo: string, texto: string) {
  const chave = await crypto.subtle.importKey("raw", enc.encode(segredo), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return crypto.subtle.sign("HMAC", chave, enc.encode(texto));
}

/** Compara sem sair no primeiro byte diferente (não vaza pistas pelo tempo). */
function iguais(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function criarToken(segredo: string, agora = Date.now()): Promise<string> {
  const exp = String(agora + VALIDADE_DIAS * 86_400_000);
  return `${exp}.${base64url(await hmac(segredo, exp))}`;
}

export async function tokenValido(token: string | undefined, segredo: string, agora = Date.now()): Promise<boolean> {
  if (!token || !segredo) return false;
  const [exp, assinatura] = token.split(".");
  if (!exp || !assinatura || !/^\d+$/.test(exp) || Number(exp) < agora) return false;
  return iguais(assinatura, base64url(await hmac(segredo, exp)));
}

export async function senhaCorreta(digitada: string, senha: string | undefined): Promise<boolean> {
  if (!senha) return false;
  // Compara as assinaturas (mesmo tamanho) em vez das senhas
  const [a, b] = await Promise.all([hmac(senha, digitada), hmac(senha, senha)]);
  return iguais(base64url(a), base64url(b));
}

/** Segredo de assinatura: CRM_SEGREDO, ou a própria senha (trocar a senha derruba as sessões). */
export const segredoDoAmbiente = () => process.env.CRM_SEGREDO || process.env.CRM_SENHA || "";
