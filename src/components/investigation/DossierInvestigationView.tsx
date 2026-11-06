import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { HistoricalOrbitalRadar } from './HistoricalOrbitalRadar';
import { DecisionChoiceCard } from './DecisionChoiceCard';
import { FileSearch, Sparkles, CheckCircle2, ChevronRight, AlertTriangle, ArrowLeft } from 'lucide-react';

export const DossierInvestigationView: React.FC = () => {
  const { selectedCase, state, setActiveStep, setActiveTab, discoverEvidence } = useInvestigation();
  const [anomalyRevealed, setAnomalyRevealed] = useState(
    state.discoveredEvidenceIds.includes(selectedCase.id)
  );

  const handleRevealAnomaly = () => {
    setAnomalyRevealed(true);
    discoverEvidence(selectedCase.id);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. BREADCRUMB & HEADER DO CASO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div>
          <button
            onClick={() => setActiveTab('mapa')}
            className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-amber-300 transition-colors cursor-pointer mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Mapa Mundial
          </button>
          <h2 className="font-serif text-lg sm:text-2xl font-bold tracking-wide text-white uppercase">
            {selectedCase.fullName}
          </h2>
          <div className="text-xs font-mono text-amber-400/90 mt-0.5">
            {selectedCase.subtitle}
          </div>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 font-mono text-xs text-amber-300">
          Arquivo: {selectedCase.evidence.artifactCode}
        </span>
      </div>

      {/* 2. STEPPER MOBILE (Apenas telas pequenas) */}
      <div className="lg:hidden flex items-center justify-between gap-1 p-1.5 rounded-xl bg-[#0B1320] border border-amber-500/20">
        {[
          { num: 1, label: '1. Evidência' },
          { num: 2, label: '2. Conexão' },
          { num: 3, label: '3. Hipótese' },
        ].map(step => {
          const isActive = state.activeStep === step.num;
          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num as 1 | 2 | 3)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {step.label}
            </button>
          );
        })}
      </div>

      {/* 3. FLUXO EM 3 COLUNAS (DESKTOP) OU TELA POR ETAPA (MOBILE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ETAPA 1: REGISTROS PRIMÁRIOS (ANÁLISE DE EVIDÊNCIA) */}
        <div className={`space-y-4 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/25 p-5 shadow-xl ${
          state.activeStep !== 1 ? 'hidden lg:block' : 'block'
        }`}>
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
            <div className="flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                1. Registros Primários
              </span>
            </div>
            {anomalyRevealed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> Anomalia Verificada
              </span>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            {selectedCase.evidence.locationSubtitle}
          </div>

          {/* Fac-símile com ponto pulsante de Anomalia */}
          <div className="relative w-full h-52 sm:h-60 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950 group">
            <img
              src={selectedCase.dossierCover}
              alt="Evidência"
              className="w-full h-full object-cover object-center filter sepia-[0.3] brightness-90 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Ponto Pulsante de Anomalia Clicável */}
            <div
              onClick={handleRevealAnomaly}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/80 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.8)] cursor-pointer hover:scale-105 transition-all text-center animate-pulse"
            >
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>[Anomalia Detectada]</span>
              </div>
              <div className="text-[9px] font-mono text-slate-300">
                Toque para inspecionar
              </div>
            </div>
          </div>

          {/* Revelação Documental */}
          {anomalyRevealed ? (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-sans text-slate-200 leading-relaxed space-y-2 animate-in fade-in duration-500">
              <div className="font-mono text-[10px] text-amber-400 font-bold uppercase">
                Tabuleta de Intendência // Transcrição Desclassificada:
              </div>
              <p className="italic text-amber-100/90">
                "{selectedCase.evidence.parchmentNote}"
              </p>
              <div className="text-[10px] font-mono text-cyan-300 pt-1 border-t border-amber-500/20">
                {selectedCase.evidence.confidentialTelemetry}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/40 text-center text-xs font-mono text-slate-400">
              Clique na [Anomalia Detectada] sobre a evidência histórica para descriptografar os registros primários.
            </div>
          )}

          {/* Botão de Próxima Etapa no Mobile */}
          <div className="lg:hidden pt-2">
            <button
              onClick={() => setActiveStep(2)}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Avançar para Conexão Analógica</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ETAPA 2: CONEXÃO HISTÓRICA — RADAR ORBITAL */}
        <div className={`space-y-4 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-cyan-500/25 p-5 shadow-xl ${
          state.activeStep !== 2 ? 'hidden lg:block' : 'block'
        }`}>
          <HistoricalOrbitalRadar />

          {/* Botão de Próxima Etapa no Mobile */}
          <div className="lg:hidden pt-2">
            <button
              onClick={() => setActiveStep(3)}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Avançar para Formulação de Hipótese</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ETAPA 3: SUA DECISÃO NO PADRÃO (ELEMENTO RPG E HIPÓTESE) */}
        <div className={`space-y-4 rounded-2xl bg-[#0B1320]/95 backdrop-blur-md border border-amber-500/25 p-5 shadow-xl ${
          state.activeStep !== 3 ? 'hidden lg:block' : 'block'
        }`}>
          <DecisionChoiceCard />
        </div>

      </div>

    </div>
  );
};
