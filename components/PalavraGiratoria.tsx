import type { CSSProperties } from "react";

type Props = { palavra: string; fatias?: number; duracao?: number; torcao?: number };

/**
 * Tipografia cinética: a palavra é fatiada na vertical e cada fatia gira em torno
 * de um eixo horizontal, atrasada em relação à vizinha. O resultado é uma torção
 * que percorre a palavra. Frente = letra preenchida; verso = só o contorno.
 *
 * Desempenho: cada face é uma janela estreita (largura da fatia, overflow oculto)
 * com a palavra deslocada dentro dela. Assim cada camada na GPU tem só o tamanho
 * da fatia, e o total de pixels compostos por quadro é ~2× a palavra, não 2N×.
 * Só CSS (transform), sempre animada.
 */
export function PalavraGiratoria({ palavra, fatias = 48, duracao = 7, torcao = 0.55 }: Props) {
  const largura = 100 / fatias;
  return (
    <span aria-hidden="true" className="palavra-giratoria">
      {/* Cópia invisível que dá o tamanho real ao bloco */}
      <span className="pg-medida">{palavra}</span>
      {Array.from({ length: fatias }, (_, i) => {
        const fatia = {
          left: `${i * largura}%`,
          // Sobra mínima para não aparecer emenda entre fatias vizinhas
          width: `${largura + 0.12}%`,
          animationDelay: `${-(i / fatias) * torcao * duracao}s`,
          animationDuration: `${duracao}s`,
        } as CSSProperties;
        const dentro = { left: `${-i * 100}%`, width: `${fatias * 100}%` } as CSSProperties;
        return (
          <span key={i} className="pg-fatia" style={fatia}>
            <span className="pg-face pg-frente">
              <span className="pg-texto" style={dentro}>
                {palavra}
              </span>
            </span>
            <span className="pg-face pg-verso">
              <span className="pg-texto" style={dentro}>
                {palavra}
              </span>
            </span>
          </span>
        );
      })}
    </span>
  );
}
