"use client";

import { useEffect, useRef } from "react";
import { aleatorio, formaEspiral, formaNome, formaNuvem, formaTunel, FORMAS, type Ponto2D } from "@/lib/particulas";
import { faseAtual, scrollState } from "@/lib/scroll-state";

const FASE_MAX = FORMAS.length - 1;
const TAN_MEIO_FOV = Math.tan(((35 / 2) * Math.PI) / 180);
const CAMERA_Z = 10;

type Props = { movel: boolean; texto: Ponto2D[]; aoPronto: () => void };

const suave = (t: number) => t * t * (3 - 2 * t);

/**
 * Motor reserva em canvas 2D (sem WebGL): mesmas formas e mesma história de rolagem,
 * com menos partículas e projeção de perspectiva feita na CPU. Funciona em qualquer navegador.
 */
export function ParticulasPlano({ movel, texto, aoPronto }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    const n = movel ? 2800 : 5000;
    let largura = 0;
    let altura = 0;
    let formas: Float32Array[] = [];
    const rnd = new Float32Array(n * 4);
    const r = aleatorio(55);
    for (let i = 0; i < rnd.length; i++) rnd[i] = r();

    const montar = () => {
      largura = canvas.clientWidth;
      altura = canvas.clientHeight;
      canvas.width = largura;
      canvas.height = altura;
      // Tamanho da tela no plano z=0, igual ao da cena WebGL
      const h = 2 * CAMERA_Z * TAN_MEIO_FOV;
      const vp = { w: h * (largura / altura), h };
      formas = [
        formaNome(texto, n, vp, aleatorio(11)),
        formaEspiral(n, vp, aleatorio(22)),
        formaNuvem(n, vp, aleatorio(33)),
        formaTunel(n, aleatorio(44)),
      ];
    };
    montar();
    window.addEventListener("resize", montar);

    let fase = faseAtual();
    let anterior = performance.now();
    let raf = 0;
    let primeiro = true;

    const quadro = (agora: number) => {
      const dt = Math.min((agora - anterior) / 1000, 0.05);
      anterior = agora;
      fase += (faseAtual() - fase) * Math.min(1, dt * 5);
      const f = Math.max(0, Math.min(FASE_MAX, fase));
      const k = Math.min(Math.floor(f), FASE_MAX - 1);
      const t = f - k;
      const A = formas[k];
      const B = formas[k + 1];
      const tempo = agora / 1000;
      const avanco = Math.max(0, Math.min(1, f - 2)) * scrollState.cta * 9;
      const focal = altura / 2 / TAN_MEIO_FOV;
      const intensidade = 1 - 0.55 * Math.max(0, 1 - Math.abs(f - 2));

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#050816";
      ctx.fillRect(0, 0, largura, altura);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < n; i++) {
        const j = i * 3;
        const q = i * 4;
        // Mesma lógica do shader: cada partícula parte num momento diferente e voa num arco
        const tl = suave(Math.max(0, Math.min(1, t * 1.6 - rnd[q] * 0.6)));
        const arco = Math.sin(tl * Math.PI) * 1.8;
        const x = A[j] + (B[j] - A[j]) * tl + (rnd[q + 1] - 0.5) * arco + 0.035 * Math.sin(tempo * 0.9 + rnd[q] * 40);
        const y = A[j + 1] + (B[j + 1] - A[j + 1]) * tl + (rnd[q + 2] - 0.5) * arco + 0.035 * Math.cos(tempo * 0.7 + rnd[q + 1] * 40);
        const z = A[j + 2] + (B[j + 2] - A[j + 2]) * tl + (rnd[q + 3] - 0.5) * arco + avanco;
        const prof = CAMERA_Z - z;
        if (prof < 0.4) continue;
        const escala = focal / prof;
        const px = largura / 2 + x * escala;
        const py = altura / 2 - y * escala;
        if (px < -4 || px > largura + 4 || py < -4 || py > altura + 4) continue;
        const brilho = rnd[q + 3];
        const lado = Math.max(1, 0.024 * (0.55 + brilho * 0.9) * escala);
        const alfa = intensidade * Math.min(1, (32 - prof) / 24) * Math.min(1, (prof - 0.4) / 1.6);
        ctx.fillStyle = brilho > 0.88 ? `rgba(220,226,255,${alfa})` : `rgba(75,91,255,${alfa * 0.85})`;
        ctx.fillRect(px - lado / 2, py - lado / 2, lado, lado);
      }

      if (primeiro) {
        primeiro = false;
        aoPronto();
      }
      raf = requestAnimationFrame(quadro);
    };
    raf = requestAnimationFrame(quadro);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", montar);
    };
  }, [movel, texto, aoPronto]);

  return <canvas ref={ref} className="h-full w-full" />;
}
