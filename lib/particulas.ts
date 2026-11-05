/**
 * Formas da nuvem de partículas, uma por seção da página.
 * Funções puras: devolvem Float32Array com [x, y, z] por partícula, em unidades do mundo
 * (câmera em z=10, fov 35: a tela inteira mede vp.w × vp.h no plano z=0).
 */

export type Viewport = { w: number; h: number };
export type Ponto2D = { x: number; y: number };
/** Pixel de foto: posição normalizada, brilho (0 a 1) e peso na amostragem (0 a 1) */
export type PontoImagem = Ponto2D & { brilho: number; peso: number };

export const FORMAS = ["nome", "rosto", "nuvem", "tunel"] as const;
export type Forma = (typeof FORMAS)[number];

const TAU = Math.PI * 2;

/** Gerador pseudoaleatório com semente (mulberry32): mesma forma a cada carregamento. */
export function aleatorio(semente: number) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Gaussiana aproximada (soma de uniformes), centrada em 0 com desvio ~1. */
const gauss = (r: () => number) => (r() + r() + r() + r() - 2) * 1.73;

/**
 * Lê os pixels preenchidos (alfa > 128) de um texto desenhado num canvas.
 * Devolve pontos com x em unidades da altura da imagem, centro em (0,0) e y para cima.
 */
export function amostrarTexto(rgba: Uint8ClampedArray, w: number, h: number, passo: number): Ponto2D[] {
  const ps: Ponto2D[] = [];
  for (let y = 0; y < h; y += passo) {
    for (let x = 0; x < w; x += passo) {
      if (rgba[(y * w + x) * 4 + 3] > 128) ps.push({ x: (x + 0.5 - w / 2) / h, y: (h / 2 - y - 0.5) / h });
    }
  }
  return ps;
}

/** O nome, ocupando ~82% da largura (88% em tela em pé). Sem pixels, vira uma nuvem compacta. */
export function formaNome(texto: Ponto2D[], n: number, vp: Viewport, r: () => number): Float32Array {
  const out = new Float32Array(n * 3);
  if (texto.length === 0) {
    for (let i = 0; i < n; i++) out.set([gauss(r) * vp.w * 0.12, gauss(r) * vp.h * 0.08, gauss(r) * 0.4], i * 3);
    return out;
  }
  let minX = Infinity;
  let maxX = -Infinity;
  for (const p of texto) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
  }
  const largura = vp.w * (vp.w < vp.h ? 0.88 : 0.82);
  const escala = largura / (maxX - minX || 1);
  const cx = (minX + maxX) / 2;
  for (let i = 0; i < n; i++) {
    const p = texto[Math.floor(r() * texto.length)];
    // Pequeno espalhamento para as letras parecerem feitas de poeira, não de grade
    const x = (p.x - cx) * escala + (r() - 0.5) * 0.02;
    out.set([Math.max(-vp.w / 2, Math.min(vp.w / 2, x)), p.y * escala + (r() - 0.5) * 0.02 + vp.h * 0.02, (r() - 0.5) * 0.25], i * 3);
  }
  return out;
}

/** Dupla hélice (tipo DNA) à direita, com degraus ligando as fitas. */
export function formaEspiral(n: number, vp: Viewport, r: () => number): Float32Array {
  const out = new Float32Array(n * 3);
  const retrato = vp.w < vp.h;
  const cx = vp.w * (retrato ? 0.36 : 0.26);
  const raio = Math.min(vp.w * 0.09, 1.1);
  const altura = vp.h * 1.6;
  const voltas = 3.2;
  for (let i = 0; i < n; i++) {
    const t = r();
    const ang = t * voltas * TAU;
    const y = (t - 0.5) * altura;
    const tipo = r();
    let a = ang;
    let rr = raio;
    if (tipo < 0.42) a = ang; // fita 1
    else if (tipo < 0.84) a = ang + Math.PI; // fita 2
    else {
      // degrau: ponto no segmento entre as duas fitas
      rr = raio * (r() * 2 - 1);
    }
    const j = 0.05;
    out.set([cx + Math.cos(a) * rr + gauss(r) * j, y + gauss(r) * j, Math.sin(a) * rr + gauss(r) * j], i * 3);
  }
  return out;
}

