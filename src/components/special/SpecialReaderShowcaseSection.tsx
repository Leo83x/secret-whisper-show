import { motion } from "framer-motion";
import bookCover from "/capa_ush.jpg";
import { Moon, Type, Bookmark, ShieldCheck, Smartphone, Laptop } from "lucide-react";

export const SpecialReaderShowcaseSection = () => {
  return (
    <section className="relative py-28 px-6 overflow-visible bg-[#050811]/60 border-y border-white/5">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase bg-gold/10 px-3.5 py-1 rounded-full border border-gold/25">
            TECNOLOGIA EXCLUSIVA // NADA DE PDF COMUM
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Uma plataforma de leitura desenhada para prender a sua atenção.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Esqueça arquivos soltos de PDF que desconfiguram no celular. Você acessa um leitor digital nativo, construído com foco obsessivo em tipografia, contraste e imersão total.
          </p>
        </div>

        {/* Grade Visual: Mockup + Recursos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Mockup do E-reader */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              className="relative w-full max-w-xs sm:max-w-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              {/* Moldura de Smartphone Futurista */}
              <div className="relative rounded-[32px] p-2.5 bg-gradient-to-b from-slate-700 via-slate-900 to-black border border-gold/30 shadow-[0_0_50px_rgba(0,0,0,0.85)]">
                <div className="rounded-[24px] overflow-hidden bg-[#070b14] border border-white/10 p-3 flex flex-col items-center">
                  <div className="w-20 h-3 bg-slate-800 rounded-full mb-3 opacity-60" />
                  
                  {/* Capa dentro do mockup */}
                  <img
                    src={bookCover}
                    alt="E-reader em execução"
                    className="w-full h-auto rounded-xl shadow-2xl border border-gold/20 mb-3"
                  />
                  
                  <div className="w-full text-left space-y-1 px-1">
                    <span className="text-[10px] font-mono text-cyan uppercase tracking-wider block">CAPÍTULO 01 // 19H04</span>
                    <p className="text-xs font-serif text-slate-200 line-clamp-2 italic">
                      "Os dados na tela do terminal piscavam em intervalos regulares de dezesseis segundos..."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 4 Diferenciais Tecnológicos */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            <div className="p-6 rounded-2xl bg-[#0b1222] border border-gold/20 hover:border-gold/40 transition-colors space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Moon className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">3 Temas Cinematográficos</h4>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Alterne entre <strong>Modo Escuro</strong> (profundo sem reflexos), <strong>Sépia</strong> (conforto de papel nobre) e <strong>Claro</strong> com apenas um toque.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b1222] border border-gold/20 hover:border-gold/40 transition-colors space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan">
                <Type className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">Tipografia Ajustável</h4>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Altere o tamanho da fonte, espaçamento de linhas e margens para criar a leitura mais confortável para os seus olhos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b1222] border border-gold/20 hover:border-gold/40 transition-colors space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">Marcador de Linha Inteligente</h4>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                O e-reader grava a linha exata onde você parou de ler. Se fechar a aba e voltar depois, ele rola suavemente até o ponto exato.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b1222] border border-gold/20 hover:border-gold/40 transition-colors space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-white">Zero Instalação Obrigatória</h4>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                Funciona em qualquer navegador moderno no celular, tablet ou PC. Mas se quiser, você pode fixar com 1 clique como App PWA na sua tela inicial.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
