import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarX } from 'lucide-react';
import api from '../api';
import { Monogram, Wordmark } from '../components/Brand';

const STATUS_STYLES = {
  AGENDADO: { label: 'Agendado', color: 'text-brass-soft border-brass/30' },
  CONFIRMADO: { label: 'Confirmado', color: 'text-bone border-line' },
  CONCLUIDO: { label: 'Concluído', color: 'text-[#8FA687] border-[#8FA687]/30' },
  CANCELADO: { label: 'Cancelado', color: 'text-[#C97D6F] border-[#C97D6F]/30' },
};

function formatarData(dataHora) {
  const d = new Date(dataHora);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatarHora(dataHora) {
  const d = new Date(dataHora);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/agendamentos')
      .then((res) => setAgendamentos(res.data))
      .catch(() => setAgendamentos([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    navigate('/login');
  };

  const handleCancelar = async (id) => {
    if (!window.confirm('Deseja cancelar este agendamento?')) return;
    try {
      await api.delete(`/agendamentos/${id}`);
      setAgendamentos((prev) =>
        prev.map((a) => a.id === id ? { ...a, status: 'CANCELADO' } : a)
      );
    } catch {
      alert('Erro ao cancelar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone">
      <header className="bg-ink-soft border-b border-line px-4 py-3.5">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Link to="/" className="group flex items-center gap-2.5">
            <Monogram className="text-xl text-brass-soft group-hover:text-brass transition-colors" />
            <div>
              <Wordmark className="text-bone text-xs" />
              <p className="text-silver/70 text-[11px]">Meus agendamentos</p>
            </div>
          </Link>

          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('/')}
              className="text-silver hover:text-bone text-[11px] font-condensed uppercase tracking-[0.18em] transition-colors"
            >
              ← Início
            </button>
            <button
              onClick={handleLogout}
              className="border border-[#C97D6F]/30 text-[#C97D6F] text-[10px] font-condensed font-medium uppercase tracking-[0.18em] px-3 py-1.5 hover:bg-[#C97D6F] hover:text-ink transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <button
          onClick={() => navigate('/agendamento')}
          className="w-full bg-brass hover:bg-brass-deep text-ink font-condensed font-semibold text-[13px] py-4 uppercase tracking-[0.2em] transition-colors mb-10"
        >
          Novo agendamento
        </button>

        {loading ? (
          <p className="text-silver/60 text-sm text-center py-12">Carregando seus agendamentos...</p>
        ) : agendamentos.length === 0 ? (
          <div className="border border-line p-14 text-center">
            <CalendarX className="mx-auto mb-4 text-silver/50" size={32} />
            <p className="text-bone font-medium mb-2">Nenhum agendamento ainda</p>
            <p className="text-silver text-sm">Que tal marcar seu primeiro horário?</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {agendamentos.map((a, index) => {
                const status = STATUS_STYLES[a.status] || STATUS_STYLES.AGENDADO;
                const podeCancel = a.status === 'AGENDADO' || a.status === 'CONFIRMADO';

                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-ink-soft border border-line p-5"
                  >
                    <div className="flex justify-between items-start mb-3 gap-3">
                      <div>
                        <p className="font-serif text-lg text-bone">
                          {a.servico?.nome || 'Serviço'}
                        </p>
                        <p className="text-silver text-sm mt-0.5">
                          {formatarData(a.dataHora)} às{' '}
                          <span className="text-brass-soft font-medium">{formatarHora(a.dataHora)}</span>
                        </p>
                        {a.servico?.preco && (
                          <p className="text-silver/60 text-xs mt-1">
                            R$ {formatarPreco(a.servico.preco)}
                          </p>
                        )}
                      </div>
                      <span className={`text-[10px] font-condensed font-medium uppercase tracking-wider px-2.5 py-1 border whitespace-nowrap ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {podeCancel && (
                      <button
                        onClick={() => handleCancelar(a.id)}
                        className="w-full border border-[#C97D6F]/25 text-[#C97D6F] hover:bg-[#C97D6F]/10 py-2 text-[11px] font-condensed font-medium uppercase tracking-[0.16em] transition-colors mt-3"
                      >
                        Cancelar agendamento
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default MeusAgendamentos;
