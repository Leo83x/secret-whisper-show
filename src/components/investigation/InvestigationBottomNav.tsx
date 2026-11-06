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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060A12]/95 backdrop-blur-lg border-t border-amber-500/25 px-2 py-1.5">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = state.activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-all cursor-pointer ${
                isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-mono tracking-wide ${isActive ? 'font-semibold text-amber-300' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
