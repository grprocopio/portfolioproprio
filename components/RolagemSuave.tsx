"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scroll-state";

gsap.registerPlugin(ScrollTrigger);

/** Trechos do scroll que movem a fita de um estado ao próximo */
const trechos: { trigger: string; start: string; end: string }[] = [
  { trigger: "#topo", start: "top top", end: "bottom 60%" }, // anel → anel perto, girando
  { trigger: "#sobre", start: "top 95%", end: "top 40%" }, // → coluna à direita
  { trigger: "#projetos", start: "top 85%", end: "top 25%" }, // → coluna à esquerda
  { trigger: "#contato", start: "top bottom", end: "top top" }, // → túnel
];

export function RolagemSuave() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: 0 }, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      trechos.forEach((t, i) => {
        if (!document.querySelector(t.trigger)) return;
        ScrollTrigger.create({
          trigger: t.trigger,
          start: t.start,
          end: t.end,
          onUpdate: (st) => (scrollState.partes[i] = st.progress),
          onRefresh: (st) => (scrollState.partes[i] = st.progress),
        });
      });
      if (document.querySelector("#contato")) {
        ScrollTrigger.create({
          trigger: "#contato",
          start: "top top",
          end: "bottom bottom",
          onUpdate: (st) => (scrollState.cta = st.progress),
        });
      }
    });

    const aoMover = (e: PointerEvent) => {
      scrollState.ponteiro.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.ponteiro.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", aoMover, { passive: true });

    return () => {
      window.removeEventListener("pointermove", aoMover);
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
