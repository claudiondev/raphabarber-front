import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Adicionado para animações
import api from '../api';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/registrar', { nome, email, senha });
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message;
      setErro(msg || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">

      {/* Logo / Marca com Link para Home */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <Link to="/" className="inline-block group cursor-pointer">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-amber-500 text-3xl transition-transform group-hover:scale-120 group-hover:rotate-12">✂</span>
            <h1 className="text-white text-2xl font-black tracking-widest uppercase">
              Rapha<span className="text-amber-500">Barber</span>
            </h1>
          </div>
        </Link>
        <p className="text-zinc-500 text-xs tracking-[0.25em] uppercase">
          Campina Grande · PB
        </p>
      </motion.div>

      {/* Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >

        <div className="mb-7">
          <h2 className="text-zinc-100 text-xl font-bold mb-1">Crie sua conta</h2>
          <p className="text-zinc-500 text-sm">Rápido e gratuito para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Nome completo
            </label>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
              required
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Senha
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
              required
            />
          </div>

          {/* Confirmar Senha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
              Confirmar senha
            </label>
            <input
              type="password"
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
              required
            />
          </div>

          {/* Erro */}
          {erro && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
            >
              <p className="text-red-400 text-xs text-center font-medium">{erro}</p>
            </motion.div>
          )}

          {/* Botão */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 font-black text-sm rounded-xl py-3.5 transition-all uppercase tracking-wider mt-2 shadow-lg shadow-amber-500/20"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </motion.button>

        </form>

        {/* Rodapé do card */}
        <div className="mt-6 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-amber-500 font-bold hover:text-amber-400 transition-colors"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Voltar para home */}
      <motion.div
        whileHover={{ x: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          to="/"
          className="mt-6 block text-zinc-600 hover:text-zinc-400 text-xs transition-colors uppercase tracking-wider"
        >
          ← Voltar ao início
        </Link>
      </motion.div>
    </div>
  );
}

export default Cadastro;