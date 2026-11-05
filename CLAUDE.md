# Portfólio — contexto do projeto

Leia este arquivo inteiro antes de qualquer tarefa. Ele guarda as decisões já tomadas. Atualize-o quando uma decisão nova for tomada.

## Objetivo

Portfólio pessoal de desenvolvedor freelancer. Mostra os sites/projetos que vendi para clientes, quanto faturei com eles e meus projetos do GitHub e da Vercel. Serve para atrair novos clientes.

## Método de trabalho (obrigatório)

1. **Explorar:** leia o que já existe antes de mudar algo.
2. **Planejar:** escreva um plano curto e espere aprovação antes de codar algo grande.
3. **Contexto:** pergunte o que faltar em vez de supor. Registre decisões novas aqui.
4. **Implementar em partes:** uma seção por vez, commits pequenos. Comece pela cena 3D + scroll (parte mais arriscada).
5. **Verificar:** confira cada parte no link de prévia da Vercel (desktop e mobile) e o desempenho do 3D antes de seguir. Não diga que está pronto sem verificar.

## Estilo visual

Referência: vídeo de um site de agência (prints em `referencias/`). Usar como **inspiração de estilo**: não copiar marca, textos nem design literal.

- **Paleta:** só preto, cinza e branco. Fundo ~#0a0a0a com leve vinheta e granulado. Sem cor de destaque; o brilho vem do 3D cromado.
- **Tipografia:** títulos em serifada fina e condensada (ex.: Instrument Serif), grandes e centralizados, sempre com **uma palavra em itálico** por frase. Menu e textos em sans pequena (ex.: Inter), cinza claro.
- **Botões:** pílula branca com ícone de seta dentro de um círculo preto.
- **Menu fixo:** logo à esquerda, links no centro, botão "Fale comigo" à direita.
- **Objeto 3D:** fita metálica cromada com gomos (anel/mola), material espelhado em preto e branco, iluminação de estúdio. O mesmo objeto atravessa a página toda.

## Animação no scroll

Stack: Three.js ou React Three Fiber + GSAP ScrollTrigger + Lenis (rolagem suave com inércia).

1. **Hero** (`referencias/01-hero.jpg`): fita em arco atrás do título; ao rolar, gira e se aproxima da câmera.
2. **Sobre** (`02-sobre-coluna-3d.jpg`): fita vira coluna em espiral fixa à direita (sticky) enquanto o texto passa à esquerda.
3. **Projetos** (`03-grade-projetos.jpg`): coluna vai para o lado; cards escuros sobem em parallax com velocidades diferentes.
4. **CTA final** (`04-cta-tunel.jpg`): câmera entra num túnel em espiral com uma esfera cromada no centro.

Respeitar `prefers-reduced-motion` (versão estática). No mobile, 3D mais leve ou vídeo em loop.

## Seções

1. **Hero:** só a palavra "PROCOPIO" em tipografia cinética girando (decisão de 2026-11-05, substitui o título, subtítulo e botões).
2. **Sobre + Resultados:** texto curto sobre mim; números animados (contagem ao aparecer) de faturamento total, projetos entregues e ticket médio; gráfico de faturamento por mês, monocromático.
3. **Projetos vendidos:** grade de cards escuros com print do site, nome, tipo e valor; filtro por tipo; clique abre detalhe (stack, prazo, link no ar, depoimento).
4. **Projetos próprios:** puxados do GitHub e da Vercel, com print gerado automaticamente.
5. **CTA final:** "Pronto para *tirar* seu projeto do papel?" + botão para o WhatsApp.
6. **Rodapé:** contato e redes.

## Dados

- **Stack:** Next.js (App Router) + Tailwind, deploy na Vercel. Dados buscados no servidor, revalidação a cada 1h.
- **Vendas:** `data/projetos.json` (preenchido à mão). Campos: `nome`, `cliente` (opcional), `exibir_cliente` (true/false), `tipo`, `valor`, `data`, `prazo`, `stack`, `link`, `imagem`, `repositorio` (opcional), `depoimento` (opcional).
- **GitHub:** usuário `grprocopio`. Mostrar repos públicos com o topic `portfolio`. Repos privados de clientes: só metadados, nunca código.
- **Vercel:** API com token para listar projetos e domínios.
- **Tokens:** só em variáveis de ambiente (configuradas na Vercel). Nunca no código, nunca no cliente.
- **Valores:** ainda não definido (exatos ou em faixas). Perguntar ao usuário antes de implementar o painel de resultados.
- **Privacidade:** só mostrar o nome do cliente quando `exibir_cliente` for true.

