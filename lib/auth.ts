import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, segredoDoAmbiente, tokenValido } from "./sessao";

export async function logado(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  return tokenValido(token, segredoDoAmbiente());
}

/** Para páginas e server actions: sem sessão válida, volta para /entrar. */
export async function exigirSessao(): Promise<void> {
  if (!(await logado())) redirect("/entrar");
}
