import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, segredoDoAmbiente, tokenValido } from "@/lib/sessao";

/**
 * Checagem rápida (só o cookie): sem sessão válida, qualquer página manda para /entrar.
 * As páginas e as server actions conferem a sessão de novo (o proxy sozinho não basta).
 */
export default async function proxy(req: NextRequest) {
  const ok = await tokenValido(req.cookies.get(COOKIE)?.value, segredoDoAmbiente());
  const naEntrada = req.nextUrl.pathname === "/entrar";
  if (!ok && !naEntrada) return NextResponse.redirect(new URL("/entrar", req.nextUrl));
  if (ok && naEntrada) return NextResponse.redirect(new URL("/", req.nextUrl));
  return NextResponse.next();
}

export const config = {
  // Arquivos estáticos (imagens, ícone, fontes) passam direto
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:webp|png|svg|ico|jpg|woff2?)$).*)"],
};
