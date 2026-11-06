import { motion } from "framer-motion";
import { Award, CheckCircle2, Sparkles, FolderLock, Share2, Compass, FileCheck } from "lucide-react";

export const SpecialDossiersSection = () => {
  const dossiersList = [
    {
      code: "DOSSIÊ 01",
      title: "O Rubicão e o Vale do Silício",
      subtitle: "Júlio César (49 a.C.) vs. Steve Jobs (2007)",
      desc: "O paralelo definitivo entre a travessia sem volta de César e a jogada de pressão do iPhone.",
      image: "/dossiers/dossier_01_rubicon.webp"
    },
    {
      code: "DOSSIÊ 02",
      title: "A Lama de Waterloo",
      subtitle: "Napoleão Bonaparte // Bélgica, 1815",
      desc: "Como a hesitação de 3 horas gerou a primeira grande redistribuição de capital moderno.",
      image: "/dossiers/dossier_02_waterloo.webp"
    },
    {
      code: "DOSSIÊ 03",
      title: "As Máquinas de Bletchley",
      subtitle: "Alan Turing // Inglaterra, 1941",
      desc: "Os registros que decifraram a previsibilidade matemática das decisões humanas em massa.",
      image: "/dossiers/dossier_03_bletchley.webp"
    },
    {
      code: "DOSSIÊ 04",
      title: "O Grande Travamento",
      subtitle: "Auditoria Strata // Faria Lima, 2026",
      desc: "O documento confidencial que conecta as operações financeiras aos centros de poder global.",
      image: "/dossiers/dossier_04_travamento.webp"
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-visible bg-gradient-to-b from-transparent via-[#080d1a]/80 to-transparent">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* PARTE A: COLEÇÃO DOS 4 DOSSIÊS INCLUSOS COM ILUSTRAÇÕES EXCLUSIVAS */}
        <div className="space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/30 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              BÔNUS DE LANÇAMENTO // ARQUIVOS DA INVESTIGAÇÃO
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
              Os 4 Dossiês da Investigação
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Relatórios confidenciais ilustrados, liberados diretamente no seu leitor digital conforme você avança pelos capítulos.
            </p>
          </div>

          {/* Cards dos Dossiês com Capas Próprias e Paleta Ouro/Obsidiana */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dossiersList.map((dossier, idx) => (
              <motion.div
                key={dossier.code}
                className="group relative rounded-2xl bg-[#090f1e] border border-gold/30 hover:border-gold/70 transition-all duration-300 overflow-hidden shadow-2xl flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                {/* Imagem do Dossiê */}
                <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-black/90">
                  <img
                    src={dossier.image}
                    alt={dossier.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-95"
                    loading="lazy"
                    width="640"
                    height="480"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090f1e] via-[#090f1e]/30 to-transparent" />
                  
                  {/* Badge de Dossiê */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-gold/50 flex items-center gap-1.5">
                    <FolderLock className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[11px] font-mono font-bold text-gold tracking-wider">
                      {dossier.code}
                    </span>
                  </div>


                </div>

                {/* Conteúdo Conciso */}
                <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-gold/80 block uppercase tracking-wider">
                      {dossier.subtitle}
                    </span>
                    <h4 className="font-sans font-bold text-lg text-white group-hover:text-gold transition-colors leading-snug">
                      {dossier.title}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {dossier.desc}
                    </p>
                  </div>


                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PARTE B: A CORRENTE DE LEITORES (RESUMIDA, VISUAL E DIRETA AO PONTO) */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0b1222] via-[#101b33] to-[#0b1222] border border-gold/30 shadow-[0_0_50px_rgba(201,169,98,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-5 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-bold font-mono tracking-wider uppercase border border-gold/30">
              <Share2 className="w-3.5 h-3.5 text-gold" /> A CORRENTE // EXPANSÃO DO UNIVERSO
            </span>

            <h3 className="font-sans text-2xl sm:text-3xl font-bold text-white leading-snug">
              Sua leitura pode abrir novos caminhos.
            </h3>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              A Corrente conecta você a novos dossiês confidenciais, conteúdos personalizados conforme seu perfil e condições especiais para o <strong>Livro II</strong>.
            </p>

            {/* 3 CARDS RESUMIDOS (DIRETOS, TEXTOS ENXUTOS E FONTE LEGÍVEL) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 space-y-2 hover:border-gold/40 transition-colors">
                <FileCheck className="w-5 h-5 text-gold" />
                <h5 className="font-sans font-bold text-base text-white">Novos Dossiês</h5>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  Arquivos secretos liberados ao longo dos capítulos da trama.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 space-y-2 hover:border-gold/40 transition-colors">
                <Award className="w-5 h-5 text-amber-400" />
                <h5 className="font-sans font-bold text-base text-white">Condições no Livro II</h5>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  Acesso prioritário e desconto exclusivo no segundo volume.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 space-y-2 hover:border-gold/40 transition-colors">
                <Compass className="w-5 h-5 text-cyan" />
                <h5 className="font-sans font-bold text-base text-white">Conteúdos por Perfil</h5>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  Materiais extras sobre tecnologia, estratégia e História.
                </p>
              </div>

            </div>

            {/* BOTÃO DE ACESSO DIRETO À CENTRAL DE INVESTIGAÇÃO */}
            <div className="pt-6 flex justify-center">
              <a
                href="/investigacao"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 border border-gold/50 text-gold hover:text-amber-200 font-mono text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(201,169,98,0.2)] hover:shadow-[0_0_35px_rgba(201,169,98,0.35)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Acessar Central de Investigação // O Padrão</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
