import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import raphaFoto from '../assets/image copy.png';
import api from '../api';

function LandingPage() {
  const [servicos, setServicos] = useState([]);
  const [portfolio, setPortfolio] = useState([]); // Estado para o portfólio dinâmico
  const [loadingPortfolio, setLoadingPortfolio] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Busca Serviços
    api.get('/servicos')
      .then((res) => setServicos(res.data))
      .catch(() => setServicos([]));

    // Busca Portfólio do Back-end
    api.get('/portfolio')
      .then((res) => {
        setPortfolio(res.data);
        setLoadingPortfolio(false);
      })
      .catch(() => {
        setPortfolio([]);
        setLoadingPortfolio(false);
      });
  }, []);

  const handleAgendar = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/agendamento');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800/50"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="group flex items-center gap-2 cursor-pointer">
            <span className="text-amber-500 text-xl font-black transition-transform group-hover:scale-110">RB</span>
            <span className="text-white text-sm font-black tracking-widest uppercase">
              Rapha<span className="text-amber-500">Barber</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="text-zinc-400 hover:text-amber-500 text-xs uppercase tracking-wider transition-colors">Sobre</a>
            <a href="#servicos" className="text-zinc-400 hover:text-amber-500 text-xs uppercase tracking-wider transition-colors">Serviços</a>
            <a href="#portfolio" className="text-zinc-400 hover:text-amber-500 text-xs uppercase tracking-wider transition-colors">Portfólio</a>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAgendar} 
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs px-4 py-2 rounded-xl transition-all uppercase tracking-wider shadow-lg shadow-amber-500/20"
          >
            Agendar
          </motion.button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#78350f20_0%,_transparent_70%)]" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" 
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">Desde 2020 · Campina Grande/PB</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-4 tracking-tight">
            RAPHA<br /><span className="text-amber-500">BARBER</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-lg max-w-sm mx-auto mb-10 leading-relaxed">
            Cortes que definem seu estilo.<br />Atendimento premium, do jeito que você merece.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAgendar} 
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm px-10 py-4 rounded-2xl transition-all uppercase tracking-widest shadow-2xl shadow-amber-500/30"
          >
            ✂ Agendar Horário
          </motion.button>
          <p className="text-zinc-600 text-xs mt-4 uppercase tracking-widest">Rápido · Sem fila · Online</p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40"
        >
          <span className="text-zinc-500 text-xs uppercase tracking-widest">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-zinc-500 to-transparent" />
        </motion.div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex-shrink-0"
            >
              <div className="w-56 h-56 md:w-72 md:h-72 rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10">
                <img src={raphaFoto} alt="Rapha Barber" className="w-full h-full object-cover object-top" />
              </div>
              <motion.div 
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 bg-amber-500 text-zinc-950 font-black text-xs px-4 py-2 rounded-2xl shadow-lg"
              >
                + 5 anos de experiência
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">Sobre mim</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                Paixão por cortes<br /><span className="text-zinc-400 font-light">desde o início</span>
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                Sou o Rapha, barbeiro profissional com mais de 5 anos dedicados à arte do corte masculino aqui em Campina Grande. Comecei em 2020 com um sonho e muito trabalho, e hoje tenho orgulho de cuidar da autoestima dos meus clientes com qualidade e atenção aos detalhes.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-8">
                {[
                  { val: '+500', label: 'Clientes' },
                  { val: '5+', label: 'Anos' },
                  { val: '100%', label: 'Dedicação' }
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5, borderColor: '#f59e0b' }}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-center transition-colors"
                  >
                    <p className="text-amber-500 text-2xl font-black">{stat.val}</p>
                    <p className="text-zinc-500 text-xs uppercase tracking-wider">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-24 px-4 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">O que oferecemos</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Serviços & Valores</h2>
          </div>
          {servicos.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center animate-pulse py-8">Carregando serviços...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {servicos.map((s, i) => (
                <motion.div 
                  key={s.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/30 rounded-2xl px-6 py-5 flex justify-between items-center transition-all group"
                >
                  <div>
                    <p className="text-zinc-100 font-bold text-sm group-hover:text-amber-500 transition-colors">{s.nome}</p>
                    {s.descricao && <p className="text-zinc-500 text-xs mt-0.5">{s.descricao}</p>}
                  </div>
                  <span className="text-amber-500 font-black text-lg ml-4">R$ {Number(s.preco).toFixed(2)}</span>
                </motion.div>
              ))}
            </div>
          )}
          <div className="text-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAgendar} 
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm px-10 py-4 rounded-2xl transition-all uppercase tracking-widest shadow-xl shadow-amber-500/20"
            >
              ✂ Quero Agendar
            </motion.button>
          </div>
        </div>
      </section>

      {/* PORTFOLIO (DINÂMICO) */}
      <section id="portfolio" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">Nossos trabalhos</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Portfólio</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {loadingPortfolio ? (
              <p className="text-zinc-600 text-sm text-center col-span-full py-8">Carregando fotos...</p>
            ) : portfolio.length === 0 ? (
              <p className="text-zinc-600 text-sm text-center col-span-full py-8 italic">Nenhuma foto adicionada ainda.</p>
            ) : (
              portfolio.map((item, i) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, borderColor: '#f59e0b50' }}
                  className="aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all group cursor-pointer relative"
                >
                  <img src={item.urlImagem} alt={item.legenda} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                     <span className="text-white text-[10px] font-bold uppercase tracking-widest">{item.legenda}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-4 bg-zinc-900/30 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto text-center"
        >
          <motion.span 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl mb-6 block"
          >
            💈
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Pronto para o próximo<br /><span className="text-amber-500">nível?</span>
          </h2>
          <p className="text-zinc-400 text-sm mb-10 leading-relaxed">Agende seu horário agora mesmo. Rápido, fácil e sem complicação.</p>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAgendar} 
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm px-12 py-4 rounded-2xl transition-all uppercase tracking-widest shadow-2xl shadow-amber-500/30"
          >
            ✂ Agendar Agora
          </motion.button>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-800 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <Link to="/" className="group inline-block mb-1">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="text-amber-500 font-black transition-transform group-hover:scale-110">RB</span>
                <span className="text-white font-black tracking-widest uppercase text-sm">Rapha<span className="text-amber-500">Barber</span></span>
              </div>
            </Link>
            <p className="text-zinc-600 text-xs">Desde 2020 · Campina Grande, PB</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-500 text-xs mb-1 uppercase tracking-wider">R. Olávo Bilac, 102 - José Pinheiro</p>
            <p className="text-zinc-400 text-sm">Campina Grande · PB</p>
          </div>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            href="https://www.instagram.com/raphabarbercg/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 px-5 py-3 rounded-2xl transition-all group"
            >
  <span className="text-lg">📸</span>
  <span className="text-zinc-400 group-hover:text-amber-500 text-sm font-bold transition-colors">
    @raphabarbercg
  </span>
</motion.a>
        </div>
        <div className="text-center mt-8">
          <p className="text-zinc-700 text-xs">© 2026 RaphaBarber · Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;