import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { ShieldCheck, Check, Save, Sparkles, MessageSquare } from 'lucide-react';

export const DecisionChoiceCard: React.FC = () => {
  const { selectedCase, state, selectHypothesis, updatePersonalNote } = useInvestigation();
  const currentHypothesisId = state.formulatedHypotheses[selectedCase.id];
  const [localNote, setLocalNote] = useState(state.personalNotes[selectedCase.id] || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChoose = (id: string) => {
    selectHypothesis(selectedCase.id, id);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleSaveNote = () => {
    updatePersonalNote(selectedCase.id, localNote);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-4">
      {/* Título da Etapa 3 */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
            3. Sua Hipótese no Compêndio
          </span>
        </div>
        <span className="text-xs sm:text-sm font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
          Decisão Gravada
        </span>
      </div>

      <p className="text-xs text-slate-300 font-sans">
        Diante das evidências, qual tese explica com maior precisão o padrão decisório deste momento histórico?
      </p>

      {/* Cartões de Hipótese A e B */}
      <div className="space-y-3">
        {selectedCase.hypotheses.map(hypo => {
          const isSelected = currentHypothesisId === hypo.id;
          return (
            <div
              key={hypo.id}
              onClick={() => handleChoose(hypo.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-1.5 ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                  : 'bg-black/40 border-white/10 hover:border-amber-500/40 hover:bg-black/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-xs sm:text-sm font-mono font-bold ${
                  hypo.tag === 'A' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                }`}>
                  Hipótese {hypo.tag}
                </span>
                {isSelected && (
                  <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-mono text-emerald-400 font-bold">
                    <Check className="w-3.5 h-3.5" /> Escolhida
                  </span>
                )}
              </div>

              <div className="font-sans font-bold text-xs sm:text-sm text-white">
                {hypo.title}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                {hypo.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Campo para Anotação do Investigador */}
      <div className="pt-2 space-y-1.5">
        <label className="text-xs sm:text-sm font-mono text-slate-400 flex items-center gap-1">
          <MessageSquare className="w-3 h-3 text-amber-400" />
          <span>Suas Notas Pessoais de Campo (Sincronizadas):</span>
        </label>
        <textarea
          value={localNote}
          onChange={e => setLocalNote(e.target.value)}
          placeholder="Ex: Anotei que a escassez de trigo foi omitida dos discursos de Cícero..."
          rows={2}
          className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/60 text-slate-200 text-xs font-sans focus:outline-none focus:border-amber-400/60"
        />
        <div className="flex justify-between items-center pt-1">
          {saveSuccess ? (
            <span className="text-xs sm:text-sm font-mono text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3 h-3" /> Registrado no Compêndio!
            </span>
          ) : (
            <span className="text-xs sm:text-sm font-mono text-slate-500">
              Salvo no banco de dados
            </span>
          )}
          <button
            onClick={handleSaveNote}
            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Save className="w-3 h-3" /> Gravar Notas
          </button>
        </div>
      </div>
    </div>
  );
};
