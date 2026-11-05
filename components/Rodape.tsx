import { PalavraGiratoria } from "@/components/PalavraGiratoria";
import { linkWhatsapp, redesAtivas, site } from "@/data/site";

export function Rodape() {
  const ano = new Date().getFullYear();
  return (
    <footer className="relative z-10 overflow-hidden bg-fundo px-4 pb-32 pt-24 md:px-8">
      <div aria-hidden="true" className="feixe left-1/2 -translate-x-1/2" />
      <div className="relative mx-auto max-w-7xl">
        {/* O nome girando fecha a página (antes ficava no topo) */}
        <div className="flex justify-center">
          <PalavraGiratoria palavra="Procopio" />
        </div>

        <div className="mt-24 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="text-2xl font-semibold tracking-tight text-forte">{site.nome}</p>
            <p className="mt-4 max-w-sm text-sm text-apagado">{site.descricao}</p>
          </div>
          <nav aria-label="Contato" className="md:col-span-3">
            <h2 className="etiqueta">Contato</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="text-texto transition duration-300 ease-suave hover:text-forte">
                  WhatsApp
                </a>
              </li>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="text-texto transition duration-300 ease-suave hover:text-forte">
                    {site.email}
                  </a>
                </li>
              )}
            </ul>
          </nav>
          <nav aria-label="Redes" className="md:col-span-3">
            <h2 className="etiqueta">Redes</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {redesAtivas.map((r) => (
                <li key={r.nome}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-texto transition duration-300 ease-suave hover:text-forte">
                    {r.nome}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-2 border-t border-borda pt-6 text-xs text-apagado sm:flex-row sm:justify-between">
          <p>
            © {ano} {site.nome}
          </p>
          <a href="/privacidade" className="transition duration-300 ease-suave hover:text-forte">
            Política de privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
