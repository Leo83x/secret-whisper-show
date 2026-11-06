import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { TabKey } from '../../types/investigation';
import { Globe, FolderOpen, Target, Users, User, ShieldCheck, KeyRound } from 'lucide-react';

export const InvestigationHeader: React.FC = () => {
  const { state, setActiveTab, isAuthenticated, setIsAuthModalOpen } = useInvestigation();

  const navItems: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'mapa', label: 'MAPA MUNDIAL', icon: Globe },
    { key: 'dossies', label: 'DOSSIÊS', icon: FolderOpen },
    { key: 'missoes', label: 'MISSÕES', icon: Target },
    { key: 'comunidade', label: 'COMUNIDADE', icon: Users },
    { key: 'perfil', label: 'PERFIL', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060A12]/95 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Lado Esquerdo: Marca & Brasão Φ (Responsivo sem estourar no Mobile) */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-amber-400/50 bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] shrink-0">
            <span className="font-serif text-lg sm:text-xl font-bold text-amber-400 select-none">Φ</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-xs sm:text-base tracking-[0.12em] sm:tracking-[0.18em] uppercase font-bold text-slate-100 truncate">
              O ÚLTIMO SEGREDO DA HUMANIDADE
            </h1>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <span className="font-mono text-[11px] sm:text-xs text-cyan-400 tracking-wide uppercase font-medium truncate">
                Central de Investigação <span className="hidden sm:inline">// Acesso Restrito</span>
              </span>
            </div>
          </div>
        </div>

        {/* Centro (Apenas Desktop): Abas de Navegação com Fonte Ampliada */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`relative px-3.5 py-2 rounded-lg text-xs lg:text-sm font-mono tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'text-amber-300 bg-amber-500/10 shadow-[0_0_12px_rgba(212,175,55,0.15)] border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#f59e0b]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Lado Direito: Credencial & Identidade do Investigador */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            title="Vincular e-mail de leitor ou verificar credencial"
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isAuthenticated
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-amber-500/15 border-amber-400/40 text-amber-300 hover:bg-amber-500/25'
            }`}
          >
            {isAuthenticated ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline">Sincronizado</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>Entrar</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full bg-[#0B1320] border border-amber-500/30 hover:border-amber-400/60 transition-colors text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/40 to-slate-900 border border-amber-400/60 flex items-center justify-center text-amber-300 font-bold text-xs shadow-sm">
              74
            </div>
            <div className="hidden xl:block leading-tight">
              <div className="text-xs font-sans font-bold text-slate-200 group-hover:text-amber-300 transition-colors">
                {state.investigator.name}
              </div>
              <div className="text-[11px] font-mono text-cyan-400">
                Nível {state.investigator.level}
              </div>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
