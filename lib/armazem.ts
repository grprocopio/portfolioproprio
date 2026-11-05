import "server-only";
import { Redis } from "@upstash/redis";
import type { Ganho } from "./ganhos";

/** Onde os projetos ficam guardados. Só no servidor: as chaves do banco nunca vão para o navegador. */
export type Armazem = {
  listar(): Promise<Ganho[]>;
  salvar(g: Ganho): Promise<void>;
  remover(id: string): Promise<void>;
};

const CHAVE = "portfolio:ganhos";

function redis(): Armazem | null {
  // Nomes criados pela integração Upstash da Vercel (os dois formatos existem)
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const r = new Redis({ url, token });
  return {
    async listar() {
      const tudo = (await r.hgetall<Record<string, Ganho>>(CHAVE)) ?? {};
      return Object.values(tudo);
    },
    async salvar(g) {
      await r.hset(CHAVE, { [g.id]: g });
    },
    async remover(id) {
      await r.hdel(CHAVE, id);
    },
  };
}

/** Só para testes locais (ARMAZEM_MEMORIA=1): some ao reiniciar o servidor. */
function memoria(): Armazem {
  const g = globalThis as unknown as { __ganhos?: Map<string, Ganho> };
  g.__ganhos ??= new Map();
  const m = g.__ganhos;
  return {
    async listar() {
      return [...m.values()];
    },
    async salvar(x) {
      m.set(x.id, x);
    },
    async remover(id) {
      m.delete(id);
    },
  };
}

/** null = banco ainda não configurado na Vercel. */
export function armazem(): Armazem | null {
  if (process.env.ARMAZEM_MEMORIA === "1") return memoria();
  return redis();
}
