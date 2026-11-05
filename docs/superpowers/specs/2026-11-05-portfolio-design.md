# Portfólio — design

Base: `CLAUDE.md` (decisões do usuário) + prints em `referencias/`. Onde as skills de design divergem do `CLAUDE.md`, o `CLAUDE.md` vence (fonte serifada + Inter, palavra em itálico por título, fundo ~#0a0a0a).

## Objetivo e sucesso

- Atrair clientes para sites/sistemas sob medida. Ação principal: conversar no WhatsApp.
- Sucesso: a página carrega rápido, o texto aparece antes do 3D, a fita cromada atravessa a página sem travar, e se GitHub/Vercel falharem o resto continua de pé.

## Tokens

| Papel | Valor |
|---|---|
| Fundo | `#0a0a0a` + vinheta radial + granulado (overlay CSS fixo) |
| Superfície (cards) | `#181818`, hover `#1F1F1F`, borda `#272727` (contorno completo) |
| Texto forte | `#FFFFFF` (títulos com degradê de texto `#FFF → #9B9B9B`) |
| Texto | `#D4D4D4` |
| Texto apagado | `#9B9B9B` |

- **Tipos:** Instrument Serif 400 (normal + itálico) para títulos; Inter para interface. Escala Tailwind padrão; espaçamentos só da tabela da skill `landing-page-design` (2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96 px).
- **Ícones:** Phosphor.
- **Movimento:** curva `cubic-bezier(0.22,1,0.36,1)`; só `transform`/`opacity`. O único espetáculo é o 3D; o resto é contido (revelação palavra por palavra no texto "Sobre", contagem dos números).

## Objeto 3D (um só, a página toda)

`InstancedMesh` de lâminas cromadas (caixas arredondadas finas) distribuídas ao longo de uma curva. Cada estado é uma função `(i, n) → posição + rotação` por lâmina; o scroll interpola entre estados (lerp de posição, slerp de rotação).

| Fase | Estado | Referência |
|---|---|---|
| 0 | Anel em arco atrás/abaixo do título | 01 |
| 0.5 | Anel girado e mais perto da câmera | 01 (rolando) |
| 1 | Coluna em espiral à direita | 02 |
| 2 | Coluna à esquerda, apagada (cards passam por cima) | 03 |
| 3 | Túnel em espiral em volta da câmera + esfera cromada no centro | 04 |

- Material metálico espelhado; reflexo vem de um ambiente de estúdio só com painéis brancos (`Lightformer`), sem HDR externo → preto e branco puro.
- Canvas fixo atrás do conteúdo, carregado depois do texto (`dynamic`, sem SSR).
- **Mobile:** ~45% das lâminas, `dpr ≤ 1.5`, sem antialias pesado.
- **`prefers-reduced-motion`:** sem Lenis e sem morph; anel parado só no hero.
- Scroll: Lenis → ScrollTrigger (`scrub`) → objeto mutável `fase` lido no `useFrame`.

## Seções

1. **Hero** — "Sites que *geram* resultado." Subtítulo, botões "Ver projetos" (pílula branca + seta em círculo preto) e "Fale comigo" (secundário). Prova: nº de projetos entregues.
2. **Sobre + Resultados** — parágrafo grande em serifada que acende palavra por palavra (seção de frase obrigatória da skill). Números com contagem: faturamento total, projetos entregues, ticket médio. Gráfico de barras mensal monocromático (SVG próprio).
3. **Projetos vendidos** — título fixo à esquerda + filtro por tipo; cards em duas colunas com parallax de velocidades diferentes; clique abre `<dialog>` com stack, prazo, link, depoimento. Cliente só aparece com `exibir_cliente: true`.
4. **Projetos próprios** — Server Component, `revalidate = 3600`. GitHub: repos públicos de `grprocopio` com topic `portfolio`. Vercel: `/v9/projects` com `VERCEL_TOKEN` (opcional). Print automático via serviço de screenshot do link no ar; sem link → capa tipográfica. Falha de API → mensagem de erro na seção, resto intacto. Skeleton durante carregamento (`Suspense`).
5. **CTA final** — "Pronto para *tirar* seu projeto do papel?" + botão WhatsApp, sobre o túnel.
6. **Rodapé** — contato, redes, link de privacidade.

Extras: 404 própria, favicon, metadados/OG, link "pular para o conteúdo", foco visível.

## Dados

- `data/projetos.json` — campos do `CLAUDE.md` + `exemplo: true` nos fictícios.
- `data/site.ts` — nome, WhatsApp, redes, modo de valores (`"exato" | "faixa"`). Valores ainda pendentes de decisão do usuário: ficam em modo exato com dados de exemplo até ele decidir.
- Tokens só em env (`GITHUB_TOKEN` opcional, `VERCEL_TOKEN`), lidos só no servidor.

## Verificação

Build de produção + Playwright local (1440px e 390px, vários pontos de scroll), medição de FPS aproximada, e prévia da Vercel do usuário.
