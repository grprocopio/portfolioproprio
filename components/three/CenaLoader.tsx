"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { amostrarTexto, type Ponto2D } from "@/lib/particulas";
import { ParticulasPlano } from "./ParticulasPlano";

const Cena = dynamic(() => import("./Cena"), { ssr: false });

type Modo = { motor: "3d" | "2d"; movel: boolean; texto: Ponto2D[] };

/**
 * Escolhe o motor: WebGL com placa de vídeo de verdade → 3D na GPU.
 * Sem WebGL, ou WebGL desenhado por software (aceleração desligada, driver bloqueado) → motor 2D,
 * que nesse caso é mais fluido (medido: 60 fps no 2D contra ~35 no WebGL por software).
 */
function escolherMotor(): "3d" | "2d" {
  try {
    const c = document.createElement("canvas");
    const ctx = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!ctx) return "2d";
    const ext = ctx.getExtension("WEBGL_debug_renderer_info");
    const nome = String(ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ctx.getParameter(ctx.RENDERER));
    ctx.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|software|basic render/i.test(nome) ? "2d" : "3d";
  } catch {
    return "2d";
  }
}

/** Desenha o nome com a fonte do site num canvas e devolve os pixels preenchidos. */
async function amostrarNome(palavra: string): Promise<Ponto2D[]> {
  const familia = getComputedStyle(document.documentElement).getPropertyValue("--font-archivo").trim() || "sans-serif";
  const W = 1600;
  const H = 300;
  let tamanho = 220;
  const fonte = (t: number) => `800 ${t}px ${familia}`;
  try {
    await document.fonts.load(fonte(tamanho), palavra);
  } catch {
    // Sem a fonte, o canvas usa a sans padrão: o nome continua legível
  }
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  (ctx as CanvasRenderingContext2D & { fontStretch?: string }).fontStretch = "expanded";
  ctx.font = fonte(tamanho);
  const largura = ctx.measureText(palavra).width;
  if (largura > W * 0.94) {
    tamanho = Math.floor((tamanho * W * 0.94) / largura);
    ctx.font = fonte(tamanho);
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(palavra, W / 2, H / 2);
  return amostrarTexto(ctx.getImageData(0, 0, W, H).data, W, H, 2);
}

/** Se o WebGL falhar depois de montar (contexto recusado, driver quebrado), troca para o canvas 2D. */
class SeFalhar extends Component<{ aoFalhar: () => void; children: ReactNode }, { falhou: boolean }> {
  state = { falhou: false };
  static getDerivedStateFromError() {
    return { falhou: true };
  }
  componentDidCatch() {
    this.props.aoFalhar();
  }
  render() {
    return this.state.falhou ? null : this.props.children;
  }
}

/**
 * Partículas sempre ligadas (decisão do usuário): sem teste de desempenho e sem respeito a
 * "menos movimento". Com WebGL, motor 3D na GPU; sem WebGL (ou se ele falhar), motor reserva
 * em canvas 2D com as mesmas formas. Em nenhum caso a página fica sem animação.
 */
export function CenaLoader({ palavra }: { palavra: string }) {
  const [modo, setModo] = useState<Modo | null>(null);
  const [pronta, setPronta] = useState(false);
  const aoPronto = useCallback(() => setPronta(true), []);

  useEffect(() => {
    let cancelado = false;
    const movel = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const motor = escolherMotor();
    amostrarNome(palavra)
      .catch(() => [] as Ponto2D[])
      .then((texto) => {
        if (!cancelado) setModo({ motor, movel, texto });
      });
    return () => {
      cancelado = true;
    };
  }, [palavra]);

  useEffect(() => {
    if (modo) document.documentElement.dataset.fita = pronta ? modo.motor : "carregando";
  }, [modo, pronta]);

  if (!modo) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-0 h-lvh transition-opacity duration-1000 ease-suave ${
        pronta ? "opacity-100" : "opacity-0"
      }`}
    >
      {modo.motor === "3d" ? (
        <SeFalhar aoFalhar={() => setModo({ ...modo, motor: "2d" })}>
          <Cena movel={modo.movel} texto={modo.texto} aoCarregar={aoPronto} />
        </SeFalhar>
      ) : (
        <ParticulasPlano movel={modo.movel} texto={modo.texto} aoPronto={aoPronto} />
      )}
    </div>
  );
}
