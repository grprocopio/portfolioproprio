/**
 * Estado global lido pela cena 3D a cada quadro (sem re-render do React).
 * Cada trecho do scroll escreve sua própria parte; a fase é a soma (0 a 3):
 * 0 nome → 1 espiral → 2 nuvem → 3 túnel.
 */
export const scrollState = {
  partes: [0, 0, 0],
  /** 0 a 1: quanto a câmera já entrou no túnel, dentro da seção final */
  cta: 0,
  /** Ponteiro normalizado (-1 a 1), para um leve balanço */
  ponteiro: { x: 0, y: 0 },
};

export const faseAtual = () => scrollState.partes.reduce((a, b) => a + b, 0);
