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

**Redesenho de 2026-11-05 (substitui o estilo anterior, a pedido do usuário: "muito travado, sem cor").** Referência nova: vídeo de um site de segurança digital com partículas neon (inspiração de estilo, não copiar marca, textos nem layout literal). Os prints antigos em `referencias/` ficam só como histórico.

- **Paleta:** fundo azul marinho quase preto, superfícies marinho, **um** destaque azul índigo neon `#4B5BFF` (com brilho), texto branco e azul acinzentado. Feixes de luz azuis estáticos atrás das seções; granulado leve.
- **Tipografia:** uma sans só (Geist), pesada e com tracking negativo nos títulos. Sem serifada e sem itálico; o destaque de uma palavra por frase passa a ser pela cor.
- **Botões:** pílula branca com seta dentro de um círculo índigo.
- **Menu:** logo em cima à esquerda e "Fale comigo" em cima à direita; links numa pílula flutuante embaixo, centralizada.
- **Objeto 3D:** nuvem de partículas azuis (um único `THREE.Points`, transformação feita no shader da GPU). O mesmo objeto atravessa a página toda.
- **Fluidez:** meta de 60 fps em qualquer aparelho, medida também com renderização por software. Sem `backdrop-filter` por cima do 3D.

## Animação no scroll

Stack: Three.js ou React Three Fiber + GSAP ScrollTrigger + Lenis (rolagem suave com inércia).

1. **Hero:** as partículas montam o nome PROCOPIO.
2. **Sobre:** o nome se desfaz e as partículas formam o **rosto do usuário** à direita (fixo, como sticky) enquanto o texto passa à esquerda.
3. **Projetos:** o rosto se abre numa nuvem mais apagada; cards escuros sobem em parallax com velocidades diferentes.
4. **CTA final:** as partículas formam um túnel em espiral com uma esfera no centro.

**Animações sempre ligadas** (decisão do usuário de 2026-11-05, ver abaixo): não respeitar `prefers-reduced-motion` nem cair para versão estática por desempenho. No mobile, 3D mais leve (menos partículas).

## Seções

1. **Hero:** o nome PROCOPIO formado pelas partículas azuis (o texto real fica oculto no `<h1>` para leitores de tela e SEO).
2. **Sobre + Resultados:** texto curto sobre mim; números animados (contagem ao aparecer) de faturamento total, projetos entregues e ticket médio; gráfico de faturamento por mês, monocromático.
3. **Projetos vendidos:** grade de cards escuros com print do site, nome, tipo e valor; filtro por tipo; clique abre detalhe (stack, prazo, link no ar, depoimento).
4. **Projetos próprios:** puxados do GitHub e da Vercel, com print gerado automaticamente.
5. **CTA final:** "Pronto para *tirar* seu projeto do papel?" + botão para o WhatsApp.
6. **Rodapé:** PROCOPIO em tipografia cinética girando (movido do topo), contato e redes.

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
- **2026-11-05 — Redesenho (substitui paleta, tipografia, objeto 3D e posição do PROCOPIO girando):** escolhas do usuário: partículas formam o nome no topo e depois espiral → nuvem → túnel; PROCOPIO girando vai para o fim da página; destaque índigo `#4B5BFF`. A fita cromada (`Fita.tsx`, `lib/fita.ts`) é substituída pelo motor de partículas. Conflitos com as skills de design (fundo marinho tingido, cor azul, brilhos): o pedido do usuário vence.
- **2026-11-05 — Redesenho implementado:** Geist (títulos 600, tracking -0.045em; `<em>` vira destaque índigo, sem itálico), tokens marinho em `app/globals.css` (`.vidro`, `.feixe`, `.etiqueta`), menu com logo e "Fale comigo" no topo e links numa pílula flutuante embaixo, PROCOPIO girando no rodapé. Partículas: `components/three/Particulas.tsx` (22 mil no desktop, 9 mil no celular, `lib/particulas.ts` com as formas testadas). Sem `backdrop-filter` e granulado estático (custo de composição). Medido: no pior caso (renderização por software) as partículas rodam ~30 fps parado/~20 rolando — o gargalo é compor um canvas de tela cheia sem GPU, não a quantidade de pontos —, então lá a proteção mostra o nome estático com brilho e a página fica a 60 fps. Em GPU real (qualquer celular/PC com aceleração) as partículas são carga baixa. Substitui as decisões da fita cromada acima.
- **2026-11-05 — Animações sempre ligadas (pedido explícito do usuário: "quero que fique ativadas sempre, não importa o motivo"):** removidos o teste de desempenho, a vigia que caía para o estático (`lib/desempenho.ts`) e todo o tratamento de `prefers-reduced-motion` (CSS, Lenis, partículas, revelação de palavras, contador, parallax). Única exceção: navegador sem WebGL, onde o 3D é impossível e fica o nome estático com brilho (o PROCOPIO girando do rodapé continua). Custo conhecido e aceito pelo usuário: pessoas que ativam "menos movimento" por sensibilidade (enjoo, labirintite) verão tudo animado; em máquina sem aceleração de hardware as partículas rodam abaixo de 60 fps (~30 medido). `?diag` mostra modo, "menos movimento", placa de vídeo e FPS reais.
- **2026-11-05 — Animação em qualquer aparelho:** dois motores com as mesmas formas e a mesma história de rolagem. WebGL com placa de vídeo real → `Particulas.tsx` (GPU, 22 mil/9 mil pontos). Sem WebGL, WebGL por software, ou falha do WebGL ao montar → `ParticulasPlano.tsx` (canvas 2D, 4,2 mil/2,2 mil pontos). Medido em Chrome sem GPU (`--disable-gpu`, igual a PC sem aceleração): 58 fps parado, 52 rolando a página inteira. Não existe mais caminho sem animação.
- **2026-11-05 — Rosto em partículas (pedido do usuário, com foto dele):** substitui o DNA no Sobre. `public/rosto.png` (197×215, tons de cinza + alfa) foi gerado de uma foto enviada pelo usuário: recorte só do rosto dele (a outra pessoa da foto nunca entrou no repositório), fundo removido com rembg (`u2net_human_seg`), corte abaixo do queixo, máscara oval e contraste local realçado. `amostrarImagem` pesa os pixels por alfa × brilho^2,6 (traços aparecem por contraste de densidade); `formaRosto` dá volume com curvatura oval + brilho; o brilho de cada partícula vem da foto (luz e sombra). Sem a imagem, cai na espiral. Partículas: 36 mil/15 mil (3D), 5 mil/2,8 mil (2D). Para trocar o rosto: gerar um novo `public/rosto.png` com o mesmo tratamento.
