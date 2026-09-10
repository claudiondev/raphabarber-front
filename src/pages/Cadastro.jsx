import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Monogram, Wordmark } from '../components/Brand';

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
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <Monogram className="text-3xl text-brass-soft group-hover:text-brass transition-colors" />
          <Wordmark className="text-bone text-sm" />
        </Link>
        <p className="text-silver/70 text-[11px] font-condensed tracking-[0.25em] uppercase mt-2">
          Campina Grande · PB
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-sm bg-ink-soft border border-line p-8"
      >
        <div className="mb-7">
          <h1 className="font-serif text-2xl text-bone mb-1">Crie sua conta</h1>
          <p className="text-silver text-sm">Rápido e gratuito para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-silver text-[11px] font-condensed font-medium uppercase tracking-[0.16em]">
              Nome completo
            </label>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-ink border border-line text-bone text-sm px-4 py-3 outline-none focus:border-brass transition-colors placeholder:text-silver/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-silver text-[11px] font-condensed font-medium uppercase tracking-[0.16em]">
              E-mail
            </label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-ink border border-line text-bone text-sm px-4 py-3 outline-none focus:border-brass transition-colors placeholder:text-silver/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-silver text-[11px] font-condensed font-medium uppercase tracking-[0.16em]">
              Senha
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="bg-ink border border-line text-bone text-sm px-4 py-3 outline-none focus:border-brass transition-colors placeholder:text-silver/40"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-silver text-[11px] font-condensed font-medium uppercase tracking-[0.16em]">
              Confirmar senha
            </label>
            <input
              type="password"
              placeholder="Repita a senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="bg-ink border border-line text-bone text-sm px-4 py-3 outline-none focus:border-brass transition-colors placeholder:text-silver/40"
              required
            />
          </div>

          {erro && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[#C97D6F] text-xs text-center border border-[#C97D6F]/25 bg-[#C97D6F]/10 px-4 py-3"
            >
              {erro}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass hover:bg-brass-deep disabled:opacity-50 disabled:cursor-not-allowed text-ink font-condensed font-semibold text-[13px] py-3.5 uppercase tracking-[0.2em] transition-colors mt-2"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-line text-center">
          <p className="text-silver text-sm">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-brass-soft font-medium hover:text-brass transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </motion.div>

      <Link
        to="/"
        className="mt-6 text-silver/60 hover:text-silver text-[11px] font-condensed uppercase tracking-[0.18em] transition-colors"
      >
        ← Voltar ao início
      </Link>
    </div>
  );
}

export default Cadastro;
