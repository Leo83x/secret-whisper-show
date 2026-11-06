import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { ShieldCheck, Lock, Mail, X, CheckCircle2, LogOut, Sparkles, ArrowRight } from 'lucide-react';

export const ReaderAccessModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    readerStatus,
    state,
    loginWithEmailOrToken,
    logoutReader
  } = useInvestigation();

  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    const res = await loginWithEmailOrToken(identifier);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Credencial não localizada.');
    } else {
      setSuccessMsg('Credencial autenticada e sincronizada com sucesso!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0B1320] border border-amber-500/40 p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-5">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
              Credencial de Investigador
            </h3>
            <p className="text-xs sm:text-sm text-cyan-400 font-mono">
              Sincronização com o Compêndio Oficial
            </p>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Conta Vinculada Ativa</span>
              </div>
              <div className="text-sm text-white font-sans">
                Investigador: <strong>{state.investigator.name}</strong>
              </div>
              <div className="text-xs text-slate-300 font-mono">
                Status: {readerStatus === 'paid' ? 'EDIÇÃO ESPECIAL COMPLETA (PAGO)' : 'ACESSO EM DEGUSTAÇÃO'}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Informe o <strong>e-mail utilizado na compra ou cadastro</strong> do livro para sincronizar suas hipóteses no banco de dados em qualquer dispositivo:
            </p>

            <div className="space-y-2">
              <label className="text-xs font-mono text-amber-300 uppercase tracking-wider block">
                E-mail de Leitor ou Código de Acesso:
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
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-300 font-sans">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-emerald-300 font-sans">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-sans font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              <span>{loading ? 'Verificando no Banco...' : 'Vincular Conta de Leitor'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 border-t border-white/10 text-center">
              <a
                href="/#checkout"
                className="text-xs font-mono text-amber-400 hover:text-amber-300 underline"
              >
                Ainda não possui a Edição Especial? Desbloqueie aqui
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
