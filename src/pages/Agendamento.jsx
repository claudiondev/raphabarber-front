import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import api from '../api';
import { Monogram, Wordmark } from '../components/Brand';

// Horários fixos disponíveis na barbearia
const HORARIOS = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00',
];

// Formata data para o back-end: "2026-04-20T14:00:00"
function formatarDataHora(data, horario) {
  return `${data}T${horario}:00`;
}

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Pega o ID do usuário logado salvo no localStorage
function getUsuarioId() {
  return localStorage.getItem('usuarioId');
}

function StepLabel({ children }) {
  return (
    <h2 className="text-silver text-[11px] font-condensed font-medium uppercase tracking-[0.2em] mb-4">
      {children}
    </h2>
  );
}

function Agendamento() {
  const [servicos, setServicos] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');
  const [horariosOcupados, setHorariosOcupados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const hoje = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get('/servicos')
      .then((res) => setServicos(res.data))
      .catch(() => setErro('Erro ao carregar serviços.'));
  }, []);

  useEffect(() => {
    if (!dataSelecionada) return;
    setHorarioSelecionado('');
    setLoadingHorarios(true);

    api.get(`/agendamentos/dia?data=${dataSelecionada}`)
      .then((res) => {
        const ocupados = res.data.map((a) => {
          const hora = new Date(a.dataHora);
          return `${String(hora.getHours()).padStart(2, '0')}:${String(hora.getMinutes()).padStart(2, '0')}`;
        });
        setHorariosOcupados(ocupados);
      })
      .catch(() => setHorariosOcupados([]))
      .finally(() => setLoadingHorarios(false));
  }, [dataSelecionada]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    navigate('/login');
  };

  const handleConfirmar = async () => {
    if (!servicoSelecionado || !dataSelecionada || !horarioSelecionado) {
      setErro('Selecione o serviço, a data e o horário.');
      return;
    }

    setErro('');
    setLoading(true);

    const usuarioId = getUsuarioId();

    try {
      await api.post('/agendamentos', {
        cliente: { id: usuarioId },
        servico: { id: servicoSelecionado.id },
        dataHora: formatarDataHora(dataSelecionada, horarioSelecionado),
      });
      setSucesso(true);
    } catch (error) {
      const msg = error.response?.data;
      setErro(typeof msg === 'string' ? msg : 'Erro ao agendar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (sucesso) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-ink flex flex-col items-center justify-center p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.1 }}
          className="w-14 h-14 border border-brass/50 flex items-center justify-center mb-6"
        >
          <Check className="text-brass-soft" size={26} />
        </motion.div>
        <h1 className="font-serif text-2xl text-bone mb-3">Horário confirmado.</h1>
        <p className="text-silver text-sm mb-1">
          <span className="text-brass-soft font-medium">{servicoSelecionado?.nome}</span>
        </p>
        <p className="text-silver text-sm mb-10">
          {dataSelecionada} às {horarioSelecionado}
        </p>
        <button
          onClick={() => navigate('/meus-agendamentos')}
          className="bg-brass hover:bg-brass-deep text-ink font-condensed font-semibold text-[13px] py-3.5 w-full max-w-xs mb-4 uppercase tracking-[0.2em] transition-colors"
        >
          Ver meus agendamentos
        </button>
        <button onClick={() => navigate('/')} className="text-silver hover:text-bone text-sm transition-colors">
          Voltar ao início
        </button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-ink p-4 pb-12">
      <div className="max-w-lg mx-auto flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="border border-[#C97D6F]/30 text-[#C97D6F] text-[10px] font-condensed font-medium uppercase tracking-[0.18em] px-4 py-2 hover:bg-[#C97D6F] hover:text-ink transition-colors"
        >
          Sair da conta
        </button>
      </div>

      <div className="max-w-lg mx-auto pt-4 mb-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <Monogram className="text-2xl text-brass-soft group-hover:text-brass transition-colors" />
          <Wordmark className="text-bone text-xs" />
        </Link>
        <p className="text-silver/70 text-[11px] font-condensed tracking-[0.2em] uppercase mt-2">Agende seu horário</p>
      </div>

      <div className="max-w-lg mx-auto space-y-5">
        {/* PASSO 1 — Serviço */}
        <section className="bg-ink-soft border border-line p-6">
          <StepLabel>01 — Escolha o serviço</StepLabel>
          <div className="grid grid-cols-1 gap-2.5">
            {servicos.length === 0 && (
              <p className="text-silver/60 text-sm text-center py-4">Carregando serviços...</p>
            )}
            {servicos.map((s) => (
              <button
                key={s.id}
                onClick={() => setServicoSelecionado(s)}
                className={`flex justify-between items-center px-4 py-3.5 border text-left transition-colors
                  ${servicoSelecionado?.id === s.id
                    ? 'bg-brass border-brass text-ink'
                    : 'bg-ink border-line text-bone hover:border-brass/40'
                  }`}
              >
                <span className="font-medium text-sm">{s.nome}</span>
                <span className={`font-condensed font-medium text-sm ${servicoSelecionado?.id === s.id ? 'text-ink' : 'text-brass-soft'}`}>
                  R$ {formatarPreco(s.preco)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* PASSO 2 — Data */}
        <section className="bg-ink-soft border border-line p-6">
          <StepLabel>02 — Escolha a data</StepLabel>
          <input
            type="date"
            min={hoje}
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className="w-full bg-ink border border-line text-bone text-sm px-4 py-3 outline-none focus:border-brass transition-colors"
          />
        </section>

        {/* PASSO 3 — Horário */}
        <AnimatePresence>
          {dataSelecionada && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-ink-soft border border-line p-6 overflow-hidden"
            >
              <StepLabel>03 — Escolha o horário</StepLabel>
              {loadingHorarios ? (
                <p className="text-silver/60 text-sm text-center py-4">Verificando disponibilidade...</p>
              ) : (
                <div className="grid grid-cols-3 gap-2.5">
                  {HORARIOS.map((h) => {
                    const ocupado = horariosOcupados.includes(h);
                    const selecionado = horarioSelecionado === h;

                    return (
                      <button
                        key={h}
                        disabled={ocupado}
                        onClick={() => setHorarioSelecionado(h)}
                        className={`py-3 text-sm font-condensed font-medium border transition-colors
                          ${ocupado
                            ? 'border-line text-silver/30 cursor-not-allowed line-through'
                            : selecionado
                              ? 'bg-brass border-brass text-ink'
                              : 'border-line text-silver hover:border-brass/40 hover:text-bone'
                          }`}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              )}
              <p className="text-silver/50 text-[11px] font-condensed uppercase tracking-wider mt-4 text-center">
                Horários riscados já estão ocupados
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        {erro && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#C97D6F] text-xs text-center border border-[#C97D6F]/25 bg-[#C97D6F]/10 px-4 py-3"
          >
            {erro}
          </motion.p>
        )}

        {/* Resumo + confirmação */}
        <AnimatePresence>
          {servicoSelecionado && dataSelecionada && horarioSelecionado && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-ink-soft border border-brass/30 p-6"
            >
              <StepLabel>Resumo do agendamento</StepLabel>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-silver">Serviço</span>
                  <span className="text-bone font-medium">{servicoSelecionado.nome}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-silver">Data</span>
                  <span className="text-bone font-medium">{dataSelecionada}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-silver">Horário</span>
                  <span className="text-bone font-medium">{horarioSelecionado}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-line">
                  <span className="text-silver">Valor</span>
                  <span className="text-brass-soft font-condensed font-medium">R$ {formatarPreco(servicoSelecionado.preco)}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmar}
                disabled={loading}
                className="w-full bg-brass hover:bg-brass-deep disabled:opacity-50 disabled:cursor-not-allowed text-ink font-condensed font-semibold text-[13px] py-3.5 uppercase tracking-[0.2em] transition-colors"
              >
                {loading ? 'Confirmando...' : 'Confirmar agendamento'}
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Agendamento;
