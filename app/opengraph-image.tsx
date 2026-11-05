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
          background: "#050816",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 96, display: "flex", gap: 24 }}>
          <span>Sites que</span>
          <span style={{ color: "#8f9bff" }}>geram</span>
          <span>resultado.</span>
        </div>
        <div style={{ fontSize: 32, color: "#8f9bff", marginTop: 32, fontFamily: "sans-serif" }}>{site.nome}</div>
      </div>
    ),
    size,
  );
}
