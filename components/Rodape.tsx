import { GithubLogoIcon, InstagramLogoIcon, LinkedinLogoIcon } from "@phosphor-icons/react/dist/ssr";
import type { ComponentType } from "react";
import { linkWhatsapp, redesAtivas, site } from "@/data/site";

const icones: Record<string, ComponentType<{ className?: string; weight?: "regular" | "bold" | "fill"; "aria-hidden"?: boolean }>> = {
  GitHub: GithubLogoIcon,
  Instagram: InstagramLogoIcon,
  LinkedIn: LinkedinLogoIcon,
};

export function Rodape() {
  const ano = new Date().getFullYear();
  return (
    <footer className="border-t border-linha px-5 pb-10 pt-16 sm:px-8 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="hero-heading text-5xl font-black uppercase leading-none tracking-tight">Procopio</p>
          <p className="mt-4 max-w-sm text-sm font-light text-claro/70">{site.descricao}</p>
        </div>
        <nav aria-label="Contato" className="md:col-span-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-claro/60">Contato</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="text-claro transition-opacity duration-200 hover:opacity-70">
                WhatsApp
              </a>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="text-claro transition-opacity duration-200 hover:opacity-70">
                  {site.email}
                </a>
              </li>
            )}
          </ul>
        </nav>
        <nav aria-label="Redes" className="md:col-span-3">
          <h2 className="text-xs font-medium uppercase tracking-widest text-claro/60">Redes</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {redesAtivas.map((r) => (
              <li key={r.nome}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-claro transition-opacity duration-200 hover:opacity-70"
                >
                  {(() => {
                    const Icone = icones[r.nome];
                    return Icone ? <Icone aria-hidden className="size-5" /> : null;
                  })()}
                  {r.nome === "Instagram" ? "@guiprocopioo" : r.nome}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-2 border-t border-linha pt-6 text-xs text-claro/60 sm:flex-row sm:justify-between">
        <p>
          © {ano} {site.nome}
        </p>
        <a href="/privacidade" className="transition-opacity duration-200 hover:opacity-70">
          Política de privacidade
        </a>
      </div>
    </footer>
  );
}
