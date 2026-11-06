import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { TabKey } from '../../types/investigation';
import { soundEngine, AudioAndMotionSettings } from '../../utils/investigationAudio';
import {
  Globe,
  FolderOpen,
  Target,
  Users,
  User,
  ShieldCheck,
  KeyRound,
  Volume2,
  VolumeX,
  Sliders,
} from 'lucide-react';

export const InvestigationHeader: React.FC = () => {
  const { state, setActiveTab, isAuthenticated, setIsAuthModalOpen } = useInvestigation();
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [audioSettings, setAudioSettings] = useState<AudioAndMotionSettings>(() =>
    soundEngine.getSettings()
  );

  const handleUpdateAudio = (partial: Partial<AudioAndMotionSettings>) => {
    const next = soundEngine.updateSettings(partial);
    setAudioSettings(next);
  };

  const navItems: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'mapa', label: 'MAPA MUNDIAL', icon: Globe },
    { key: 'dossies', label: 'DOSSIÊS', icon: FolderOpen },
    { key: 'missoes', label: 'MISSÕES', icon: Target },
    { key: 'comunidade', label: 'COMUNIDADE', icon: Users },
    { key: 'perfil', label: 'PERFIL', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#060A12]/95 backdrop-blur-md border-b border-amber-500/20 px-3 sm:px-6 py-2.5 transition-colors font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Lado Esquerdo: Marca & Brasão Φ (Apenas aqui mantém font-serif nobre) */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-amber-400/50 bg-gradient-to-b from-amber-500/20 to-transparent flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] shrink-0">
            <span className="font-serif text-base sm:text-lg font-bold text-amber-400 select-none">Φ</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-xs sm:text-sm md:text-base tracking-[0.14em] uppercase font-bold text-slate-100 truncate">
              O ÚLTIMO SEGREDO
            </h1>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
              <span className="font-mono text-[9px] sm:text-[10px] text-cyan-400/90 tracking-widest uppercase truncate">
                Central de Investigação <span className="hidden sm:inline">// Acesso Restrito</span>
              </span>
            </div>
          </div>
        </div>

        {/* Centro (Apenas Desktop): Abas de Navegação */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  soundEngine.playDocumentOpen();
                  setActiveTab(item.key);
                }}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'text-amber-300 bg-amber-500/10 shadow-[0_0_12px_rgba(212,175,55,0.15)] border border-amber-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_8px_#f59e0b]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Lado Direito: Controle de Áudio/Animação + Credencial + Perfil */}
        <div className="flex items-center gap-2 shrink-0 relative">
          
          {/* Botão de Som & Acessibilidade */}
          <button
            onClick={() => setAudioMenuOpen(o => !o)}
            title="Controles de Som e Animação"
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all ${
              audioSettings.mutedAll
                ? 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                : 'bg-[#0B1320] border-cyan-500/30 text-cyan-300 hover:border-cyan-400'
            }`}
          >
            {audioSettings.mutedAll ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="hidden xl:inline text-[11px]">Áudio</span>
          </button>

          {/* Popover de Controles de Áudio e Movimento */}
          {audioMenuOpen && (
            <div className="absolute right-0 top-11 w-72 rounded-2xl bg-[#0B1320] border border-amber-500/35 shadow-[0_0_35px_rgba(0,0,0,0.9)] p-4 z-50 space-y-3.5 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" /> Ambiente & Interação
                </span>
                <button
                  onClick={() => setAudioMenuOpen(false)}
                  className="text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              {/* Trilha Ambiente */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">Trilha Ambiente</span>
                  <button
                    onClick={() =>
                      handleUpdateAudio({
                        mutedAll: false,
                        ambientEnabled: !audioSettings.ambientEnabled,
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      audioSettings.ambientEnabled && !audioSettings.mutedAll
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {audioSettings.ambientEnabled && !audioSettings.mutedAll ? 'ATIVA' : 'DESLIGADA'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.ambientVolume}
                  onChange={e =>
                    handleUpdateAudio({
                      ambientVolume: parseFloat(e.target.value),
                      ambientEnabled: true,
                      mutedAll: false,
                    })
                  }
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Efeitos Sonoros (SFX) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">Efeitos de Interação</span>
                  <button
                    onClick={() =>
                      handleUpdateAudio({
                        mutedAll: false,
                        sfxEnabled: !audioSettings.sfxEnabled,
                      })
                    }
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                      audioSettings.sfxEnabled && !audioSettings.mutedAll
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {audioSettings.sfxEnabled && !audioSettings.mutedAll ? 'ATIVOS' : 'DESLIGADOS'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.sfxVolume}
                  onChange={e =>
                    handleUpdateAudio({
                      sfxVolume: parseFloat(e.target.value),
                      sfxEnabled: true,
                      mutedAll: false,
                    })
                  }
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Reduzir Animações */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-300">Reduzir Animações</span>
                <button
                  onClick={() =>
                    handleUpdateAudio({ reduceMotion: !audioSettings.reduceMotion })
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                    audioSettings.reduceMotion
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {audioSettings.reduceMotion ? 'SIM' : 'NÃO'}
                </button>
              </div>

              {/* Botão Silenciar Tudo */}
              <button
                onClick={() => handleUpdateAudio({ mutedAll: !audioSettings.mutedAll })}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
              >
                {audioSettings.mutedAll ? 'Reativar Áudio' : 'Silenciar Tudo'}
              </button>
            </div>
          )}

          {/* Botão Entrar / Sincronizado */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            title="Vincular e-mail de leitor ou verificar credencial"
            className={`px-2.5 py-1 rounded-lg border text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
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
                <KeyRound className="w-3 h-3 text-amber-400" />
                <span>Entrar</span>
              </>
            )}
          </button>

          {/* Badge do Investigador */}
          <button
            onClick={() => setActiveTab('perfil')}
            className="flex items-center gap-2 bg-[#0B1320]/90 hover:bg-[#111C30] border border-amber-500/30 rounded-full py-1 px-2.5 transition-all cursor-pointer shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 flex items-center justify-center text-[#060A12] font-bold text-[11px] shrink-0">
              {state.investigator.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-medium text-slate-100 leading-tight max-w-[110px] truncate">
                {state.investigator.name}
              </div>
              <div className="text-[9px] font-mono text-amber-400/90 leading-tight">
                {state.investigator.role}
              </div>
            </div>
          </button>
        </div>

      </div>
    </header>
  );
};
