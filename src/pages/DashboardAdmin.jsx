import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Scissors, Image as ImageIcon, Check, X as XIcon, Trash2 } from 'lucide-react';
import api from '../api';
import { Monogram, Wordmark } from '../components/Brand';

const STATUS_STYLES = {
  AGENDADO: { label: 'Agendado', color: 'text-brass-soft border-brass/30' },
  CONFIRMADO: { label: 'Confirmado', color: 'text-bone border-line' },
  CONCLUIDO: { label: 'Concluído', color: 'text-[#8FA687] border-[#8FA687]/30' },
  CANCELADO: { label: 'Cancelado', color: 'text-[#C97D6F] border-[#C97D6F]/30' },
};

const ABAS = [
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'servicos', label: 'Serviços', icon: Scissors },
  { id: 'portfolio', label: 'Portfólio', icon: ImageIcon },
];

function DashboardAdmin() {
  const [aba, setAba] = useState('agenda');
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);

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

  const buscarAgendamentos = async () => {
    try {
      const response = await api.get(`/agendamentos/dia?data=${dataSelecionada}`);
      setAgendamentos(response.data);
    } catch { setAgendamentos([]); }
  };

  const buscarServicos = async () => {
    try {
      const response = await api.get('/servicos');
      setServicos(response.data);
    } catch { setServicos([]); }
  };

  const buscarPortfolio = async () => {
    try {
      const response = await api.get('/portfolio');
      setPortfolio(response.data);
    } catch { setPortfolio([]); }
  };

  useEffect(() => {
    if (aba === 'agenda') buscarAgendamentos();
    if (aba === 'servicos') buscarServicos();
    if (aba === 'portfolio') buscarPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aba, dataSelecionada]);

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

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/agendamentos/${id}`, { status: novoStatus });
      setMensagem({ texto: `Agendamento marcado como ${novoStatus.toLowerCase()}.`, tipo: 'sucesso' });
      await buscarAgendamentos();
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    } catch (error) {
      console.error('Erro na API:', error);
      setMensagem({ texto: 'Erro ao atualizar status.', tipo: 'erro' });
      setTimeout(() => setMensagem({ texto: '', tipo: '' }), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone">
      <header className="bg-ink-soft border-b border-line px-4 py-3.5">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Monogram className="text-xl text-brass-soft group-hover:text-brass transition-colors" />
            <Wordmark className="text-bone text-xs" />
          </Link>
          <button
            onClick={handleLogout}
            className="border border-[#C97D6F]/30 text-[#C97D6F] text-[10px] font-condensed font-medium uppercase tracking-[0.18em] px-3 py-1.5 hover:bg-[#C97D6F] hover:text-ink transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="flex gap-2 mb-8 border-b border-line overflow-x-auto">
          {ABAS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              className={`flex items-center gap-2 px-5 py-3 text-[11px] font-condensed font-medium uppercase tracking-[0.16em] whitespace-nowrap border-b-2 -mb-px transition-colors
                ${aba === id ? 'border-brass text-brass-soft' : 'border-transparent text-silver hover:text-bone'}`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ABA AGENDA */}
          {aba === 'agenda' && (
            <motion.div key="agenda" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <input
                  type="date"
                  value={dataSelecionada}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                  style={{ colorScheme: 'dark' }}
                  className="bg-ink-soft border border-line px-4 py-2.5 text-sm text-bone outline-none focus:border-brass transition-colors"
                />

                {mensagem.texto && aba === 'agenda' && (
                  <motion.p
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-xs font-condensed font-medium px-4 py-2 border ${mensagem.tipo === 'erro' ? 'border-[#C97D6F]/30 text-[#C97D6F]' : 'border-[#8FA687]/30 text-[#8FA687]'}`}
                  >
                    {mensagem.texto}
                  </motion.p>
                )}
              </div>

              <div className="space-y-3">
                {agendamentos.length === 0 ? (
                  <p className="text-silver/60 text-sm text-center py-12">Nenhum agendamento para este dia.</p>
                ) : (
                  agendamentos.map((a) => {
                    const status = STATUS_STYLES[a.status] || STATUS_STYLES.AGENDADO;
                    return (
                      <div key={a.id} className="bg-ink-soft border border-line p-5 flex justify-between items-center gap-4">
                        <div>
                          <p className="font-medium text-bone">{a.cliente?.email}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-silver text-sm">
                              {a.servico?.nome} ·{' '}
                              <span className="text-brass-soft font-medium">
                                {new Date(a.dataHora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </p>
                            <span className={`text-[10px] font-condensed uppercase font-medium px-2 py-0.5 border ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                        </div>
                        {a.status !== 'CONCLUIDO' && (
                          <div className="flex gap-2 flex-shrink-0">
                            <button
                              onClick={() => atualizarStatus(a.id, 'CONCLUIDO')}
                              className="p-2 border border-[#8FA687]/30 text-[#8FA687] hover:bg-[#8FA687] hover:text-ink transition-colors"
                              aria-label="Marcar como concluído"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => atualizarStatus(a.id, 'CANCELADO')}
                              className="p-2 border border-[#C97D6F]/30 text-[#C97D6F] hover:bg-[#C97D6F] hover:text-ink transition-colors"
                              aria-label="Cancelar agendamento"
                            >
                              <XIcon size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {/* ABA SERVIÇOS */}
          {aba === 'servicos' && (
            <motion.div key="servicos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-ink-soft border border-line p-6 h-fit">
                <h3 className="text-brass-soft text-[11px] font-condensed font-medium uppercase tracking-[0.16em] mb-4">
                  {editandoId ? 'Editar serviço' : 'Novo serviço'}
                </h3>
                <input
                  type="text"
                  placeholder="Nome"
                  value={formServico.nome}
                  onChange={(e) => setFormServico({ ...formServico, nome: e.target.value })}
                  className="w-full bg-ink border border-line px-4 py-3 mb-3 text-sm text-bone outline-none focus:border-brass transition-colors placeholder:text-silver/40"
                />
                <div className="flex gap-3 mb-4">
                  <input
                    type="number"
                    placeholder="Preço"
                    value={formServico.preco}
                    onChange={(e) => setFormServico({ ...formServico, preco: e.target.value })}
                    className="w-full bg-ink border border-line px-4 py-3 text-sm text-bone outline-none focus:border-brass transition-colors placeholder:text-silver/40"
                  />
                  <input
                    type="number"
                    placeholder="Minutos"
                    value={formServico.duracaoMinutos}
                    onChange={(e) => setFormServico({ ...formServico, duracaoMinutos: e.target.value })}
                    className="w-full bg-ink border border-line px-4 py-3 text-sm text-bone outline-none focus:border-brass transition-colors placeholder:text-silver/40"
                  />
                </div>
                <button
                  onClick={handleSalvarServico}
                  className="w-full bg-brass hover:bg-brass-deep text-ink font-condensed font-semibold py-3 uppercase text-[12px] tracking-[0.18em] transition-colors"
                >
                  Salvar serviço
                </button>
              </div>
              <div className="space-y-2.5">
                {servicos.length === 0 && (
                  <p className="text-silver/60 text-sm text-center py-8">Nenhum serviço cadastrado.</p>
                )}
                {servicos.map((s) => (
                  <div key={s.id} className="bg-ink-soft border border-line p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-bone text-sm">{s.nome}</p>
                      <p className="text-brass-soft text-sm font-condensed">R$ {Number(s.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <button
                      onClick={() => api.delete(`/servicos/${s.id}`).then(buscarServicos)}
                      className="p-2 text-silver hover:text-[#C97D6F] transition-colors"
                      aria-label={`Excluir ${s.nome}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ABA PORTFÓLIO */}
          {aba === 'portfolio' && (
            <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
              <div className="bg-ink-soft border border-line p-6 h-fit">
                <h3 className="text-brass-soft text-[11px] font-condensed font-medium uppercase tracking-[0.16em] mb-4">
                  Adicionar ao portfólio
                </h3>
                <div className="space-y-3">
                  <p className="text-silver text-xs leading-relaxed border border-line px-3 py-2.5">
                    Suba a imagem no <a href="https://imgbb.com/" target="_blank" rel="noopener noreferrer" className="text-brass-soft underline">ImgBB</a>, copie o link direto e cole abaixo.
                  </p>
                  <input
                    type="text"
                    placeholder="Link da imagem (URL)"
                    value={formPortfolio.urlImagem}
                    onChange={(e) => setFormPortfolio({ ...formPortfolio, urlImagem: e.target.value })}
                    className="w-full bg-ink border border-line px-4 py-3 text-sm text-bone outline-none focus:border-brass transition-colors placeholder:text-silver/40"
                  />
                  <input
                    type="text"
                    placeholder="Legenda (ex: Corte degradê)"
                    value={formPortfolio.legenda}
                    onChange={(e) => setFormPortfolio({ ...formPortfolio, legenda: e.target.value })}
                    className="w-full bg-ink border border-line px-4 py-3 text-sm text-bone outline-none focus:border-brass transition-colors placeholder:text-silver/40"
                  />

                  {mensagem.texto && aba === 'portfolio' && (
                    <p className={`text-xs font-condensed font-medium px-3 py-2.5 border ${mensagem.tipo === 'erro' ? 'border-[#C97D6F]/30 text-[#C97D6F]' : 'border-[#8FA687]/30 text-[#8FA687]'}`}>
                      {mensagem.texto}
                    </p>
                  )}

                  <button
                    onClick={handleSalvarFoto}
                    className="w-full bg-brass hover:bg-brass-deep text-ink font-condensed font-semibold py-3 uppercase text-[12px] tracking-[0.18em] transition-colors"
                  >
                    Postar no portfólio
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {portfolio.length === 0 && (
                  <p className="text-silver/60 text-sm text-center py-8 col-span-full">Ainda sem fotos no portfólio.</p>
                )}
                {portfolio.map((item) => (
                  <div key={item.id} className="group relative aspect-square bg-ink-soft border border-line overflow-hidden">
                    <img src={item.urlImagem} alt={item.legenda} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-ink/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-2 text-center">
                      <p className="text-bone text-[11px] font-condensed uppercase tracking-wider">{item.legenda}</p>
                      <button
                        onClick={() => handleDeletarFoto(item.id)}
                        className="bg-[#C97D6F] text-ink text-[10px] px-3 py-1.5 uppercase font-condensed font-semibold tracking-wider"
                      >
                        Excluir
                      </button>
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
