import { motion } from "framer-motion";
import { FolderLock, Share2, Award, Zap, BookOpen, CheckCircle2, Sparkles, FileText } from "lucide-react";

export const SpecialDossiersSection = () => {
  const dossiersList = [
    {
      code: "DOSSIÊ 01",
      tag: "ESTRATÉGIA & PODER",
      title: "O Rubicão e o Vale do Silício",
      desc: "O paralelo definitivo entre a travessia sem volta de Júlio César em 49 a.C. e a jogada de pressão de Steve Jobs em 2007."
    },
    {
      code: "DOSSIÊ 02",
      tag: "LOGÍSTICA & RISCO",
      title: "A Lama de Waterloo (1815)",
      desc: "Como a hesitação de 3 horas de Napoleão na Bélgica gerou a primeira grande redistribuição de capital da história moderna."
    },
    {
      code: "DOSSIÊ 03",
      tag: "ALGORITMOS & GUERRA",
      title: "As Máquinas de Bletchley Park (1941)",
      desc: "Os registros de Alan Turing decifrando não apenas códigos militares, mas a previsibilidade das decisões humanas de massa."
    },
    {
      code: "DOSSIÊ 04",
      tag: "INVESTIGAÇÃO FARIA LIMA",
      title: "O Grande Travamento (2026)",
      desc: "O documento confidencial que Caio e Marina descobrem conectando a auditoria da Strata aos centros de poder global."
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-visible bg-gradient-to-b from-transparent via-[#080d1a]/80 to-transparent">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* PARTE A: COLEÇÃO DOS 4 DOSSIÊS INCLUSOS */}
        <div className="space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/25 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              CONTEÚDO EXPANDIDO // 4 DOSSIÊS SECRETOS INCLUSOS
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
              Os Dossiês Históricos da Obra
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Além dos 21 capítulos e do epílogo, você recebe 4 relatórios investigativos exclusivos liberados diretamente dentro do seu e-reader sem nenhum custo extra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dossiersList.map((dossier, idx) => (
              <motion.div
                key={dossier.code}
                className="relative rounded-2xl bg-[#0b1222] border border-gold/30 hover:border-gold/60 transition-all duration-300 p-6 space-y-4 shadow-xl group flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan tracking-wider px-2.5 py-1 rounded-lg bg-cyan/10 border border-cyan/25">
                        {dossier.code}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        {dossier.tag}
                      </span>
                    </div>
                    <FileText className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  </div>

                  <h4 className="font-sans font-bold text-lg sm:text-xl text-white group-hover:text-gold transition-colors">
                    {dossier.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {dossier.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Incluso na Edição Especial</span>
                  </span>
                  <span className="text-slate-400 font-light">Liberado no E-Reader</span>
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

            <h3 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug">
              Você não apenas lê. Você se torna um transmissor da verdade.
            </h3>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Ao desbloquear sua obra completa, você recebe uma <strong>Chave Pessoal de Transmissão</strong> exclusiva. Compartilhar sua chave com outros leitores desbloqueia privilégios reais no ecossistema:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <Award className="w-5 h-5 text-gold mb-1" />
                <h5 className="font-sans font-bold text-sm text-white">Acesso Antecipado</h5>
                <p className="text-xs text-slate-400 font-light">
                  Prioridade absoluta e gratuita no lançamento oficial de <strong>O Último Segredo — Livro II</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <BookOpen className="w-5 h-5 text-cyan mb-1" />
                <h5 className="font-sans font-bold text-sm text-white">Relatórios Reservados</h5>
                <p className="text-xs text-slate-400 font-light">
                  Análises inéditas e materiais cortados da edição original revelados diretamente no seu leitor.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <Zap className="w-5 h-5 text-emerald-400 mb-1" />
                <h5 className="font-sans font-bold text-sm text-white">Comunidade VIP</h5>
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
