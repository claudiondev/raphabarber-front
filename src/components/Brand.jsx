/* Monograma RB — recriado em tipografia (Fraunces itálico) a partir da marca
   real do Rapha, para ficar nítido em qualquer tamanho e herdar as cores do
   sistema. Compartilhado por todas as páginas para manter a marca consistente. */
export function Monogram({ className = '' }) {
  return (
    <span className={`inline-flex items-baseline font-serif italic leading-none select-none ${className}`} aria-hidden="true">
      <span className="relative z-10">R</span>
      <span className="-ml-[0.34em]">B</span>
    </span>
  );
}

export function Wordmark({ className = '' }) {
  return (
    <span className={`font-condensed tracking-[0.22em] uppercase ${className}`}>
      Rapha Barber
    </span>
  );
}
