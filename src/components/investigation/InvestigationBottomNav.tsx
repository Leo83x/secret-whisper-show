import React from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { TabKey } from '../../types/investigation';
import { Globe, FolderOpen, Target, Users, User } from 'lucide-react';

export const InvestigationBottomNav: React.FC = () => {
  const { state, setActiveTab } = useInvestigation();

  const navItems: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'mapa', label: 'Mapa', icon: Globe },
    { key: 'dossies', label: 'Dossiês', icon: FolderOpen },
    { key: 'missoes', label: 'Missões', icon: Target },
    { key: 'comunidade', label: 'Comunidade', icon: Users },
    { key: 'perfil', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#060A12]/95 backdrop-blur-lg border-t border-amber-500/25 px-2 py-2 shadow-[0_-10px_25px_rgba(0,0,0,0.85)]">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = state.activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-amber-300 bg-amber-500/15'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : 'text-slate-400'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                )}
              </div>
              <span className={`text-xs font-sans tracking-tight mt-1 ${isActive ? 'font-bold text-amber-300' : 'font-medium text-slate-300'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
