import { motion } from "framer-motion";
import { FolderLock, Share2, Award, Zap, BookOpen } from "lucide-react";

export const SpecialDossiersSection = () => {
  const dossiersList = [
    {
      code: "DOSSIÊ 01",
      title: "O Rubicão e o Vale do Silício",
      desc: "Um estudo comparativo entre o movimento de César em 49 a.C. e a estratégia de ruptura de Steve Jobs no lançamento de 2007."
    },
    {
      code: "DOSSIÊ 02",
      title: "A Lama de Waterloo & A Hesitação de 1815",
      desc: "Como um atraso de 3 horas motivado pela chuva na Bélgica alterou o fluxo de capital europeu nos 100 anos seguintes."
    },
    {
      code: "DOSSIÊ 03",
      title: "As Máquinas de Bletchley Park",
      desc: "Os relatórios confidenciais que mostram a primeira tentativa de antecipar escolhas estratégicas humanas por algoritmos."
    },
    {
      code: "ARQUIVO 00",
      title: "O Grande Travamento",
      desc: "A peça final que liga a trama contemporânea aos centros de inteligência e gabinetes de decisão global."
    }
  ];

  return (
    <section className="relative py-28 px-6 overflow-visible bg-gradient-to-b from-transparent via-[#0b1120]/70 to-transparent">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* PARTE A: COLEÇÃO DE DOSSIÊS INCLUSOS */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase bg-gold/10 px-3.5 py-1 rounded-full border border-gold/25">
              CONTEÚDO EXPANDIDO // INCLUSO NO ACESSO
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Os Dossiês Históricos Confidenciais
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
              Além dos 22 capítulos da trama principal e do epílogo, você desbloqueia a coleção de dossiês históricos para aprofundar cada descoberta da investigação.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dossiersList.map((dossier, idx) => (
              <motion.div
                key={dossier.code}
                className="p-6 rounded-2xl bg-[#0f172a] border border-gold/25 hover:border-gold/50 transition-all space-y-3 relative overflow-hidden group shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan tracking-wider">
                    {dossier.code}
                  </span>
                  <FolderLock className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="font-display font-bold text-lg text-white group-hover:text-gold transition-colors">
                  {dossier.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {dossier.desc}
                </p>
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
