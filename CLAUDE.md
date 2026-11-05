# Portfólio — contexto do projeto

Leia este arquivo inteiro antes de qualquer tarefa. Ele guarda as decisões já tomadas. Atualize-o quando uma decisão nova for tomada.

## Objetivo

**Desde 2026-11-05: CRM financeiro pessoal** do Guilherme (desenvolvedor freelancer). Controla os projetos vendidos, quanto já recebeu e quanto falta receber. Uso só dele, atrás de senha. (Antes era um portfólio público; as decisões antigas ficam no histórico abaixo.)

## Método de trabalho (obrigatório)

1. **Explorar:** leia o que já existe antes de mudar algo.
2. **Planejar:** escreva um plano curto e espere aprovação antes de codar algo grande.
3. **Contexto:** pergunte o que faltar em vez de supor. Registre decisões novas aqui.
4. **Implementar em partes:** uma seção por vez, commits pequenos. Comece pela cena 3D + scroll (parte mais arriscada).
5. **Verificar:** confira cada parte no link de prévia da Vercel (desktop e mobile) e o desempenho do 3D antes de seguir. Não diga que está pronto sem verificar.

## Estilo visual

- **Cores:** fundo `#0C0C0C`, texto `#D7E2EA`, títulos em degradê `#646973 → #BBCCD7`, botões principais em degradê roxo/laranja (`.botao-contato`), destaque `#d94bc8` (mês atual no gráfico, progresso). Situações: Pago verde `#8ff0b4`, Parcial amarelo `#ffd27a`, Pendente rosa `#ff8fa6`.
- **Fonte:** Kanit (300 a 900).
- **Fundo:** céu noturno (`components/CeuNoturno.tsx`): nuvens escuras deslizando e pontinhos de luz.
- **Personagem:** `public/personagem.webp` como avatar no topo do painel e na tela de entrada.
- **Animações sempre ligadas** (decisão do usuário).

## Telas

1. **`/entrar`:** senha (`CRM_SENHA`).
2. **`/` (painel):** "Olá, Guilherme" + Sair; indicadores Recebido (e recebido no mês), A receber, Faturamento, Ticket médio; gráfico "Recebido por mês" (12 meses); lista de projetos com filtro (Todos, A receber, Pagos), progresso, situação, e ações Registrar pagamento, Editar, Pagamentos (lista com remover), Excluir; janela "Novo projeto" (cliente, projeto, link opcional, valor total, data da venda, entrada opcional).

## Dados

- **Stack:** Next.js 16 (App Router) + Tailwind 4 + Upstash Redis, deploy na Vercel. Testes com Vitest (`npm test`).
- **Projeto** (`lib/financeiro.ts`): `id`, `cliente`, `nome`, `link?`, `valor` (total), `data` (venda, AAAA-MM-DD), `pagamentos[]` (`id`, `valor`, `data`), `criadoEm`. Cálculos puros e testados: recebido, falta, situação, resumo, recebido por mês.
- **Banco:** hash `crm:projetos` no Upstash (variáveis `KV_REST_API_URL`/`KV_REST_API_TOKEN`). `lib/armazem.ts` (só servidor). Projetos antigos de `portfolio:ganhos` migram uma vez como pagos. `ARMAZEM_MEMORIA=1` = banco em memória para testes locais.
- **Acesso:** `CRM_SENHA` (obrigatória) e `CRM_SEGREDO` (opcional; sem ela, a assinatura usa a senha, e trocar a senha derruba as sessões). Cookie `crm_sessao` httpOnly, 30 dias, HMAC-SHA256 (`lib/sessao.ts`). Checagem em `proxy.ts` **e** de novo em cada página e server action (`lib/auth.ts`). Senha errada: atraso de 0,8 s. Páginas com `noindex`.
- **Formatos:** `lib/formato.ts` entende valores "4850", "4.850", "R$ 4.850,00" e valida datas.
- **Tokens e senha:** só em variáveis de ambiente da Vercel.

## Qualidade

Estados de carregamento e erro (se uma API falhar, o resto do site continua funcionando), responsivo, acessível (contraste, foco visível, textos alternativos), carregamento rápido.

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
- **2026-11-05 — CRM financeiro (pedido do usuário: "transforme tipo em um CRM"; escolheu só o módulo Financeiro, site inteiro vira o CRM, com senha):** substitui hero/ganhos/rodapé públicos. Painel com recebido, a receber, faturamento, ticket médio, gráfico de recebimentos por mês e lista de projetos (cliente, projeto, link, valor, pagamentos/parcelas, situação Pago/Parcial/Pendente). Login por senha (`CRM_SENHA` na Vercel), cookie assinado com HMAC; checagem no `proxy.ts` e de novo em cada página e server action. Dados no mesmo Upstash (`crm:projetos`); os antigos `portfolio:ganhos` são migrados como pagos. Céu noturno, Kanit e o personagem (avatar) continuam.