/** Nuvem larga e funda, levemente à esquerda: fundo discreto para os cards dos projetos. */
export function formaNuvem(n: number, vp: Viewport, r: () => number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    // Disco achatado com braços suaves, como uma galáxia vista de lado
    const raio = Math.pow(r(), 0.6) * vp.w * 0.55;
    const ang = r() * TAU + raio * 0.35;
    out.set([Math.cos(ang) * raio - vp.w * 0.12, gauss(r) * vp.h * 0.14 + Math.sin(ang) * raio * 0.22, Math.sin(ang) * raio * 0.6 - 3], i * 3);
  }
  return out;
}

/** Túnel em espiral em volta da câmera, com uma esfera de partículas no fundo. */
export function formaTunel(n: number, r: () => number): Float32Array {
  const out = new Float32Array(n * 3);
  const naEsfera = Math.floor(n * 0.14);
  for (let i = 0; i < n; i++) {
    if (i < naEsfera) {
      // Superfície de esfera (raio 1.1) centrada em z = -6
      const u = r() * 2 - 1;
      const th = r() * TAU;
      const s = Math.sqrt(1 - u * u);
      const rr = 1.1 * (0.92 + r() * 0.08);
      out.set([s * Math.cos(th) * rr, s * Math.sin(th) * rr, u * rr - 6], i * 3);
    } else {
      const t = r();
      const ang = t * 7 * TAU + gauss(r) * 0.08;
      const raio = 2.4 + gauss(r) * 0.12;
      out.set([Math.cos(ang) * raio, Math.sin(ang) * raio, -26 + t * 34], i * 3);
    }
  }
  return out;
}

/**
 * Lê uma foto (já sem fundo, em tons de cinza) e devolve os pixels visíveis.
 * Peso = opacidade × brilho^2,6: os traços do rosto aparecem por contraste de densidade.
 * Coordenadas como em amostrarTexto: unidades da altura da imagem, centro em (0,0), y para cima.
 */
export function amostrarImagem(rgba: Uint8ClampedArray, w: number, h: number, passo: number): PontoImagem[] {
  const ps: PontoImagem[] = [];
  for (let y = 0; y < h; y += passo) {
    for (let x = 0; x < w; x += passo) {
      const i = (y * w + x) * 4;
      const alfa = rgba[i + 3] / 255;
      if (alfa < 0.08) continue;
      const brilho = (rgba[i] * 0.299 + rgba[i + 1] * 0.587 + rgba[i + 2] * 0.114) / 255;
      // Curva forte: pele clara recebe muitos pontos e traços escuros (olhos, boca) quase nenhum
      ps.push({ x: (x + 0.5 - w / 2) / h, y: (h / 2 - y - 0.5) / h, brilho, peso: alfa * (0.02 + 0.98 * brilho ** 2.6) });
    }
  }
  return ps;
}

/**
 * Rosto em partículas na lateral direita, no lugar do DNA.
 * Mais partículas onde a foto é clara; volume = curvatura oval (cabeça) + um pouco do brilho.
 * Sem imagem (falha ao carregar), devolve a espiral: a animação nunca fica sem forma.
 */
export function formaRosto(img: PontoImagem[], n: number, vp: Viewport, r: () => number, luz?: Float32Array): Float32Array {
  if (img.length === 0) return formaEspiral(n, vp, r);
  const out = new Float32Array(n * 3);
  const retrato = vp.w < vp.h;
  const altura = retrato ? vp.h * 0.46 : vp.h * 0.72;
  const cx = vp.w * (retrato ? 0.2 : 0.25);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, pesoMax = 0;
  for (const p of img) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
    pesoMax = Math.max(pesoMax, p.peso);
  }
  const escala = altura / (maxY - minY || 1);
  const meioX = (minX + maxX) / 2;
  const meioY = (minY + maxY) / 2;
  const rx = ((maxX - minX) / 2) * escala || 1;
  const ry = ((maxY - minY) / 2) * escala || 1;
  const fundo = rx * 0.9;
  for (let i = 0; i < n; i++) {
    // Amostragem por rejeição: pixels claros são escolhidos mais vezes
    let p = img[Math.floor(r() * img.length)];
    for (let tentativa = 0; tentativa < 12 && r() * pesoMax > p.peso; tentativa++) p = img[Math.floor(r() * img.length)];
    const x = (p.x - meioX) * escala + (r() - 0.5) * 0.012;
    const y = (p.y - meioY) * escala + (r() - 0.5) * 0.012;
    const u = x / rx;
    const v = y / ry;
    const bojo = Math.sqrt(Math.max(0, 1 - u * u - v * v));
    out.set([cx + x, y, bojo * fundo + p.brilho * 0.18 + (r() - 0.5) * 0.03], i * 3);
    if (luz) luz[i] = p.brilho;
  }
  return out;
}
