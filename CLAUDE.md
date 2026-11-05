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

**Layout de 2026-11-05 (substitui os anteriores, a pedido do usuário: "quero esse tipo de site").** Base: template de portfólio de criador 3D, adaptado em `docs/prompt-site-criador.md` (layout e animações do template; conteúdo, imagens e dados do Procopio — nenhuma imagem de terceiros).

- **Cores do template:** fundo `#0C0C0C`, texto `#D7E2EA`, títulos em degradê `#646973 → #BBCCD7`, seção de serviços branca, botão "Fale comigo" em degradê roxo/laranja.
- **Fonte:** Kanit (300 a 900).
- **Personagem:** `public/personagem.webp` (personagem 3D do Procopio, gerado pelo usuário a partir da foto dele, fundo removido) no hero, com efeito magnético.
- **Sem partículas e sem PROCOPIO girando** (escolha do usuário).
- **Céu noturno atrás do site:** nuvens escuras deslizando e pontinhos de luz subindo (adaptado do céu do prompt "Driftlab", em versão noite).
- **Animações:** Framer Motion (`motion`) + Lenis. Sempre ligadas (ver decisões).

## Seções

Site de uso pessoal (decisão do usuário de 2026-11-05: "vai ser só para mim").

1. **Hero:** menu (Saldo, Projetos, Adicionar, Contato no WhatsApp), "PROCOPIO" gigante (PRO e PIO brancos atrás do personagem; CO só com contorno branco, na frente dele), frase curta, botão "Fale comigo", personagem magnético.
2. **Ganhos:** "O que já ganhei" com o saldo total (soma das vendas, com contagem), cartões dos projetos (print automático, nome, link, valor, remover) e o formulário "Adicionar projeto" (link do site na Vercel + "Por quanto você vendeu?" + nome opcional).
3. **Rodapé:** contato, redes, privacidade.

## Dados

