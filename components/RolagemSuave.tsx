"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Rolagem suave com inércia (Lenis), inclusive nos links de âncora do menu. */
export function RolagemSuave() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: true });
    return () => lenis.destroy();
  }, []);
  return null;
}
