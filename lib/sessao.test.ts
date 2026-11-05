import { describe, expect, it } from "vitest";
import { criarToken, senhaCorreta, tokenValido } from "./sessao";

const S = "segredo-de-teste";
const DIA = 86_400_000;

describe("token de sessão", () => {
  it("token recém-criado é válido", async () => {
    expect(await tokenValido(await criarToken(S), S)).toBe(true);
  });

  it("token adulterado é recusado", async () => {
    const t = await criarToken(S);
    const [exp, assinatura] = t.split(".");
    expect(await tokenValido(`${Number(exp) + 999999}.${assinatura}`, S)).toBe(false);
    expect(await tokenValido(`${exp}.${assinatura.slice(0, -2)}xx`, S)).toBe(false);
  });

  it("token de outro segredo é recusado (trocar a senha derruba as sessões)", async () => {
    expect(await tokenValido(await criarToken("outro"), S)).toBe(false);
  });

  it("token vencido é recusado", async () => {
    const agora = Date.now();
    const t = await criarToken(S, agora - 31 * DIA);
    expect(await tokenValido(t, S, agora)).toBe(false);
  });

  it("sem token ou sem segredo configurado, nunca é válido", async () => {
    expect(await tokenValido(undefined, S)).toBe(false);
    expect(await tokenValido("lixo", S)).toBe(false);
    expect(await tokenValido(await criarToken(S), "")).toBe(false);
  });
});

describe("senhaCorreta", () => {
  it("aceita a senha certa e recusa a errada", async () => {
    expect(await senhaCorreta("minha senha", "minha senha")).toBe(true);
    expect(await senhaCorreta("minha senhA", "minha senha")).toBe(false);
  });

  it("sem senha configurada, ninguém entra", async () => {
    expect(await senhaCorreta("", "")).toBe(false);
    expect(await senhaCorreta("qualquer", undefined)).toBe(false);
  });
});
