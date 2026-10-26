import salomao from "@/assets/characters/salomao.webp";
import alexandre from "@/assets/characters/alexandre.webp";
import cleopatra from "@/assets/characters/cleopatra.webp";
import joanaDarc from "@/assets/characters/joana_darc.webp";
import daVinci from "@/assets/characters/da_vinci.webp";
import julioCesar from "@/assets/characters/julio_cesar.webp";
import napoleao from "@/assets/characters/napoleao.webp";
import turing from "@/assets/characters/turing.webp";
import mandela from "@/assets/characters/mandela.webp";
import jobs from "@/assets/characters/jobs.webp";

const characters = [
  { name: "Salomão", image: salomao, era: "970 a.C.", role: "Sabedoria" },
  { name: "Alexandre", image: alexandre, era: "326 a.C.", role: "Expansão" },
  { name: "Júlio César", image: julioCesar, era: "49 a.C.", role: "Ruptura" },
  { name: "Cleópatra", image: cleopatra, era: "30 a.C.", role: "Sobrevivência" },
  { name: "Joana d'Arc", image: joanaDarc, era: "1431", role: "Convicção" },
  { name: "Da Vinci", image: daVinci, era: "1500", role: "Visão" },
  { name: "Napoleão", image: napoleao, era: "1815", role: "Hesitação" },
  { name: "Alan Turing", image: turing, era: "1941", role: "Decodificação" },
  { name: "Mandela", image: mandela, era: "1994", role: "Paciência" },
  { name: "Steve Jobs", image: jobs, era: "2007", role: "Controle" }
];

const patternVariables = [
  { step: "01", label: "Pressão Acumulada" },
  { step: "02", label: "Informação Incompleta" },
  { step: "03", label: "Alternativas Reduzidas" },
  { step: "04", label: "Decisão de Ruptura" },
  { step: "05", label: "Consequência Irreversível" }
];

export const SpecialPlotManifestoSection = () => {
  return (
    <section className="relative py-16 sm:py-22 px-4 sm:px-6 overflow-visible">
      <div className="max-w-5xl mx-auto space-y-14 relative z-10">

        {/* PARTE A: A TESE HISTÓRICA E AS 5 VARIÁVEIS DO PADRÃO OCULTO */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className="text-xs font-mono tracking-[0.25em] text-cyan uppercase bg-cyan/10 px-3.5 py-1.5 rounded-full border border-cyan/25 inline-block">
            A TESE CENTRAL // 3.000 ANOS DE HISTÓRIA
          </span>

          <h2 className="font-sans text-2xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
            E se a História não fosse tão imprevisível quanto parece?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Depois que um império cai ou uma revolução vence, os livros didáticos transformam tudo em destino ou genialidade. Mas nos arquivos de quem estava na retaguarda — o intendente contando o trigo de <strong className="text-white">Júlio César no Rubicão</strong>, o oficial de ordens na lama de <strong className="text-white">Waterloo</strong>, o engenheiro atrás da cortina com <strong className="text-white">Steve Jobs</strong> — emerge sempre a mesma equação de 5 variáveis:
          </p>

          {/* As 5 Variáveis do Padrão Oculto */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {patternVariables.map((v) => (
              <div
                key={v.step}
                className="p-3 rounded-xl bg-[#0b1325] border border-gold/30 flex flex-col items-center justify-center text-center shadow-md"
              >
                <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-widest">
                  VARIÁVEL {v.step}
                </span>
                <span className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">
                  {v.label}
                </span>
              </div>
            ))}
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-[#0f172a]/95 border border-gold/40 shadow-xl text-left sm:text-center">
            <p className="text-base sm:text-lg text-slate-100 font-sans font-medium leading-relaxed">
              "A História tem uma crueldade particular: depois que tudo termina, ela transforma incerteza em sequência. Não são os eventos que se repetem — são os <strong className="text-gold font-bold">mecanismos humanos</strong> quando um líder percebe que ficou sem saída."
            </p>
          </div>
        </div>

        {/* PARTE B: OS 10 PROTAGONISTAS EM GRADE COMPACTA */}
        <div className="space-y-6">
          <div className="text-center space-y-1.5">
            <h3 className="font-sans text-xl sm:text-2xl font-bold text-white tracking-tight">
              10 Líderes. 10 Bastidores Reais Desclassificados na Obra:
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-normal max-w-xl mx-auto">
              De 970 a.C. aos bastidores do poder no presente, cada capítulo reconstrói o instante exato antes da decisão:
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2.5 sm:gap-5">
            {characters.map((char) => (
              <div
                key={char.name}
                className="group flex flex-col items-center text-center space-y-1.5 p-2 sm:p-3 rounded-xl bg-card/30 border border-white/5 hover:border-gold/40 transition-all duration-300"
              >
                <div className="relative w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden border border-gold/30 group-hover:border-gold transition-colors shadow-md">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover object-top rounded-full bg-[#0b1120]"
                    loading="lazy"
                    width="80"
                    height="80"
                  />
                </div>

                <div>
                  <h4 className="font-sans font-bold text-[11px] sm:text-sm text-foreground leading-tight line-clamp-1">
                    {char.name}
                  </h4>
                  <span className="text-[9px] sm:text-[11px] font-mono text-cyan block">{char.era}</span>
                  <p className="hidden sm:block text-[11px] text-muted-foreground line-clamp-1">{char.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
