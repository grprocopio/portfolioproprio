import type { CSSProperties } from "react";

type Props = { palavra: string; fatias?: number; duracao?: number; torcao?: number };

/**
 * Tipografia cinética: a palavra é fatiada na vertical e cada fatia gira em torno
 * de um eixo horizontal, atrasada em relação à vizinha. O resultado é uma torção
 * que percorre a palavra. Frente = letra preenchida; verso = só o contorno.
 * Só CSS (transform na GPU); com movimento reduzido fica parada.
 */
export function PalavraGiratoria({ palavra, fatias = 56, duracao = 7, torcao = 0.55 }: Props) {
  return (
    <span aria-hidden="true" className="palavra-giratoria">
      {/* Cópia invisível que dá o tamanho real ao bloco */}
      <span className="pg-medida">{palavra}</span>
      {Array.from({ length: fatias }, (_, i) => {
        const esq = (i / fatias) * 100;
        const dir = 100 - ((i + 1) / fatias) * 100;
        const estilo = {
          // Sobreposição mínima entre fatias para não aparecer emenda
          "--recorte": `inset(-20% ${Math.max(0, dir - 0.15)}% -20% ${Math.max(0, esq - 0.15)}%)`,
          animationDelay: `${-(i / fatias) * torcao * duracao}s`,
          animationDuration: `${duracao}s`,
        } as CSSProperties;
        return (
          <span key={i} className="pg-fatia" style={estilo}>
            <span className="pg-face pg-frente">{palavra}</span>
            <span className="pg-face pg-verso">{palavra}</span>
          </span>
        );
      })}
    </span>
  );
}
