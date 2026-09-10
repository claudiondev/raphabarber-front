import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, MapPin, Menu, X, ArrowRight } from 'lucide-react';
import raphaFoto from '../assets/image copy.png';
import api from '../api';
import { Monogram } from '../components/Brand';

function SectionEyebrow({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
      <span className="h-px w-8 bg-brass/60" />
      <span className="text-brass-soft text-[11px] font-condensed font-medium uppercase tracking-[0.28em]">
        {children}
      </span>
    </div>
  );
}

function formatPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function LandingPage() {
  const [servicos, setServicos] = useState([]);
  const [loadingServicos, setLoadingServicos] = useState(true);
  const [portfolio, setPortfolio] = useState([]);
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/servicos')
      .then((res) => setServicos(res.data))
      .catch(() => setServicos([]))
      .finally(() => setLoadingServicos(false));

    api.get('/portfolio')
      .then((res) => setPortfolio(res.data))
      .catch(() => setPortfolio([]))
      .finally(() => setLoadingPortfolio(false));
  }, []);

  const handleAgendar = () => {
    setMenuAberto(false);
    const token = localStorage.getItem('token');
    navigate(token ? '/agendamento' : '/login');
  };

  const navLinks = [
    { href: '#sobre', label: 'Sobre' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#portfolio', label: 'Portfólio' },
  ];

  return (
    <div className="min-h-screen bg-ink text-bone font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ink border-b border-line">
        <div className="max-w-5xl mx-auto px-5 md:px-6 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Monogram className="text-2xl text-brass-soft group-hover:text-brass transition-colors" />
            <span className="text-bone text-[13px] font-condensed font-medium tracking-[0.22em] uppercase">
              Rapha Barber
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="relative text-silver hover:text-bone text-[11px] font-condensed uppercase tracking-[0.2em] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-brass after:transition-all hover:after:w-full"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={handleAgendar}
              className="bg-brass hover:bg-brass-deep text-ink font-condensed text-[11px] font-semibold px-5 py-2.5 uppercase tracking-[0.2em] transition-colors"
            >
              Agendar
            </button>
          </div>

          <button
            onClick={() => setMenuAberto((v) => !v)}
            className="md:hidden text-bone p-2 -mr-2"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
          >
            {menuAberto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuAberto && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden bg-ink border-b border-line"
            >
              <div className="px-5 py-5 flex flex-col gap-5">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuAberto(false)}
                    className="text-silver text-sm font-condensed uppercase tracking-[0.2em]"
                  >
                    {l.label}
                  </a>
                ))}
                <button
                  onClick={handleAgendar}
                  className="bg-brass text-ink font-condensed text-xs font-semibold px-5 py-3 uppercase tracking-[0.2em] w-full"
                >
                  Agendar horário
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="grain relative min-h-[100svh] flex flex-col items-center justify-center text-center px-5 pt-16 overflow-hidden">
        <Monogram
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[46%] text-bone/[0.05] pointer-events-none text-[42vw] md:text-[26rem]"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 max-w-2xl"
        >
          <p className="text-silver text-[11px] font-condensed uppercase tracking-[0.32em] mb-7">
            Barbearia · Campina Grande, PB · Desde 2020
          </p>

          <h1 className="font-serif text-[2.75rem] leading-[1.05] md:text-6xl md:leading-[1.05] text-bone mb-3">
            Cada corte leva
            <br />
            <span className="italic text-brass-soft">uma assinatura.</span>
          </h1>

          <motion.svg
            viewBox="0 0 220 20"
            className="w-40 h-4 mx-auto my-5 overflow-visible"
            aria-hidden="true"
          >
            <motion.path
              d="M4 12 C 40 2, 70 18, 110 10 S 180 2, 216 11"
              stroke="#B08D57"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.5, ease: 'easeInOut' }}
            />
          </motion.svg>

          <p className="text-silver text-[15px] md:text-base max-w-md mx-auto mb-10 leading-relaxed">
            Rapha corta há mais de 5 anos em Campina Grande. Você escolhe o horário
            pelo site e senta na cadeira na hora certa — sem fila e sem grupo de WhatsApp.
          </p>

          <button
            onClick={handleAgendar}
            className="group inline-flex items-center gap-2 bg-brass hover:bg-brass-deep text-ink font-condensed text-[13px] font-semibold px-8 py-4 uppercase tracking-[0.22em] transition-colors"
          >
            Agendar horário
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
          <p className="text-silver/70 text-[11px] font-condensed uppercase tracking-[0.18em] mt-5">
            Confirmação na hora · sem cadastro complicado
          </p>
        </motion.div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="py-24 md:py-32 px-5 border-t border-line">
        <div className="max-w-4xl mx-auto grid md:grid-cols-[auto,1fr] gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mx-auto md:mx-0 w-48 h-60 md:w-56 md:h-72 relative flex-shrink-0"
          >
            <div className="absolute -inset-3 border border-line" />
            <img src={raphaFoto} alt="Rapha, barbeiro da Rapha Barber" className="w-full h-full object-cover object-top relative" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <SectionEyebrow>O barbeiro</SectionEyebrow>
            <h2 className="font-serif text-3xl md:text-[2.6rem] leading-tight text-bone mb-5">
              Rapha, à risca desde 2020.
            </h2>
            <p className="text-silver text-[15px] leading-relaxed mb-10 max-w-md mx-auto md:mx-0">
              Mais de 500 cortes depois, o que mudou por aqui foi a fila — hoje ela é
              online. O resto continua igual: atenção ao detalhe, do risco à navalha.
            </p>

            <div className="flex justify-center md:justify-start divide-x divide-line border-t border-line pt-8">
              {[
                { val: '500+', label: 'Clientes' },
                { val: '5+', label: 'Anos de ofício' },
                { val: '2020', label: 'Fundação' },
              ].map((stat) => (
                <div key={stat.label} className="px-6 first:pl-0 text-center md:text-left">
                  <p className="font-serif text-2xl text-brass-soft">{stat.val}</p>
                  <p className="text-silver text-[10px] font-condensed uppercase tracking-[0.18em] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVIÇOS — quadro de preços */}
      <section id="servicos" className="py-24 md:py-32 px-5 border-t border-line bg-ink-soft">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <SectionEyebrow>O cardápio</SectionEyebrow>
            <h2 className="font-serif text-3xl md:text-4xl text-bone -mt-1">Serviços &amp; valores</h2>
          </div>

          {loadingServicos ? (
            <p className="text-silver/60 text-sm text-center py-8">Carregando os serviços...</p>
          ) : servicos.length === 0 ? (
            <p className="text-silver/60 text-sm text-center py-8">Nenhum serviço cadastrado no momento.</p>
          ) : (
            <ul>
              {servicos.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="group flex items-baseline gap-3 py-5 border-b border-line"
                >
                  <span className="font-serif text-lg md:text-xl text-bone group-hover:text-brass-soft transition-colors">
                    {s.nome}
                  </span>
                  {s.descricao && (
                    <span className="hidden md:inline text-silver text-xs">{s.descricao}</span>
                  )}
                  <span className="flex-1 border-b border-dotted border-silver/30 translate-y-[-4px]" />
                  <span className="font-condensed text-brass-soft text-base font-medium whitespace-nowrap">
                    R$ {formatPreco(s.preco)}
                  </span>
                </motion.li>
              ))}
            </ul>
          )}

          <div className="text-center mt-14">
            <button
              onClick={handleAgendar}
              className="inline-flex items-center gap-2 border border-brass/50 hover:border-brass hover:bg-brass hover:text-ink text-brass-soft font-condensed text-[13px] font-semibold px-8 py-4 uppercase tracking-[0.22em] transition-colors"
            >
              Quero agendar
            </button>
          </div>
        </div>
      </section>

      {/* PORTFÓLIO — prova de contato */}
      <section id="portfolio" className="py-24 md:py-32 px-5 border-t border-line">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <SectionEyebrow>O trabalho</SectionEyebrow>
            <h2 className="font-serif text-3xl md:text-4xl text-bone -mt-1">Direto da cadeira</h2>
          </div>

          {loadingPortfolio ? (
            <p className="text-silver/60 text-sm text-center py-8">Carregando fotos...</p>
          ) : portfolio.length === 0 ? (
            <p className="text-silver/60 text-sm text-center py-8">Ainda sem fotos no portfólio.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-line">
              {portfolio.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  className="group relative aspect-square bg-ink overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.urlImagem}
                    alt={item.legenda || 'Trabalho de Rapha Barber'}
                    className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute top-2 left-2 text-bone/50 text-[10px] font-condensed tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.legenda && (
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-bone text-[11px] font-condensed uppercase tracking-widest">{item.legenda}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 md:py-32 px-5 border-t border-line bg-ink-soft">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center"
        >
          <Monogram className="text-3xl text-brass/60 mb-6" />
          <h2 className="font-serif text-3xl md:text-4xl text-bone mb-4 leading-tight">
            Sua próxima assinatura
            <br />
            <span className="italic text-brass-soft">começa aqui.</span>
          </h2>
          <p className="text-silver text-[15px] mb-10">Marque um horário e deixe o resto com o Rapha.</p>
          <button
            onClick={handleAgendar}
            className="inline-flex items-center gap-2 bg-brass hover:bg-brass-deep text-ink font-condensed text-[13px] font-semibold px-9 py-4 uppercase tracking-[0.22em] transition-colors"
          >
            Agendar agora
            <ArrowRight size={15} />
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line py-12 px-5">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <Link to="/" className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <Monogram className="text-xl text-brass-soft" />
              <span className="text-bone font-condensed tracking-[0.22em] uppercase text-[13px]">Rapha Barber</span>
            </div>
            <p className="text-silver/70 text-[11px] font-condensed tracking-wider uppercase">Desde 2020 · Campina Grande, PB</p>
          </Link>

          <div className="flex items-center gap-2 text-silver text-[13px]">
            <MapPin size={14} className="text-brass-soft flex-shrink-0" />
            <span>R. Olávo Bilac, 102 — José Pinheiro, Campina Grande/PB</span>
          </div>

          <a
            href="https://www.instagram.com/raphabarbercg/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-silver hover:text-brass-soft text-sm font-condensed tracking-wider transition-colors"
          >
            <Instagram size={16} />
            @raphabarbercg
          </a>
        </div>
        <p className="text-silver/50 text-[11px] text-center mt-10 font-condensed tracking-wider">
          © 2026 Rapha Barber · Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
