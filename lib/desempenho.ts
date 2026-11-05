/** Quadros seguidos antes de decidir, e o limite da mediana em cada caso */
const CEDO = { amostras: 5, limiteMs: 50 }; // muito lento (< 20 fps): decide logo
const NORMAL = { amostras: 20, limiteMs: 28 }; // lento (< ~35 fps): precisa de mais dados

const mediana = (xs: number[]) => [...xs].sort((a, b) => a - b)[xs.length >> 1];

/** Decide pela mediana, para um engasgo isolado (compilação, GC) não derrubar o 3D. */
export function quadroLento(intervalos: number[]): boolean {
  if (intervalos.length >= CEDO.amostras && mediana(intervalos) > CEDO.limiteMs) return true;
  return intervalos.length >= NORMAL.amostras && mediana(intervalos) > NORMAL.limiteMs;
}
