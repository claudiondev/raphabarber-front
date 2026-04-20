import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importado o Link
import { motion, AnimatePresence } from 'framer-motion'; // Adicionado para animações
import api from '../api';

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

// Pega o ID do usuário logado salvo no localStorage
function getUsuarioId() {
  return localStorage.getItem('usuarioId');
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

  // Data mínima = hoje
  const hoje = new Date().toISOString().split('T')[0];

  // Buscar serviços ao montar
  useEffect(() => {
    api.get('/servicos')
      .then((res) => setServicos(res.data))
      .catch(() => setErro('Erro ao carregar serviços.'));
  }, []);

  // Buscar horários ocupados quando data mudar
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

  // Função para sair da conta
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

  // Tela de sucesso
  if (sucesso) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="text-6xl mb-6">✂️</div>
        <h2 className="text-white text-2xl font-black mb-2">Horário Confirmado!</h2>
        <p className="text-zinc-400 text-sm mb-2">
          <span className="text-amber-500 font-bold">{servicoSelecionado?.nome}</span>
        </p>
        <p className="text-zinc-400 text-sm mb-8">
          {dataSelecionada} às {horarioSelecionado}
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/meus-agendamentos')} 
          className="bg-amber-500 text-zinc-950 font-bold py-3 px-6 rounded-xl w-full max-w-xs mb-4"
        >
          Ver Meus Agendamentos
        </motion.button>
        <button onClick={() => navigate('/')} className="text-zinc-500 hover:text-zinc-200 transition-colors">
          Voltar ao Início
        </button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 pb-12">

      {/* Botão de Sair (Logout) */}
      <div className="max-w-lg mx-auto flex justify-end mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all"
        >
          Sair da Conta
        </motion.button>
      </div>

      {/* Header com Link para Home */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto pt-4 mb-8 text-center"
      >
        <Link to="/" className="inline-block group cursor-pointer">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-amber-500 text-2xl transition-transform group-hover:scale-120 group-hover:rotate-12">✂</span>
            <h1 className="text-white text-xl font-black tracking-widest uppercase">
              Rapha<span className="text-amber-500">Barber</span>
            </h1>
          </div>
        </Link>
        <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase">Agende seu horário</p>
      </motion.div>

      <div className="max-w-lg mx-auto space-y-6">

        {/* PASSO 1 — Serviço */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        >
          <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">
            01 — Escolha o Serviço
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {servicos.length === 0 && (
              <p className="text-zinc-600 text-sm text-center py-4">Carregando serviços...</p>
            )}
            {servicos.map((s) => (
              <motion.button
                key={s.id}
                whileHover={{ x: 5 }}
                onClick={() => setServicoSelecionado(s)}
                className={`flex justify-between items-center px-4 py-3.5 rounded-xl border transition-all text-left
                  ${servicoSelecionado?.id === s.id
                    ? 'bg-amber-500 border-amber-500 text-zinc-950'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-amber-500/50'
                  }`}
              >
                <span className="font-semibold text-sm">{s.nome}</span>
                <span className={`font-black text-sm ${servicoSelecionado?.id === s.id ? 'text-zinc-950' : 'text-amber-500'}`}>
                  R$ {Number(s.preco).toFixed(2)}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* PASSO 2 — Data */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
        >
          <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">
            02 — Escolha a Data
          </h2>
          <input
            type="date"
            min={hoje}
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors"
          />
        </motion.section>

        {/* PASSO 3 — Horário (TimePicker) */}
        <AnimatePresence>
          {dataSelecionada && (
            <motion.section 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-hidden"
            >
              <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">
                03 — Escolha o Horário
              </h2>
              {loadingHorarios ? (
                <p className="text-zinc-600 text-sm text-center py-4 animate-pulse">
                  Verificando disponibilidade...
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {HORARIOS.map((h) => {
                    const ocupado = horariosOcupados.includes(h);
                    const selecionado = horarioSelecionado === h;

                    return (
                      <motion.button
                        key={h}
                        whileHover={!ocupado ? { scale: 1.05 } : {}}
                        whileTap={!ocupado ? { scale: 0.95 } : {}}
                        disabled={ocupado}
                        onClick={() => setHorarioSelecionado(h)}
                        className={`py-3 rounded-xl text-sm font-bold transition-all
                          ${ocupado
                            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed line-through'
                            : selecionado
                              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/30'
                              : 'bg-zinc-800 text-zinc-300 hover:border hover:border-amber-500/50'
                          }`}
                      >
                        {h}
                      </motion.button>
                    );
                  })}
                </div>
              )}
              <p className="text-zinc-600 text-xs mt-4 text-center">
                Horários riscados já estão ocupados
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Erro */}
        {erro && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
          >
            <p className="text-red-400 text-xs text-center font-medium">{erro}</p>
          </motion.div>
        )}

        {/* Resumo + Botão */}
        <AnimatePresence>
          {servicoSelecionado && dataSelecionada && horarioSelecionado && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-amber-500/20 rounded-2xl p-6"
            >
              <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">
                Resumo do Agendamento
              </h2>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Serviço</span>
                  <span className="text-zinc-100 font-semibold">{servicoSelecionado.nome}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Data</span>
                  <span className="text-zinc-100 font-semibold">{dataSelecionada}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Horário</span>
                  <span className="text-zinc-100 font-semibold">{horarioSelecionado}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-zinc-800">
                  <span className="text-zinc-500">Valor</span>
                  <span className="text-amber-500 font-black">R$ {Number(servicoSelecionado.preco).toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirmar}
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 font-black text-sm rounded-xl py-3.5 transition-all uppercase tracking-wider shadow-lg shadow-amber-500/20"
              >
                {loading ? 'Confirmando...' : 'Confirmar Agendamento'}
              </motion.button>
            </motion.section>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default Agendamento;