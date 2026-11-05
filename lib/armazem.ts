import "server-only";
import { Redis } from "@upstash/redis";
import { migrarAntigo, type ProjetoAntigo, type Projeto } from "./financeiro";

/** Onde os projetos do CRM ficam guardados. Só no servidor. */
export type Armazem = {
  listar(): Promise<Projeto[]>;
  buscar(id: string): Promise<Projeto | null>;
  salvar(p: Projeto): Promise<void>;
  remover(id: string): Promise<void>;
};

const CHAVE = "crm:projetos";
const CHAVE_ANTIGA = "portfolio:ganhos";

function redis(): Armazem | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const r = new Redis({ url, token });
  return {
    async listar() {
      const antigos = await r.hgetall<Record<string, ProjetoAntigo>>(CHAVE_ANTIGA);
      if (antigos && Object.keys(antigos).length) {
        const novos = Object.fromEntries(Object.values(antigos).map((g) => [g.id, migrarAntigo(g)]));
        await r.hset(CHAVE, novos);
        await r.del(CHAVE_ANTIGA);
      }
      return Object.values((await r.hgetall<Record<string, Projeto>>(CHAVE)) ?? {});
    },
    async buscar(id) {
      return (await r.hget<Projeto>(CHAVE, id)) ?? null;
    },
    async salvar(p) {
      await r.hset(CHAVE, { [p.id]: p });
    },
    async remover(id) {
      await r.hdel(CHAVE, id);
    },
  };
}

/** Só para testes locais (ARMAZEM_MEMORIA=1): some ao reiniciar o servidor. */
function memoria(): Armazem {
  const g = globalThis as unknown as { __crm?: Map<string, Projeto> };
  g.__crm ??= new Map();
  const m = g.__crm;
  return {
    listar: async () => [...m.values()],
    buscar: async (id) => m.get(id) ?? null,
    salvar: async (p) => void m.set(p.id, structuredClone(p)),
    remover: async (id) => void m.delete(id),
  };
}

/** null = banco ainda não configurado na Vercel. */
export function armazem(): Armazem | null {
  if (process.env.ARMAZEM_MEMORIA === "1") return memoria();
  return redis();
}