## Qualidade

Estados de carregamento e erro (se uma API falhar, o resto do site continua funcionando), responsivo, acessível (contraste, foco visível, textos alternativos), carregamento rápido mesmo com o 3D.

## Decisões tomadas

<!-- Adicione aqui cada decisão nova, com a data. -->
- **2026-11-05 — Stack fechada:** Next 16 (App Router) + React 19 + Tailwind 4 + three/R3F/drei + GSAP ScrollTrigger + Lenis + Phosphor. Testes de lógica com Vitest (`npm test`).
- **Objeto 3D:** um único `InstancedMesh` de lâminas cromadas (`components/three/Fita.tsx`). Os estados (anel → anel perto → coluna à direita → coluna ao centro/esquerda → túnel) são funções puras em `lib/fita.ts`; o scroll escreve a fase em `lib/scroll-state.ts` (`components/RolagemSuave.tsx`). Reflexo só com painéis brancos (`Lightformer`), sem HDR externo.
- **Mobile:** menos lâminas (150), sem antialias, coluna na borda da tela e mais escura atrás do texto.
- **Movimento reduzido:** sem Lenis, sem morph; anel parado só no topo.
- **Tipografia:** Instrument Serif + Inter e itálico por frase, mesmo contra a skill `landing-page-design` (pedido explícito vence).
- **Privacidade:** `data/projetos.json` só é lido no servidor (`lib/projetos-servidor.ts`, `server-only`). Com `exibir_cliente: false`, somem o cliente e o autor do depoimento.
- **Vercel:** só completa o link no ar de repos públicos com o tópico `portfolio`; projetos da Vercel sem repo público marcado nunca aparecem.
- **Print automático:** microlink direto no `<img>`, com capa tipográfica se falhar.
- **Pendências do usuário:** valores exatos ou em faixa (`site.modoValores` em `data/site.ts`, hoje "exato"), número do WhatsApp, e-mail, LinkedIn/Instagram, domínio final, projetos reais (os atuais têm `"exemplo": true`), env `VERCEL_TOKEN` (e `GITHUB_TOKEN` opcional) na Vercel.
- **Verificação:** local com Playwright (SwiftShader, sem GPU: FPS medido não vale) + prévia da Vercel.
- **2026-11-05 — Desempenho (usuário relatou animação travada e INP de 352 ms):** medições mostraram que todo o custo era o canvas 3D; num Chrome sem aceleração de hardware a página caía para ~2 fps. Decisões: (1) 3D renderiza sob demanda (`frameloop="demand"`), só quando a fase do scroll ou o ponteiro mudam: com a página parada, custo zero; (2) WebGL por software é detectado num contexto descartável antes de montar a cena → imagem estática (`public/fita-anel*.webp`, gerada da própria cena); (3) aquecimento de 30 quadros no estado mais pesado (túnel), com o canvas invisível, medindo o custo real (render + `readPixels`) → se a mediana for alta (`lib/desempenho.ts`), troca pela imagem antes de mostrar o 3D; uma vigia continua medindo durante o uso; (4) resolução fixa (máx. 1,5 no desktop, 1,25 no celular), sem `PerformanceMonitor` (redimensionar no meio da rolagem engasgava); (5) lâminas com 108 triângulos (antes 300), shaders pré-compilados; (6) PROCOPIO com camadas do tamanho da fatia. `?fita=3d` força o 3D para testes. Resultado medido no pior caso (renderização por software): 60 fps parado e rolando a página inteira.
- **2026-11-05 — Hero:** pedido do usuário: no lugar de título/subtítulo/botões, só "PROCOPIO" girando no estilo da referência enviada (palavra fatiada que torce em torno de um eixo horizontal; frente preenchida, verso só contorno). Fonte larga Archivo (wdth 125, peso 800), só nessa palavra. CSS 3D puro (`components/PalavraGiratoria.tsx`), sem JS por quadro. A faixa vermelha da referência ficou de fora: paleta continua só preto/cinza/branco. Com movimento reduzido, a palavra fica parada. O `<h1>` mantém um texto oculto para leitores de tela e SEO.
