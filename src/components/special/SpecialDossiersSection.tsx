import { useState } from "react";
import { motion } from "framer-motion";
import { FolderLock, Share2, Award, Zap, BookOpen, Paperclip, FileCheck, ShieldAlert, Sparkles } from "lucide-react";

const CensoredText = ({ secret, hint = "toque p/ revelar" }: { secret: string; hint?: string }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      onClick={() => setRevealed(!revealed)}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      className="inline-block relative cursor-pointer mx-1 transition-all duration-300 align-baseline select-none"
      title="Passe o mouse ou toque para quebrar a censura"
    >
      {revealed ? (
        <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/50 animate-in fade-in font-mono text-[11px] shadow-[0_0_10px_rgba(34,197,94,0.3)]">
          {secret}
        </span>
      ) : (
        <span className="bg-[#0f172a] text-slate-400 hover:text-gold px-2 py-0.5 rounded border border-slate-700 tracking-wider font-mono text-[11px] shadow-inner">
          <span className="text-slate-200 font-black">██████</span> <span className="text-[9px] text-gold/80 italic font-sans font-light">({hint})</span>
        </span>
      )}
    </span>
  );
};

export const SpecialDossiersSection = () => {
  const dossiersList = [
    {
      code: "DOSSIÊ 01",
      archiveId: "DOC-49BC-RUBICON",
      title: "O Rubicão e o Vale do Silício",
      desc: "Um estudo comparativo entre a travessia de César em 49 a.C. e a estratégia de pressão da Apple no lançamento de 2007.",
      secretClause: "ORDEM DE EXPANSÃO 2026: A trava de liquidez bancária foi copiada do modelo das legiões romanas.",
      stamp: "DESCLASSIFICADO"
    },
    {
      code: "DOSSIÊ 02",
      archiveId: "DOC-1815-WATERLOO",
      title: "A Lama de Waterloo & A Hesitação de 1815",
      desc: "Como um atraso de 3 horas motivado pela chuva na Bélgica alterou o fluxo de capital europeu nos 100 anos seguintes.",
      secretClause: "RELATÓRIO CONFIDENCIAL: A falha logística de Napoleão gerou a primeira compra alavancada da dívida britânica.",
      stamp: "NÍVEL 4"
    },
    {
      code: "DOSSIÊ 03",
      archiveId: "DOC-1941-BLETCHLEY",
      title: "As Máquinas de Bletchley Park",
      desc: "Os relatórios reservados que mostram a primeira tentativa de antecipar escolhas estratégicas humanas por algoritmos.",
      secretClause: "CÓDIGO BOMBE // ALAN TURING: A máquina não buscava o texto, mas a previsão do medo do operador da Enigma.",
      stamp: "ARQUIVO SECRETO"
    },
    {
      code: "ARQUIVO 00",
      archiveId: "DOC-2026-LOCKDOWN",
      title: "O Grande Travamento",
      desc: "A peça final que liga a auditoria da Faria Lima aos centros de inteligência e gabinetes de decisão global.",
      secretClause: "DIRETRIZ FINAL: O modelo preditivo da Strata foi alimentado com variáveis comportamentais desde 1989.",
      stamp: "CONFIDENCIAL"
    }
  ];

  return (
    <section className="relative py-28 px-4 sm:px-6 overflow-visible bg-gradient-to-b from-transparent via-[#080d1a]/80 to-transparent">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* PARTE A: COLEÇÃO DE DOSSIÊS INCLUSOS COMO PASTAS DESCLASSIFICADAS */}
        <div className="space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/25 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              CONTEÚDO EXPANDIDO // PASTAS DESCLASSIFICADAS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Os 4 Dossiês Históricos Confidenciais
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Além dos 21 capítulos da trama principal, do prólogo e do epílogo (23 partes integrais), você desbloqueia a coleção de 4 dossiês históricos para investigar cada documento secreto da trama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {dossiersList.map((dossier, idx) => (
              <motion.div
                key={dossier.code}
                className="relative rounded-2xl bg-[#0c1424] border border-gold/30 hover:border-gold/60 transition-all duration-300 p-6 sm:p-7 space-y-4 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group overflow-hidden"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                {/* Textura de Fundo & Carimbo de Arquivo Desclassificado */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Clipe Metálico Simulado */}
                <div className="absolute top-0 left-8 -translate-y-1/2 flex items-center justify-center text-slate-400 group-hover:text-gold transition-colors">
                  <div className="w-6 h-10 rounded-full border-2 border-slate-500 bg-[#162035] shadow-md group-hover:border-gold transition-colors flex items-center justify-center">
                    <div className="w-2 h-6 border-l-2 border-slate-600 group-hover:border-gold/70" />
                  </div>
                </div>

                {/* Carimbo Angular de Classificação */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 pl-7">
                    <span className="text-xs font-mono font-bold text-cyan tracking-wider">
                      {dossier.code}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      // {dossier.archiveId}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded border border-red-500/40 bg-red-500/15 text-red-400 rotate-2 shadow-sm">
                    {dossier.stamp}
                  </span>
                </div>

                {/* Título do Dossiê */}
                <h4 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-gold transition-colors">
                  {dossier.title}
                </h4>

                {/* Descrição */}
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {dossier.desc}
                </p>

                {/* Cláusula Secreta com Tarja Interativa */}
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gold uppercase tracking-wider">
                    <ShieldAlert className="w-3.5 h-3.5 text-gold" />
                    <span>Fragmento Censurado:</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed pt-0.5">
                    Trecho de inteligência:
                    <CensoredText secret={dossier.secretClause} />
                  </p>
                </div>

                {/* Rodapé da Pasta */}
                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/5">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3 h-3 text-emerald-400" />
                    <span>Acesso Total Incluso na Obra</span>
                  </span>
                  <span className="text-emerald-400 font-bold">R$ 0,00 EXTRA</span>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

        {/* PARTE B: O ECOSSISTEMA DA CORRENTE */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0b1222] via-[#101b33] to-[#0b1222] border border-cyan/30 shadow-[0_0_60px_rgba(56,189,248,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/15 text-cyan text-xs font-bold font-mono tracking-wider uppercase border border-cyan/30">
              <Share2 className="w-3.5 h-3.5" /> A CORRENTE DE LEITORES // UNIVERSO EXPANDIDO
            </span>

            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug">
              Você não apenas lê. Você se torna um transmissor da verdade.
            </h3>

            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              Ao desbloquear sua obra completa, você recebe uma <strong>Chave Pessoal de Transmissão</strong> exclusiva. Compartilhar sua chave com outros leitores desbloqueia privilégios reais no ecossistema:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <Award className="w-5 h-5 text-gold mb-1" />
                <h5 className="font-bold text-sm text-white">Acesso Antecipado</h5>
                <p className="text-xs text-slate-400 font-light">
                  Prioridade absoluta e gratuita no lançamento oficial de <strong>O Último Segredo — Livro II</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <BookOpen className="w-5 h-5 text-cyan mb-1" />
                <h5 className="font-bold text-sm text-white">Relatórios Reservados</h5>
                <p className="text-xs text-slate-400 font-light">
                  Análises inéditas e materiais cortados da edição original revelados diretamente no seu leitor.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <Zap className="w-5 h-5 text-emerald-400 mb-1" />
                <h5 className="font-bold text-sm text-white">Comunidade VIP</h5>
                <p className="text-xs text-slate-400 font-light">
                  Seu nome inserido na lista histórica de transmissores oficiais que ajudaram a quebrar o silêncio.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
