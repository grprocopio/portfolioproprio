# Portfólio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portfólio de uma página com fita cromada 3D guiada pelo scroll, resultados de vendas, projetos vendidos e projetos próprios (GitHub + Vercel).

**Architecture:** Next.js App Router. Conteúdo em Server Components; um único `<Canvas>` R3F fixo (client, carregado sem SSR) lê uma fase global escrita por ScrollTrigger (Lenis faz a rolagem). Lógica pura (dados, formatação, estados das lâminas, mapeamento de APIs) em `lib/` com testes Vitest.

**Tech Stack:** Next 16, React 19, Tailwind 4, three 0.187, @react-three/fiber 9, @react-three/drei 10, gsap 3.15, lenis 1.3, @phosphor-icons/react, vitest.

**Spec:** `docs/superpowers/specs/2026-11-05-portfolio-design.md`

## Global Constraints

- Paleta só preto/cinza/branco; fundo `#0a0a0a`; superfícies `#181818`/`#1F1F1F`, borda `#272727`.
- Títulos Instrument Serif com exatamente uma palavra em `<em>` itálico por frase; interface em Inter.
- Tamanhos só da escala Tailwind; espaçamentos só 0/2/4/8/12/16/24/32/40/48/64/80/96 px.
- Curva `cubic-bezier(0.22,1,0.36,1)`; animar só transform/opacity; respeitar `prefers-reduced-motion`.
- Tokens só em `process.env` no servidor. Cliente só aparece com `exibir_cliente: true`.
- Ícones Phosphor. Sem hífen no meio de frases da interface.

## Review Focus

- GitHub ou Vercel fora do ar / sem token → seção mostra erro curto, página renderiza. Teste em `lib/github.test.ts` e `lib/vercel.test.ts` (fetch rejeitado → `{ ok: false }`).
- Projeto com `exibir_cliente: false` mas `cliente` preenchido → nome nunca vai para o HTML. Teste em `lib/projetos.test.ts`.
- `projetos.json` vazio → números zerados, gráfico com estado vazio, grade com mensagem. Teste de `resumo([])`.
- WebGL indisponível → canvas não monta, fundo continua escuro com conteúdo legível (checagem `WebGLRenderingContext` antes de montar).
- Mobile estreito (390px) → nada de rolagem horizontal; verificado por Playwright (`scrollWidth <= innerWidth`).

---

### Task 1: Base do projeto

**Files:** `package.json`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/icon.svg`, `components/ui/Button.tsx`, `components/Nav.tsx`, `vitest.config.ts`

- [ ] Instalar dependências; `npm run build` passa.
- [ ] `globals.css`: tokens em `@theme`, vinheta + granulado em `body::before/::after` fixos, foco visível global.
- [ ] `Button({ href, children, variant: "primary" | "ghost" })` — primária: pílula branca + seta em círculo preto.
- [ ] `Nav`: logo à esquerda, links centrais, "Fale comigo" à direita; painel em tela cheia no mobile.
- [ ] Commit.

### Task 2: Cena 3D + scroll

**Files:** `lib/fita.ts`, `lib/fita.test.ts`, `lib/scroll-state.ts`, `components/three/Fita.tsx`, `components/three/Cena.tsx`, `components/three/CenaLoader.tsx`, `components/SmoothScroll.tsx`

**Interfaces:**
- `type Pose = { p: [number,number,number]; q: [number,number,number,number] }`
- `poseLamina(estado: Estado, i: number, n: number, viewport: { w: number; h: number }): Pose`
- `type Estado = "anel" | "anelPerto" | "colunaDireita" | "colunaEsquerda" | "tunel"`
- `ESTADOS: Estado[]` na ordem acima; `scrollState = { fase: number }` (0..4).

- [ ] Testes: `poseLamina("anel", i, n)` dá pontos à mesma distância do centro do anel; `"colunaDireita"` tem `x > 0` para todas; `"tunel"` tem lâminas em volta do eixo z (distância ao eixo constante). Quaternions normalizados.
- [ ] Implementar; testes passam.
- [ ] `Fita` interpola entre `ESTADOS[floor(fase)]` e o próximo (lerp/slerp por lâmina) no `useFrame`.
- [ ] `SmoothScroll`: Lenis + ScrollTrigger; tweens com `scrub` por seção escrevem `scrollState.fase`.
- [ ] Verificar no Playwright (capturas em 5 pontos de scroll, desktop e mobile) e medir FPS. Commit.

### Task 3: Dados e lógica

**Files:** `data/projetos.json`, `data/site.ts`, `lib/projetos.ts`, `lib/projetos.test.ts`, `lib/formato.ts`

**Interfaces:**
- `carregarProjetos(): ProjetoPublico[]` — remove `cliente` se `exibir_cliente !== true`.
- `resumo(ps): { total: number; quantidade: number; ticketMedio: number; porMes: { mes: string; valor: number }[] }`
- `formatarValor(v: number, modo: "exato" | "faixa"): string`
- `tipos(ps): string[]`

- [ ] Testes (privacidade, `resumo([])`, ticket médio, agregação por mês ordenada, faixa). Implementar. Commit.

### Task 4: Hero + Sobre/Resultados

**Files:** `components/sections/Hero.tsx`, `components/sections/Sobre.tsx`, `components/RevelarPalavras.tsx`, `components/Contador.tsx`, `components/GraficoMensal.tsx`

- [ ] Hero com copy do `CLAUDE.md`. Sobre: parágrafo com revelação palavra por palavra; números com contagem; gráfico de barras SVG com estado vazio. Commit.

### Task 5: Projetos vendidos

**Files:** `components/sections/ProjetosVendidos.tsx`, `components/ProjetoCard.tsx`, `components/ProjetoDialog.tsx`

- [ ] Filtro por tipo (botões com `aria-pressed`), duas colunas com parallax de velocidades diferentes, `<dialog>` com stack/prazo/link/depoimento. Commit.

### Task 6: Projetos próprios

**Files:** `lib/github.ts`, `lib/vercel.ts`, `lib/proprios.ts`, testes de cada um, `components/sections/ProjetosProprios.tsx`

**Interfaces:**
- `buscarRepos(fetcher = fetch): Promise<Resultado<Repo[]>>`, `buscarVercel(fetcher = fetch): Promise<Resultado<ProjetoVercel[]>>`, `type Resultado<T> = { ok: true; dados: T } | { ok: false; erro: string }`
- `juntarProprios(repos, vercel): ProjetoProprio[]` — casa pelo nome do repo ligado ao projeto Vercel.
- `printUrl(url: string): string` — screenshot automático.

- [ ] Testes com fetch falso (sucesso, erro HTTP, rejeição, filtro de topic `portfolio`, ignora privados). Implementar; seção com `Suspense` + skeleton. Commit.

### Task 7: CTA + rodapé + extras

**Files:** `components/sections/Cta.tsx`, `components/Rodape.tsx`, `app/not-found.tsx`, `app/privacidade/page.tsx`, `app/opengraph-image.tsx`

- [ ] CTA com link `wa.me`; rodapé; 404; privacidade; metadados. Commit.

### Task 8: Revisão final

- [ ] Skill `impeccable`: hierarquia, contraste, foco, estados, responsivo. Playwright desktop/mobile, reduced motion, sem rolagem horizontal. Atualizar `CLAUDE.md`. Commit e push.
