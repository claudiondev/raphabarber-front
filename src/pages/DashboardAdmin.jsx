import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import api from '../api';

const STATUS_LABELS = {
  AGENDADO: { label: 'Agendado', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  CONFIRMADO: { label: 'Confirmado', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  CONCLUIDO: { label: 'Concluído', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  CANCELADO: { label: 'Cancelado', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

function DashboardAdmin() {
  const [aba, setAba] = useState('agenda');
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // Forms
  const [formServico, setFormServico] = useState({ nome: '', descricao: '', preco: '', duracaoMinutos: '' });
  const [formPortfolio, setFormPortfolio] = useState({ urlImagem: '', legenda: '' });
  
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioRole');
    navigate('/');
  };

  // ── BUSCA DE DADOS ──────────────────────────────────
  const buscarAgendamentos = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/agendamentos/dia?data=${dataSelecionada}`);
      setAgendamentos(response.data);
    } catch { setAgendamentos([]); }
    finally { setLoading(false); }
  };

  const buscarServicos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/servicos');
      setServicos(response.data);
    } catch { setServicos([]); }
    finally { setLoading(false); }
  };

  const buscarPortfolio = async () => {
    setLoading(true);
    try {
      const response = await api.get('/portfolio');
      setPortfolio(response.data);
    } catch { setPortfolio([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (aba === 'agenda') buscarAgendamentos();
    if (aba === 'servicos') buscarServicos();
    if (aba === 'portfolio') buscarPortfolio();
  }, [aba, dataSelecionada]);

  // ── AÇÕES PORTFÓLIO ────────────────────────────────
  const handleSalvarFoto = async () => {
    if (!formPortfolio.urlImagem || !formPortfolio.legenda) {
      setMensagem({ texto: 'Preencha o link e a legenda.', tipo: 'erro' });
      return;
    }
    try {
      await api.post('/portfolio', formPortfolio);
      setFormPortfolio({ urlImagem: '', legenda: '' });
      setMensagem({ texto: 'Foto adicionada!', tipo: 'sucesso' });
      buscarPortfolio();
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    } catch {
      setMensagem({ texto: 'Erro ao salvar foto.', tipo: 'erro' });
    }
  };

  const handleDeletarFoto = async (id) => {
    if (!window.confirm('Excluir esta foto do portfólio?')) return;
    try {
      await api.delete(`/portfolio/${id}`);
      buscarPortfolio();
    } catch { alert('Erro ao deletar.'); }
  };

  // ── AÇÕES SERVIÇOS ──────────────────────
  const handleSalvarServico = async () => {
    if (!formServico.nome || !formServico.preco) return;
    try {
      if (editandoId) {
        await api.put(`/servicos/${editandoId}`, formServico);
      } else {
        await api.post('/servicos', formServico);
      }
      setFormServico({ nome: '', descricao: '', preco: '', duracaoMinutos: '' });
      setEditandoId(null);
      buscarServicos();
    } catch { alert('Erro ao salvar serviço.'); }
  };

  // FUNÇÃO ATUALIZADA COM LOGS E MENSAGEM
  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/agendamentos/${id}`, { status: novoStatus });
      setMensagem({ texto: `Agendamento marcado como ${novoStatus.toLowerCase()}!`, tipo: 'sucesso' });
      await buscarAgendamentos();
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      console.error("Erro na API:", error);
      setMensagem({ texto: 'Erro ao atualizar status.', tipo: 'erro' });
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* HEADER */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/" className="group flex items-center gap-2">
            <span className="text-amber-500 text-xl font-black">RB</span>
            <p className="text-white text-sm font-black uppercase">Rapha<span className="text-amber-500">Barber</span></p>
          </Link>
          <button onClick={handleLogout} className="text-red-500 text-xs font-bold uppercase border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all">Sair</button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-6">
        {/* MENU DE ABAS */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['agenda', 'servicos', 'portfolio'].map((item) => (
            <button
              key={item}
              onClick={() => setAba(item)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap
                ${aba === item ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'}`}
            >
              {item === 'agenda' && '📅 Agenda'}
              {item === 'servicos' && '✂️ Serviços'}
              {item === 'portfolio' && '📸 Portfólio'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ABA AGENDA */}
          {aba === 'agenda' && (
            <motion.div key="agenda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <input type="date" value={dataSelecionada} onChange={(e) => setDataSelecionada(e.target.value)} style={{ colorScheme: 'dark' }} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2" />
                
                {/* MENSAGEM DE FEEDBACK NA AGENDA */}
                {mensagem.texto && aba === 'agenda' && (
                  <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`text-xs font-bold px-4 py-2 rounded-lg ${mensagem.tipo === 'erro' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                    {mensagem.texto}
                  </motion.p>
                )}
              </div>

              <div className="space-y-4">
                {agendamentos.length === 0 ? (
                  <p className="text-zinc-600 text-sm text-center py-10">Nenhum agendamento para este dia.</p>
                ) : (
                  agendamentos.map(a => (
                    <div key={a.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex justify-between items-center transition-all hover:border-zinc-700">
                      <div>
                        <p className="font-bold">{a.cliente?.email}</p>
                        <p className="text-zinc-400 text-sm">
                          {a.servico?.nome} · <span className="text-amber-500">{new Date(a.dataHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className={`ml-3 text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${a.status === 'CONCLUIDO' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {a.status}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {a.status !== 'CONCLUIDO' && (
                          <>
                            <button onClick={() => atualizarStatus(a.id, 'CONCLUIDO')} className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-500 hover:text-white transition-all">✓</button>
                            <button onClick={() => atualizarStatus(a.id, 'CANCELADO')} className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-all">✕</button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ABA SERVIÇOS */}
          {aba === 'servicos' && (
            <motion.div key="servicos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 h-fit">
                <h3 className="text-amber-500 text-xs font-bold uppercase mb-4">Novo Serviço</h3>
                <input type="text" placeholder="Nome" value={formServico.nome} onChange={e => setFormServico({...formServico, nome: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 mb-3" />
                <div className="flex gap-3 mb-4">
                  <input type="number" placeholder="Preço" value={formServico.preco} onChange={e => setFormServico({...formServico, preco: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3" />
                  <input type="number" placeholder="Minutos" value={formServico.duracaoMinutos} onChange={e => setFormServico({...formServico, duracaoMinutos: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3" />
                </div>
                <button onClick={handleSalvarServico} className="w-full bg-amber-500 text-zinc-950 font-black py-3 rounded-xl uppercase text-xs">Salvar Serviço</button>
              </div>
              <div className="space-y-3">
                {servicos.map(s => (
                  <div key={s.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center">
                    <div><p className="font-bold">{s.nome}</p><p className="text-amber-500 text-sm">R$ {s.preco}</p></div>
                    <button onClick={() => api.delete(`/servicos/${s.id}`).then(buscarServicos)} className="text-red-500 text-xs">Deletar</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ABA PORTFÓLIO */}
          {aba === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 h-fit">
                <h3 className="text-amber-500 text-xs font-bold uppercase mb-4">📸 Adicionar ao Portfólio</h3>
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl mb-2">
                    <p className="text-amber-500 text-[10px] leading-tight">
                      <strong>Dica:</strong> Suba a imagem no <a href="https://imgbb.com/" target="_blank" className="underline">ImgBB</a>, copie o <strong>Link Direto</strong> e cole abaixo.
                    </p>
                  </div>
                  <input type="text" placeholder="Link da imagem (URL)" value={formPortfolio.urlImagem} onChange={e => setFormPortfolio({...formPortfolio, urlImagem: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm" />
                  <input type="text" placeholder="Legenda (ex: Corte Degradê)" value={formPortfolio.legenda} onChange={e => setFormPortfolio({...formPortfolio, legenda: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm" />
                  
                  {mensagem.texto && aba === 'portfolio' && (
                    <p className={`text-xs p-3 rounded-lg ${mensagem.tipo === 'erro' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                      {mensagem.texto}
                    </p>
                  )}
                  
                  <button onClick={handleSalvarFoto} className="w-full bg-amber-500 text-zinc-950 font-black py-3 rounded-xl uppercase text-xs">Postar no Portfólio</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {portfolio.map(item => (
                  <div key={item.id} className="group relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
                    <img src={item.urlImagem} alt={item.legenda} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                      <p className="text-[10px] font-bold mb-2">{item.legenda}</p>
                      <button onClick={() => handleDeletarFoto(item.id)} className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-lg uppercase font-bold">Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DashboardAdmin;