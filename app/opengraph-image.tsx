import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.nome}: sites que geram resultado`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Imagem() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 96, display: "flex", gap: 24 }}>
          <span>Sites que</span>
          <span style={{ fontStyle: "italic" }}>geram</span>
          <span>resultado.</span>
        </div>
        <div style={{ fontSize: 32, color: "#9b9b9b", marginTop: 32, fontFamily: "sans-serif" }}>{site.nome}</div>
      </div>
    ),
    size,
  );
}
