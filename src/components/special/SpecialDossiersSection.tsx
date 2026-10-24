import { motion } from "framer-motion";
import { Award, BookOpen, CheckCircle2, Sparkles, FolderLock, Share2, Compass, FileCheck } from "lucide-react";

export const SpecialDossiersSection = () => {
  const dossiersList = [
    {
      code: "DOSSIÊ 01",
      title: "O Rubicão e o Vale do Silício",
      subtitle: "Júlio César (49 a.C.) vs. Steve Jobs (2007)",
      desc: "O paralelo definitivo entre a travessia sem volta de César e a jogada de pressão do iPhone.",
      image: "/reader/assets/chapters/ch02_julio_cesar.jpg"
    },
    {
      code: "DOSSIÊ 02",
      title: "A Lama de Waterloo",
      subtitle: "Napoleão Bonaparte // Bélgica, 1815",
      desc: "Como a hesitação de 3 horas gerou a primeira grande redistribuição de capital moderno.",
      image: "/reader/assets/chapters/ch11_napoleao.jpg"
    },
    {
      code: "DOSSIÊ 03",
      title: "As Máquinas de Bletchley",
      subtitle: "Alan Turing // Inglaterra, 1941",
      desc: "Os registros que decifraram a previsibilidade matemática das decisões humanas em massa.",
      image: "/reader/assets/chapters/ch13_turing.jpg"
    },
    {
      code: "DOSSIÊ 04",
      title: "O Grande Travamento",
      subtitle: "Auditoria Strata // Faria Lima, 2026",
      desc: "O documento confidencial que conecta as operações financeiras aos centros de poder global.",
      image: "/reader/assets/chapters/ch04_marina.jpg"
    }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 overflow-visible bg-gradient-to-b from-transparent via-[#080d1a]/80 to-transparent">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* PARTE A: COLEÇÃO DOS 4 DOSSIÊS INCLUSOS (VISUAL, ILUSTRADO E COESO) */}
        <div className="space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/30 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              CONTEÚDO EXPANDIDO // 4 DOSSIÊS SECRETOS INCLUSOS
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
              Os Dossiês Históricos da Obra
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Além dos 21 capítulos e do epílogo, você recebe 4 relatórios investigativos ilustrados liberados diretamente dentro do seu e-reader sem custo extra.
            </p>
          </div>

          {/* Cards dos Dossiês: 100% Visuais, com Ilustração e Paleta Unificada Ouro/Obsidiana */}
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
                {/* Imagem Ilustrada do Dossiê */}
                <div className="relative w-full h-48 overflow-hidden bg-black/90">
                  <img
                    src={dossier.image}
                    alt={dossier.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 brightness-95"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090f1e] via-[#090f1e]/30 to-transparent" />
                  
                  {/* Badge de Dossiê no topo da foto */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-gold/50 flex items-center gap-1.5">
                    <FolderLock className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[11px] font-mono font-bold text-gold tracking-wider">
                      {dossier.code}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-[9px] font-mono uppercase tracking-widest text-red-300">
                    CONFIDENCIAL
                  </div>
                </div>

                {/* Conteúdo Conciso e Direto */}
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

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Incluso na Edição</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PARTE B: A CORRENTE DE LEITORES (POSICIONADA COMO EXPANSÃO PERSONALIZADA E CONTINUIDADE) */}
        <div className="p-7 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0b1222] via-[#101b33] to-[#0b1222] border border-gold/30 shadow-[0_0_60px_rgba(201,169,98,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold/15 text-gold text-xs font-bold font-mono tracking-wider uppercase border border-gold/30">
              <Share2 className="w-3.5 h-3.5 text-gold" /> A CORRENTE DE LEITORES // EXPANSÃO DO UNIVERSO
            </span>

            <h3 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug">
              Sua leitura pode abrir novos caminhos.
            </h3>

            <div className="space-y-4 text-base sm:text-lg text-slate-200 font-normal leading-relaxed text-left sm:text-center">
              <p>
                A Corrente conecta os leitores de <strong className="text-white">O Último Segredo da Humanidade</strong> a uma experiência que vai além do livro.
              </p>
              <p className="text-sm sm:text-base text-slate-300">
                Ao participar, você poderá desbloquear novos dossiês confidenciais, materiais complementares e conteúdos personalizados conforme seus interesses e seu perfil de leitor.
              </p>
              <p className="text-sm sm:text-base text-slate-300">
                E a investigação não termina no primeiro volume: participantes da Corrente também poderão ter acesso a condições especiais para adquirir a edição especial de <strong className="text-white">O Último Segredo da Humanidade — Livro II</strong>.
              </p>
            </div>

            {/* 3 PILARES: FUNCIONAMENTO E BENEFÍCIOS ESTRUTURADOS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 text-left">
              
              {/* 1. Conteúdos Adicionais */}
              <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-2 hover:border-gold/40 transition-colors flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FileCheck className="w-6 h-6 text-gold" />
                    <span className="text-[10px] font-mono text-gold/80 tracking-wider uppercase px-2 py-0.5 rounded bg-gold/10">Conteúdos</span>
                  </div>
                  <h5 className="font-sans font-bold text-base sm:text-lg text-white">Novos Dossiês & Materiais</h5>
                  <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
                    Acesso a materiais complementares e novos arquivos relacionados ao universo da obra liberados conforme a sua participação.
                  </p>
                </div>
              </div>

              {/* 2. Vantagens Comerciais */}
              <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-2 hover:border-gold/40 transition-colors flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Award className="w-6 h-6 text-amber-400" />
                    <span className="text-[10px] font-mono text-amber-400/80 tracking-wider uppercase px-2 py-0.5 rounded bg-amber-400/10">Continuidade</span>
                  </div>
                  <h5 className="font-sans font-bold text-base sm:text-lg text-white">Condições no Livro II</h5>
                  <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
                    Participantes terão acesso a condições especiais de compra e descontos na aquisição da edição especial do segundo volume.
                  </p>
                </div>
              </div>

              {/* 3. Personalização */}
              <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-2 hover:border-gold/40 transition-colors flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Compass className="w-6 h-6 text-cyan" />
                    <span className="text-[10px] font-mono text-cyan/80 tracking-wider uppercase px-2 py-0.5 rounded bg-cyan/10">Personalizado</span>
                  </div>
                  <h5 className="font-sans font-bold text-base sm:text-lg text-white">Conteúdos por Perfil</h5>
                  <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
                    Liberação de materiais selecionados conforme temas preferidos declarados pelo leitor — como tecnologia, estratégia ou História.
                  </p>
                </div>
              </div>

            </div>

            {/* Fechamento da Seção */}
            <div className="pt-4 border-t border-white/10 text-center space-y-1">
              <p className="text-sm sm:text-base text-gold font-medium font-sans">
                Mais conexões. Novos arquivos. Outros caminhos para descobrir o que está por trás da História.
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                Entre na Corrente e descubra o que poderá ser desbloqueado ao longo da sua jornada.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
