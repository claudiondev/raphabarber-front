import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importado o Link para o redirecionamento
import { motion, AnimatePresence } from 'framer-motion'; // Adicionado para animações
import api from '../api';

const STATUS_STYLES = {
  AGENDADO: { label: 'Agendado', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  CONFIRMADO: { label: 'Confirmado', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  CONCLUIDO: { label: 'Concluído', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  CANCELADO: { label: 'Cancelado', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

function formatarData(dataHora) {
  const d = new Date(dataHora);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatarHora(dataHora) {
  const d = new Date(dataHora);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
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

  // Função para sair da conta
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* HEADER */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          
          {/* Logo / Marca com Link para Home e efeito de Hover */}
          <Link to="/" className="group flex items-center gap-2 cursor-pointer">
            <span className="text-amber-500 text-xl font-black transition-transform group-hover:scale-120 group-hover:rotate-12">RB</span>
            <div>
              <p className="text-white text-sm font-black tracking-widest uppercase">
                Rapha<span className="text-amber-500">Barber</span>
              </p>
              <p className="text-zinc-500 text-xs">Meus Agendamentos</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-zinc-500 hover:text-zinc-300 text-xs uppercase tracking-wider transition-colors"
            >
              ← Início
            </button>
            {/* Botão de Sair adicionado conforme solicitado */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all"
            >
              Sair
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Botão novo agendamento */}
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/agendamento')}
          className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm rounded-2xl py-4 transition-all uppercase tracking-wider shadow-lg shadow-amber-500/20 mb-8"
        >
          ✂ Novo Agendamento
        </motion.button>

        {/* Lista */}
        {loading ? (
          <p className="text-zinc-600 text-sm animate-pulse text-center py-12">Carregando seus agendamentos...</p>
        ) : agendamentos.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center"
          >
            <span className="text-5xl mb-4 block">✂</span>
            <p className="text-zinc-400 font-bold mb-2">Nenhum agendamento ainda</p>
            <p className="text-zinc-600 text-sm">Que tal marcar seu primeiro horário?</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {agendamentos.map((a, index) => {
                const status = STATUS_STYLES[a.status] || STATUS_STYLES.AGENDADO;
                const podeCancel = a.status === 'AGENDADO' || a.status === 'CONFIRMADO';

                return (
                  <motion.div 
                    key={a.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-bold text-base">
                          {a.servico?.nome || 'Serviço'}
                        </p>
                        <p className="text-zinc-400 text-sm mt-0.5">
                          {formatarData(a.dataHora)} às{' '}
                          <span className="text-amber-500 font-bold">{formatarHora(a.dataHora)}</span>
                        </p>
                        {a.servico?.preco && (
                          <p className="text-zinc-500 text-xs mt-1">
                            R$ {Number(a.servico.preco).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {podeCancel && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleCancelar(a.id)}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl py-2 text-xs font-bold uppercase tracking-wider transition-all mt-2"
                      >
                        Cancelar Agendamento
                      </motion.button>
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