- **Stack:** Next.js (App Router) + Tailwind, deploy na Vercel.
- **Projetos vendidos:** guardados no Upstash Redis (integração gratuita da Vercel; variáveis `KV_REST_API_URL`/`KV_REST_API_TOKEN` ou `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`), hash `portfolio:ganhos`. Campos: `id`, `link`, `nome`, `valor`, `criadoEm`. Leitura e escrita só no servidor (`lib/armazem.ts`, server actions em `app/acoes.ts`); a página é dinâmica e o salvar revalida na hora. `ARMAZEM_MEMORIA=1` liga um banco em memória só para testes locais.
- **Valores:** exatos, em reais (o usuário digita quanto vendeu). `lib/ganhos.ts` entende "4850", "4.850", "R$ 4.850,00".
- **Sem senha:** o usuário decidiu que ninguém mais acessa; qualquer pessoa com o link pode adicionar/remover. Se isso mudar, proteger o formulário.
- **Tokens:** só em variáveis de ambiente (Vercel). Nunca no código, nunca no cliente.

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
- **Pendências do usuário:** valores exatos ou em faixa (`site.modoValores` em `data/site.ts`, hoje "exato"), e-mail, LinkedIn, domínio final, projetos reais (os atuais têm `"exemplo": true`), env `VERCEL_TOKEN` (e `GITHUB_TOKEN` opcional) na Vercel.
- **Verificação:** local com Playwright (SwiftShader, sem GPU: FPS medido não vale) + prévia da Vercel.
- **2026-11-05 — Desempenho (usuário relatou animação travada e INP de 352 ms):** medições mostraram que todo o custo era o canvas 3D; num Chrome sem aceleração de hardware a página caía para ~2 fps. Decisões: (1) 3D renderiza sob demanda (`frameloop="demand"`), só quando a fase do scroll ou o ponteiro mudam: com a página parada, custo zero; (2) WebGL por software é detectado num contexto descartável antes de montar a cena → imagem estática (`public/fita-anel*.webp`, gerada da própria cena); (3) aquecimento de 30 quadros no estado mais pesado (túnel), com o canvas invisível, medindo o custo real (render + `readPixels`) → se a mediana for alta (`lib/desempenho.ts`), troca pela imagem antes de mostrar o 3D; uma vigia continua medindo durante o uso; (4) resolução fixa (máx. 1,5 no desktop, 1,25 no celular), sem `PerformanceMonitor` (redimensionar no meio da rolagem engasgava); (5) lâminas com 108 triângulos (antes 300), shaders pré-compilados; (6) PROCOPIO com camadas do tamanho da fatia. `?fita=3d` força o 3D para testes. Resultado medido no pior caso (renderização por software): 60 fps parado e rolando a página inteira.
- **2026-11-05 — Hero:** pedido do usuário: no lugar de título/subtítulo/botões, só "PROCOPIO" girando no estilo da referência enviada (palavra fatiada que torce em torno de um eixo horizontal; frente preenchida, verso só contorno). Fonte larga Archivo (wdth 125, peso 800), só nessa palavra. CSS 3D puro (`components/PalavraGiratoria.tsx`), sem JS por quadro. A faixa vermelha da referência ficou de fora: paleta continua só preto/cinza/branco. Com movimento reduzido, a palavra fica parada. O `<h1>` mantém um texto oculto para leitores de tela e SEO.
- **2026-11-05 — Redesenho (substitui paleta, tipografia, objeto 3D e posição do PROCOPIO girando):** escolhas do usuário: partículas formam o nome no topo e depois espiral → nuvem → túnel; PROCOPIO girando vai para o fim da página; destaque índigo `#4B5BFF`. A fita cromada (`Fita.tsx`, `lib/fita.ts`) é substituída pelo motor de partículas. Conflitos com as skills de design (fundo marinho tingido, cor azul, brilhos): o pedido do usuário vence.
- **2026-11-05 — Redesenho implementado:** Geist (títulos 600, tracking -0.045em; `<em>` vira destaque índigo, sem itálico), tokens marinho em `app/globals.css` (`.vidro`, `.feixe`, `.etiqueta`), menu com logo e "Fale comigo" no topo e links numa pílula flutuante embaixo, PROCOPIO girando no rodapé. Partículas: `components/three/Particulas.tsx` (22 mil no desktop, 9 mil no celular, `lib/particulas.ts` com as formas testadas). Sem `backdrop-filter` e granulado estático (custo de composição). Medido: no pior caso (renderização por software) as partículas rodam ~30 fps parado/~20 rolando — o gargalo é compor um canvas de tela cheia sem GPU, não a quantidade de pontos —, então lá a proteção mostra o nome estático com brilho e a página fica a 60 fps. Em GPU real (qualquer celular/PC com aceleração) as partículas são carga baixa. Substitui as decisões da fita cromada acima.
- **2026-11-05 — Animações sempre ligadas (pedido explícito do usuário: "quero que fique ativadas sempre, não importa o motivo"):** removidos o teste de desempenho, a vigia que caía para o estático (`lib/desempenho.ts`) e todo o tratamento de `prefers-reduced-motion` (CSS, Lenis, partículas, revelação de palavras, contador, parallax). Única exceção: navegador sem WebGL, onde o 3D é impossível e fica o nome estático com brilho (o PROCOPIO girando do rodapé continua). Custo conhecido e aceito pelo usuário: pessoas que ativam "menos movimento" por sensibilidade (enjoo, labirintite) verão tudo animado; em máquina sem aceleração de hardware as partículas rodam abaixo de 60 fps (~30 medido). `?diag` mostra modo, "menos movimento", placa de vídeo e FPS reais.
- **2026-11-05 — Animação em qualquer aparelho:** dois motores com as mesmas formas e a mesma história de rolagem. WebGL com placa de vídeo real → `Particulas.tsx` (GPU, 22 mil/9 mil pontos). Sem WebGL, WebGL por software, ou falha do WebGL ao montar → `ParticulasPlano.tsx` (canvas 2D, 4,2 mil/2,2 mil pontos). Medido em Chrome sem GPU (`--disable-gpu`, igual a PC sem aceleração): 58 fps parado, 52 rolando a página inteira. Não existe mais caminho sem animação.
- **2026-11-05 — Rosto em partículas (pedido do usuário, com foto dele):** substitui o DNA no Sobre. `public/rosto.png` (197×215, tons de cinza + alfa) foi gerado de uma foto enviada pelo usuário: recorte só do rosto dele (a outra pessoa da foto nunca entrou no repositório), fundo removido com rembg (`u2net_human_seg`), corte abaixo do queixo, máscara oval e contraste local realçado. `amostrarImagem` pesa os pixels por alfa × brilho^2,6 (traços aparecem por contraste de densidade); `formaRosto` dá volume com curvatura oval + brilho; o brilho de cada partícula vem da foto (luz e sombra). Sem a imagem, cai na espiral. Partículas: 36 mil/15 mil (3D), 5 mil/2,8 mil (2D). Para trocar o rosto: gerar um novo `public/rosto.png` com o mesmo tratamento.
- **2026-11-05 — Layout do template de criador 3D (substitui partículas, rosto, PROCOPIO girando, Geist, marinho/índigo e o gráfico mensal):** escolhas do usuário: cores do template e tirar todas as partículas. Removidos three/R3F/drei/GSAP e os motores de partículas. O gráfico de faturamento por mês saiu (o template mostra só os números). Objetos 3D decorativos do "Sobre" ficam de fora até o usuário gerar os dele (as imagens do template eram de terceiros).
- **2026-11-05 — WhatsApp:** usuário informou 55991009800 (DDD 55 + 99100-9800); no link vai com o DDI do Brasil: `5555991009800`.
- **2026-11-05 — Site reduzido a hero + ganhos (pedido do usuário):** saíram faixa, Sobre, Serviços, cartões empilhados, projetos do GitHub e `data/projetos.json` de exemplo. Projetos entram pelo formulário do próprio site (link da Vercel + valor da venda) e ficam no Upstash Redis, em qualquer aparelho.
- **2026-11-05 — Instagram:** @guiprocopioo (https://www.instagram.com/guiprocopioo/), no rodapé com o ícone do Phosphor.
- **2026-11-05 — Título do hero:** só "PROCOPIO" (pedido do usuário). Duas camadas sobrepostas com a mesma caixa: atrás do personagem, PRO e PIO brancos; na frente, só o CO em contorno branco (`.contorno-branco`). No celular o personagem sobe (topo a 7svh, 320 px) para a cabeça cruzar o CO.
- **2026-11-05 — Céu noturno (pedido do usuário, do prompt "Driftlab", só as nuvens atrás do site, escuras como à noite):** `components/CeuNoturno.tsx`, fixo atrás de tudo. Nuvens: textura própria `public/ceu-noite.webp` (2048×1152, 15 KB, gerada por ruído espectral periódico, então emenda nas laterais; a imagem do prompt era de terceiros e de dia), deslizando `rolagem*.05 + tempo*.0022` voltas, como no prompt. 30 pontinhos de luz brancos subindo `.012*(.4+z)`. Só `transform` (sem WebGL, sem canvas): medido 60 fps no computador e no celular. Água-viva, palavras curvas, som e índice do prompt ficaram de fora.
