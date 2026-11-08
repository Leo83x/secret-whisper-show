import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import {
  ShieldCheck,
  Mail,
  User,
  X,
  CheckCircle2,
  LogOut,
  BookOpen,
  UserPlus,
  LogIn,
} from 'lucide-react';

export const ReaderAccessModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    readerStatus,
    state,
    loginWithEmailOrToken,
    logoutReader,
  } = useInvestigation();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    const res = await loginWithEmailOrToken(identifier);
    setLoading(false);
    if (!res.success) {
      setError(
        res.message ||
          'E-mail ainda não localizado. Se você é novo por aqui, clique na aba "Criar Credencial Gratuita" acima!'
      );
    } else {
      setSuccessMsg('Credencial autenticada e sincronizada com o banco de dados!');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!newName.trim() || !newEmail.trim() || !newEmail.includes('@')) {
      setError('Preencha seu nome e um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim().toLowerCase(),
        }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setError(data.error || 'Não foi possível criar a credencial agora.');
        setLoading(false);
        return;
      }

      // Autentica imediatamente usando o e-mail ou token recém-criado
      const tokenOrEmail = data.access_token || newEmail.trim().toLowerCase();
      await loginWithEmailOrToken(tokenOrEmail);
      setLoading(false);
      setSuccessMsg('Credencial criada e sincronizada com sucesso!');
    } catch {
      setLoading(false);
      setError('Erro de conexão ao registrar credencial.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in font-sans">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0B1320] border border-amber-500/40 p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-5">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#060A12] border border-amber-400/60 flex items-center justify-center shrink-0">
            <img
              src="/reader/icons/icon-192.png"
              alt="O Último Segredo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-sans text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
              Credencial de Investigador
            </h3>
            <p className="text-xs sm:text-sm text-cyan-400 font-mono">
              Acesso Unificado: E-Reader + Central 3D
            </p>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Credencial Sincronizada na Nuvem</span>
              </div>
              <div className="text-sm text-white font-sans">
                Investigador: <strong>{state.investigator.name}</strong>
              </div>
              <div className="text-xs text-slate-300 font-mono">
                Status:{' '}
                {readerStatus === 'paid'
                  ? 'EDIÇÃO ESPECIAL COMPLETA (PAGO)'
                  : 'CREDENTIAL ATIVA (DEGUSTAÇÃO)'}
              </div>
            </div>

            <a
              href="/reader/"
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 text-amber-300 font-mono text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Abrir E-Reader do Livro (Mesma Conta)</span>
            </a>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                onClick={logoutReader}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-red-950/50 text-slate-300 hover:text-red-300 border border-slate-700 text-xs sm:text-sm font-mono flex items-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" /> Desconectar
              </button>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-sans font-bold text-sm cursor-pointer transition-colors"
              >
                Continuar Investigação
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Abas: Entrar vs Criar Credencial Gratuita */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#060A12] border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  mode === 'login'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Já sou Leitor</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  mode === 'register'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Criar Credencial</span>
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Digite o <strong>e-mail usado na compra ou cadastro</strong> do livro para sincronizar seu progresso no Supabase sem precisar de senha:
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-amber-300 uppercase tracking-wider block">
                    E-mail de Leitor ou Token:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-sans focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-300">
                    {error}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-emerald-300">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Sincronizando...' : 'Sincronizar Credencial'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Crie sua <strong>Credencial Gratuita</strong> em segundos para salvar seu progresso na nuvem e acessar também o Capítulo 1 no E-Reader:
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-mono text-amber-300 uppercase tracking-wider block mb-1">
                      Seu Nome ou Codinome:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="Ex: Leonardo"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-sans focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono text-amber-300 uppercase tracking-wider block mb-1">
                      Seu Melhor E-mail:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={newEmail}
                        onChange={e => setNewEmail(e.target.value)}
                        placeholder="seuemail@exemplo.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-sans focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-sans font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Gerando Credencial...' : 'Ativar Credencial Gratuita'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
