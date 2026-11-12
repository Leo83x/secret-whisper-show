import { HistoricalNode } from "../types/investigation";
import salomaoImg from "../assets/characters/salomao.webp";
import alexandreImg from "../assets/characters/alexandre.webp";
import daVinciImg from "../assets/characters/da_vinci.webp";

export const EXTENDED_HISTORICAL_NODES: HistoricalNode[] = [
  // ==========================================
  // CASO 000: SALOMAO (970 a.C. // JERUSALEM)
  // ==========================================
  {
    id: "salomao",
    name: "Salomao",
    fullName: "Salomao e o Principio do Registro",
    year: "970 a.C.",
    timelineLabel: "970 a.C. Jerusalem",
    location: "Jerusalem — Patio Real do Templo",
    era: "antiguidade",
    coords: { x: 68, y: 44 },
    geoCoords: { x: 57.5, y: 38.2 },
    image: salomaoImg,
    dossierCover: "/dossiers/archive_room_3d_clean.webp",
    status: "bloqueado",
    isVolumeOne: true,
    isBonusDossier: true,
    bonusUnlockRequirement: "Desbloqueado ao concluir 3 investigações, acumular 1.000 XP de mérito ou autenticar o Código Secreto do Livro.",
    missionCode: "CASO 000 // ARQUIVO FUNDACIONAL",
    missionTitle: "O LIMITE DA SABEDORIA CENTRALIZADA",
    title: "Salomao e o Principio do Registro",
    subtitle: "970 a.C. — Jerusalem // Patio das Sentencas",
    shortDescription:
      "Nas fundacoes de Jerusalem, o Arquivo Zero esconde o dilema inaugural da civilizacao: quando os registros contabeis e fiscais nao conseguem determinar a verdade, a natureza real do poder se revela no que o tomador de decisao esta disposto a perder para nao destruir o que e vivo.",
    missionBullets: [
      "Examinar o rolo da sentenca e os inventarios das doze intendencias fiscais do Templo.",
      "Identificar o ponto em que o calculo puramente quantitativo produz a destruicao do bem tutelado.",
      "Conectar a renuncia da mae verdadeira ao principio da assimetria moral antes de assinar o laudo."
    ],
    evidence: {
      title: "Arquivo Fundacional 000 — Patio Real de Jerusalem",
      artifactCode: "DOC-ZERO-JERUSALEM-970BC",
      locationSubtitle: "COORDENADAS HISTORICAS: 31°46′N 35°14′E // MONTE DO TEMPLO, JUDEIA",
      parchmentNote:
        "Sentado junto aos rolos de tributos de trigo e prata do reino, o escriba real mantinha o calamo suspenso sobre o papiro. Diante do trono, duas mulheres reivindicavam a mesma crianca viva, sem testemunhas ou contratos.",
      confidentialTelemetry:
        "NOTA DO ARQUIVO MORTO: Uma maquina programada apenas para fechar a conta sempre manda partir a crianca ao meio, porque para a matematica duas metades mortas parecem um equilibrio justo."
    },
    documents: [
      {
        id: "doc_salomao_ata",
        code: "DOC-01 // REGISTRO JURIDICO",
        title: "Ata do Escriba da Corte: O Julgamento das Duas Maes (970 a.C.)",
        typeLabel: "Cronica Forense Real",
        dateLabel: "Mes de Zive, 970 a.C. — Patio das Colunatas, Jerusalem",
        summary:
          "Transcricao literal do julgamento em que duas maes sem testemunhas disputam uma unica crianca viva apos a morte acidental de um dos recem-nascidos na mesma residencia.",
        fullText:
          "O escriba da corte registra: \"A primeira mulher declarou sob juramento que ambas deram a luz com tres dias de diferenca na mesma casa sem testemunhas. Durante a madrugada, a outra sufocou o proprio filho ao dormir e trocou as criancas no escuro. A segunda mulher negou imediatamente, afirmando ser ela a mae legitima do vivo. Sem certidoes de nascimento, marcas de sangue ou vizinhos que pudessem depor, a corte deitou um impasse absoluto sobre a soberania dos fatos.\"",
        clues: [
          {
            id: "clue_salomao_duasmaes",
            title: "Ausencia Absoluta de Registros Formais",
            excerpt:
              "\"Sem certidoes de nascimento, marcas de sangue ou vizinhos que pudessem depor, a corte deitou um impasse absoluto.\"",
            analysisNote:
              "Ponto Cego Material: A burocracia contabil do reino nao possuia nenhum mecanismo objetivo para autenticar a maternidade.",
            category: "cronologia",
            xpReward: 40
          },
          {
            id: "clue_salomao_sentenca",
            title: "A Ordem da Lamina Mecanica",
            excerpt:
              "\"Tragam uma espada e partam a crianca viva em duas partes; deem metade a uma e metade a outra.\"",
            analysisNote:
              "A simulacao do calculo distributivo perfeito: uma divisao matematica exata que resultaria na destruicao irreversivel do ser vivo.",
            category: "logistica",
            xpReward: 35
          }
        ]
      },
      {
        id: "doc_salomao_intendencia",
        code: "DOC-02 // REGISTRO FISCAL",
        title: "Tabua Fiscal das Doze Intendencias de Israel",
        typeLabel: "Inventario Tributario Centralizado",
        dateLabel: "Ano 4 do Reinado de Salomao — Tesouro Real",
        summary:
          "Demonstrativo da partilha administrativa do territorio em doze distritos, cada um obrigado a suprir a corte e as obras monumentais por exatamente um mes do ano.",
        fullText:
          "Os doze intendentes do rei forneciam provisoes para o palacio com rigor metrico: trinta coros de flor de farinha e sessenta coros de farinha comum por dia, dez bois cevados, vinte bois de pasto e cem ovelhas. Qualquer desvio na cota resultava em inspecao armada. A centralizacao total da riqueza em Jerusalem impunha um modelo matematico de exatidao que desconsiderava a variabilidade das colheitas de cada cla.",
        clues: [
          {
            id: "clue_salomao_fisco",
            title: "Centralizacao Metrica Absoluta da Informacao",
            excerpt:
              "\"Os doze intendentes forneciam provisoes com rigor metrico... Qualquer desvio na cota resultava em inspecao armada.\"",
            analysisNote:
              "O reino dependia de tabelas matematicas rigidas de suprimento, onde a eficiencia numerica era a medida suprema de estabilidade.",
            category: "logistica",
            xpReward: 45
          },
          {
            id: "clue_salomao_custo_reino",
            title: "A Fragilidade do Equilibrio Centralizado",
            excerpt:
              "\"A centralizacao total da riqueza impunha um modelo que desconsiderava a variabilidade das colheitas.\"",
            analysisNote:
              "Indicio de fissura sistemica: a rigidez do controle orcamentario comecou a afastar o centro decisor da realidade vivida pelas tribos perifericas.",
            category: "contradicao",
            xpReward: 50
          }
        ]
      },
      {
        id: "doc_salomao_renuncia",
        code: "DOC-03 // EVIDENCIA TESTEMUNHAL",
        title: "Depoimento da Mae Verdadeira e da Reclamante",
        typeLabel: "Registro de Reacao Psicologica",
        dateLabel: "Patio das Sentencas, Jerusalem",
        summary:
          "Registro da reacao espontanea e assimetrica de ambas as mulheres no instante em que o soldado desembainhou a espada sobre a crianca.",
        fullText:
          "No instante em que a lamina brilhou na mao do guarda, a primeira mulher clamou ao rei, com as entranhas comovidas por seu filho: \"Por favor, meu senhor! Deem-lhe a crianca viva! Nao a matem de modo algum!\" A outra mulher, no entanto, declarou em voz firme diante da multidao: \"Nao seja nem meu nem teu; dividam-na ao meio!\" O rei entao ordenou: \"Nao matem o menino. Entreguem-no a mulher que pediu por sua vida. Ela e a verdadeira mae.\"",
        clues: [
          {
            id: "clue_salomao_renuncia_amor",
            title: "A Renuncia para Salvar o que Esta Vivo",
            excerpt:
              "\"Por favor, meu senhor! Deem-lhe a crianca viva! Nao a matem de modo algum!\"",
            analysisNote:
              "CONTRADICAO COM O CALCULO DE PODER: Quem tem compromisso com a vida aceita perder a posse antes de consentir com a destruicao do bem.",
            category: "contradicao",
            xpReward: 65,
            isContradiction: true
          },
          {
            id: "clue_salomao_falsa_mae",
            title: "O Calculo Igualitario da Destruicao",
            excerpt:
              "\"Nao seja nem meu nem teu; dividam-na ao meio!\"",
            analysisNote:
              "A falsa mae abraca o criterio da simetria estrita: se ela nao pode reter o ganho, prefere que ambos sofram a perda completa.",
            category: "mapa",
            xpReward: 40
          }
        ]
      },
      {
        id: "doc_salomao_strata",
        code: "DOC-04 // ARQUIVO RESTRITO STRATA",
        title: "Prontuario Fundacional de Joao Avelar (Arquivo Zero, 1989)",
        typeLabel: "Dossie Epistemologico Confidencial",
        dateLabel: "Sao Paulo — Banco Central / Subnivel da Strata (Manuscrito)",
        summary:
          "Carta de Joao Avelar escondida na escrivaninha de marcenaria de Santa Cecilia explicando por que ocultou o caso inaugural de Jerusalem dos computadores corporativos.",
        fullText:
          "Anotacao de Joao Avelar: \"Passei quarenta anos ajudando a catalogar o medo humano em arquivos secretos. Quando vi os primeiros computadores transformarem aquelas pastas em formulas automaticas de corte de risco, compreendi o tamanho do nosso engano. Uma maquina programada apenas para fechar a conta sempre vai mandar partir a crianca ao meio, porque para a matematica duas metades mortas parecem um equilibrio justo. Foi por isso que escondi este primeiro arquivo deles. Eles queriam a espada da previsao; nunca quiseram a renuncia da mae.\"",
        clues: [
          {
            id: "clue_salomao_maquina_espada",
            title: "A Falha Inerente do Algoritmo Cego",
            excerpt:
              "\"Uma maquina programada apenas para fechar a conta sempre vai mandar partir a crianca ao meio, porque para a matematica duas metades mortas parecem um equilibrio justo.\"",
            analysisNote:
              "PRINCIPIO ESTRUTURAL DO LIVRO: A pura otimizacao matematica destroi a integridade moral dos sistemas se privada do discernimento etico humano.",
            category: "opcional",
            xpReward: 70
          },
          {
            id: "clue_salomao_padrao_fundacional",
            title: "A Transmissao do Dilema atraves dos Milenios",
            excerpt:
              "\"Quem ama o que esta vivo aceita perder o cargo, o lucro ou a disputa antes de deixar a lamina descer. Quem ama apenas o proprio poder diz: dividam ao meio.\"",
            analysisNote:
              "A raiz do padrao investigativo que conecta Salomao a Cesar, Napoleao, Turing e a revolucao monetaria de 2008.",
            category: "logistica",
            xpReward: 55
          }
        ]
      }
    ],
    connectionChallenges: [
      {
        id: "conn_salomao_1",
        stepNumber: 1,
        question:
          "Por que uma logica estritamente contabil ou algoritmica falharia em resolver o impasse do julgamento de Salomao e acabaria por destruir o objeto de valor?",
        promptHint:
          "Conecte a atitude de renuncia da mae autentica (DOC-03) com a reflexao epistemologica sobre a maquina e a espada de Joao Avelar (DOC-04).",
        requiredClueIds: ["clue_salomao_renuncia_amor", "clue_salomao_maquina_espada"],
        successTitle: "Vinculo Epistemologico Validado: A Assimetria da Renuncia",
        successConclusion:
          "Voce comprovou a tese central do Arquivo Zero: Salomao nao utilizou a lamina para dividir materialmente o recurso, mas para criar uma simulacao extrema que forcou a revelacao da verdade. Uma logica meramente distributiva assume que o compromisso de 50% e equitativo, quando na realidade destroi a vida tutelada.",
        errorFeedback:
          "Inconsistencia de analise: Selecione a pista que revela a disposicao da mae verdadeira em perder o filho para mante-lo vivo (DOC-03) e a nota de Joao Avelar sobre o vies da maquina diante do corte (DOC-04).",
        xpReward: 120,
        unlocksMapConnections: true
      }
    ],
    hypothesisTheses: [
      {
        id: "thesis_salomao_sabedoria",
        tag: "TESE ALPHA (HUMANISTA)",
        title: "A Sentenca como Teste Psicologico de Revelacao Moral",
        subtitle: "A espada como instrumento de diagnostico do sacrificio",
        description:
          "Salomao compreendeu que na ausencia de registros documentais previos, a verdade so pode ser descoberta forcando os atores a expressarem o que aceitam sacrificar. O juiz nao partiu a crianca; partiu as aparencias para expor a integridade do coracao.",
        supportingClueIds: ["clue_salomao_renuncia_amor", "clue_salomao_maquina_espada"],
        feedbackStrong:
          "Tese Soberbamente Fundamentada: Voce conectou a essencia do julgamento biblico ao discernimento etico moderno que impede a aniquilacao de ativos essenciais.",
        feedbackPartial:
          "Para sustentar a tese da revelacao moral, vincule a renuncia voluntaria do DOC-03 com a nota de advertencia do Arquivo Zero no DOC-04."
      },
      {
        id: "thesis_salomao_centralizacao",
        tag: "TESE BETA (SISTEMICA)",
        title: "O Custo Oculto da Centralizacao Fiscal Monarquica",
        subtitle: "A hipertrofia burocratica e a fragilidade do modelo das intendencias",
        description:
          "A grandeza salomonica assentava-se sobre um sistema de intendencias rigido que extraia recursos forcados das tribos perifericas. O julgamento representou um espetaculo de autoridade suprema necessario para legitimar uma coroa que comecava a asfixiar a economia de subsistencia.",
        supportingClueIds: ["clue_salomao_fisco", "clue_salomao_custo_reino"],
        feedbackStrong:
          "Leitura Sistemica Agucada: Voce expos como o rigor contabil excessivo cria a necessidade de grandes demonstracoes de legitimidade juridica para conter a insatisfacao popular.",
        feedbackPartial:
          "Associe o recolhimento das doze intendencias fiscais do DOC-02 com os sinais de sobrecarga das tribos perifericas."
      },
      {
        id: "thesis_salomao_simetria",
        tag: "TESE GAMMA (CRITICA)",
        title: "A Falacia do Equilibrio Mecanico no Poder",
        subtitle: "O perigo da equidistancia cega diante do sofrimento humano",
        description:
          "A proposta de cortar a crianca ao meio expoem o perigo mortal das solucoes salomonicas mal interpretadas pela burocracia contemporanea: tentar contentar ambas as partes dividindo danos vitais em partes iguais em vez de tomar partido inequivoco da justica.",
        supportingClueIds: ["clue_salomao_sentenca", "clue_salomao_falsa_mae"],
        feedbackStrong:
          "Tese Alternativa Contundente: Voce identificou a armadilha do centrismo tecnocratico que sacrifica o principio vital para apresentar relatorios de aparente neutralidade.",
        feedbackPartial:
          "Mostre como a proposta literal da espada reflete o desejo da falsa mae de partilhar a ruina de forma perversamente igualitaria."
      }
    ],
    simulationPrompt:
      "Voce atua como arbitro regulador supremo em uma crise sistemica. Duas corporacoes rivais disputam o controle de uma infraestrutura hospitalar vital apos o colapso dos registros de concessao. Uma corporacao aceita paralisar os leitos e liquidar os maquinarios caso nao fique com o monopolio; a outra aceita abrir mao dos lucros operacionais e passar a administracao ao adversario desde que o atendimento a populacao nao seja interrompido por um unico minuto. Como voce decide?",
    simulationChoices: [
      {
        id: "sim_salomao_a",
        tag: "A",
        title: "Liquidacao e Divisao Mecanica 50/50",
        subtitle: "Cumprir a isonomia distributiva padrao dos manuais corporativos",
        description:
          "Determinar o encerramento das operacoes litigiosas e leiloar os equipamentos, distribuindo os valores monetarios resultantes igualmente entre os dois litigantes.",
        consequenceSummary:
          "Voce cumpre o regulamento de aparente imparcialidade fria, mas fecha as portas do servico publico essencial e mata a utilidade viva da infraestrutura.",
        deltaCaos: 22,
        deltaLivreArbitrio: -14,
        deltaPerfil: { analitico: 12, estrategico: -8, humanista: -16, exploratorio: 4 },
        deltaSkills: { leituraEvidencias: 10, reconhecimentoPadroes: 8, raciocinioEstrategico: 6, tomadaDecisao: 12 }
      },
      {
        id: "sim_salomao_b",
        tag: "B",
        title: "Atribuicao Integral a Parte que Renunciou ao Lucro",
        subtitle: "Reconhecer a legitimidade de quem protege a continuidade da vida",
        description:
          "Conceder a operacao definitiva a entidade que aceitou abrir mao do ganho para manter os leitos abertos, banindo a parte que chantageou o sistema com o corte do servico.",
        consequenceSummary:
          "Voce reafirma a primazia da vida sobre os contratos de papel, gerando precedente historico contra condutas predatorias e restaurando a confianca coletiva.",
        deltaCaos: -16,
        deltaLivreArbitrio: 18,
        deltaPerfil: { analitico: 10, estrategico: 14, humanista: 20, exploratorio: 12 },
        deltaSkills: { leituraEvidencias: 18, reconhecimentoPadroes: 16, raciocinioEstrategico: 18, tomadaDecisao: 20 }
      },
      {
        id: "sim_salomao_c",
        tag: "C",
        title: "Intervencao Estatal com Auditoria Compartilhada de Sacrificio",
        subtitle: "Suspender as partes e assumir a gestao direta sob tutela publica",
        description:
          "Impor intervencao regulatoria direta na infraestrutura e exigir contrapartidas financeiras compulsorias de ambas as partes enquanto um conselho independente e constituido.",
        consequenceSummary:
          "Voce protege o servico imediato e ganha tempo investigativo, mas infla a maquina burocratica e abre margem para contestacoes juridicas prolongadas.",
        deltaCaos: -4,
        deltaLivreArbitrio: 6,
        deltaPerfil: { analitico: 16, estrategico: 10, humanista: 10, exploratorio: 8 },
        deltaSkills: { leituraEvidencias: 16, reconhecimentoPadroes: 14, raciocinioEstrategico: 14, tomadaDecisao: 15 }
      }
    ],
    alternativeInterpretations: [
      "Leitura Biblica/Moral: A verdadeira autoridade nao vem da posse de armas ou cetros, mas da capacidade de enxergar o amor autentico onde os olhos comuns veem apenas disputa.",
      "Leitura Economica: O modelo salomonico de doze intendencias fiscais foi o apice da acumulacao central de ouro e trigo, mas semeou o esgotamento que dividiria o reino apos sua morte.",
      "Leitura Cibernetica (Strata): Todo algoritmo de otimizacao cego e um soldado empunhando uma espada: ele sempre propora a media matematica da destruicao se os parametros humanos forem omitidos."
    ],
    connectedTo: ["alexandre", "cesar", "jobs"],
    hypotheses: [
      {
        id: "salomao_a",
        tag: "A",
        title: "Aplicar a Rigidez da Lei Burocratica",
        subtitle: "Ordem Mecanica e Manutencao da Neutralidade Aparente",
        description: "Determinar a particao do recurso em disputa de acordo com o codigo formal estrito.",
        consequence: "Preserva a jurisprudencia estatica, mas destroi o ativo biologico tutelado.",
        deltaCaos: 15,
        deltaLivreArbitrio: -10,
        deltaPerfil: { analitico: 15, estrategico: -5, humanista: -10 }
      },
      {
        id: "salomao_b",
        tag: "B",
        title: "Reconhecer a Renuncia Etica",
        subtitle: "Precedencia do Valor Humano sobre o Registro Contabil",
        description: "Transferir a custodia a quem priorizou a preservacao da vida em detrimento do direito de posse.",
        consequence: "Institui o principio de que o arbitrio humano deve corrigir a cegueira metrica da lei.",
        deltaCaos: -15,
        deltaLivreArbitrio: 20,
        deltaPerfil: { analitico: 10, estrategico: 15, humanista: 25 }
      }
    ]
  },

  // ==========================================
  // CASO 002: ALEXANDRE (326 a.C. // RIO HIFASIS)
  // ==========================================
  {
    id: "alexandre",
    name: "Alexandre, o Grande",
    fullName: "Alexandre e o Limite do Impeto",
    year: "326 a.C.",
    timelineLabel: "326 a.C. Rio Hifasis",
    location: "Vale do Rio Hifasis (Beas) — India",
    era: "antiguidade",
    coords: { x: 74, y: 40 },
    geoCoords: { x: 67.2, y: 36.8 },
    image: alexandreImg,
    dossierCover: "/dossiers/field_simulation_3d_clean.webp",
    status: "disponivel",
    isVolumeOne: true,
    missionCode: "CASO 002 // ARQUIVO 01",
    missionTitle: "A FRONTEIRA DO MUNDO CONHECIDO",
    title: "Alexandre e o Limite do Impeto",
    subtitle: "326 a.C. — India // Margens do Rio Hifasis",
    shortDescription:
      "Sob as moncoes incessantes do Punjab, as falanges macedonias se recusaram a cruzar o ultimo rio em direcao ao Ganges. Investigue o motim silencioso e o momento exato em que a expansao de um imperio esbarrou na exaustao fisica e logistica de homens que ja haviam marchado mais de 27.000 quilometros.",
    missionBullets: [
      "Inspecionar os diarios de campanha e os registros climaticos das moncoes do Punjab.",
      "Analisar a fala do general Coeno e a quebra da cadeia de comando diante da saturacao psicologica.",
      "Comprovar o limite termodinamico da expansao continua antes de ordenar o retorno historico."
    ],
    evidence: {
      title: "Arquivo do Caso 002 — Margens do Rio Hifasis",
      artifactCode: "DOC-HYPHASIS-326BC-01",
      locationSubtitle: "COORDENADAS HISTORICAS: 31°30′N 75°12′E // VALE DO RIO BEAS, PUNJAB",
      parchmentNote:
        "A chuva continua transformou o acampamento num pantano de lama e doencas. Os escudos de bronze estavam amolgados, os cascos dos cavalos apodreciam com a umidade e as falanges macedonias se sentavam em silencio em volta das cinzas molhadas.",
      confidentialTelemetry:
        "REGISTRO DO ESTADO-MAIOR: Pela primeira vez em dez anos de campanha ininterrupta, os oficiais veteranos se recusaram a seguir a ordem direta de marcha para o leste."
    },
    documents: [
      {
        id: "doc_alexandre_diario",
        code: "DOC-01 // DIARIO DE OPERACOES",
        title: "Registro de Marcha do Estado-Maior Macedonio",
        typeLabel: "Diario de Campanha Primario",
        dateLabel: "Julho de 326 a.C. — Margem Ocidental do Rio Hifasis",
        summary:
          "Notas do intendente de campanha detalhando o impacto de 70 dias ininterruptos de moncoes sobre o equipamento de bronze, os suprimentos de trigo e a moral do exercito.",
        fullText:
          "Setenta dias se passaram desde que adentramos esta planicie e o ceu nao concedeu uma unica hora de sol claro. As aguas sobem alem das margens. As armaduras de ferro oxidam rapidamente, as correias de couro das sandalias apodrecem nos pes dos soldados e os dardos de madeira empenaram com a umidade excessiva. Os homens permanecem acordados dentro das tendas inundadas, sem fogo para aquecer o pao.",
        clues: [
          {
            id: "clue_alexandre_chuvas",
            title: "70 Dias Consecutivos de Moncoes Torrenciais",
            excerpt:
              "\"Setenta dias se passaram... As armaduras de ferro oxidam rapidamente e as correias de couro apodrecem nos pes dos soldados.\"",
            analysisNote:
              "Degradacao Material Critica: O ambiente fisico atingiu o ponto de inviabilidade tecnica de sustentacao do equipamento militar.",
            category: "logistica",
            xpReward: 40
          },
          {
            id: "clue_alexandre_armas",
            title: "Falencia Operacional do Equipamento das Falanges",
            excerpt:
              "\"Os cascos dos cavalos apodrecem com a umidade e os dardos de madeira empenaram.\"",
            analysisNote:
              "A superioridade tatica dos macedonios foi anulada pelo desgaste termodinamico do terreno.",
            category: "logistica",
            xpReward: 35
          }
        ]
      },
      {
        id: "doc_alexandre_coeno",
        code: "DOC-02 // TESTEMUNHO POLITICO",
        title: "Discurso Transcrito do General Coeno diante de Alexandre",
        typeLabel: "Ata de Deliberacao Militar",
        dateLabel: "Acampamento Real do Hifasis, 326 a.C.",
        summary:
          "O pronunciamento solene de Coeno, filho de Polemocrates, atuando como porta-voz das tropas macedonias exaustas na tenda real de comando.",
        fullText:
          "Coeno deu um passo a frente enquanto os demais generais mantinham os olhos fixos no chao: \"Senhor, se existe algo que nos distingue daqueles que conquistamos, e que sabemos quando a gloria deve ceder a prudencia. Nossos corpos estao feridos, nossas cinzas estao longe da terra natal e os olhos dos veteranos nao procuram mais novos reinos; procuram o reencontro com suas maes e esposas. Nao deseje liderar homens que so marchariam porque foram forcados, pois a coragem de um soldado coagido nao vence batalhas.\"",
        clues: [
          {
            id: "clue_alexandre_motim_silencioso",
            title: "O Motim Silencioso dos Veteranos",
            excerpt:
              "\"Nossos corpos estao feridos... Nao deseje liderar homens que so marchariam porque foram forcados.\"",
            analysisNote:
              "CONTRADICAO ESTRATEGICA: A vontade ferrea do lider soberano colidiu frontalmente com a saturacao moral e psicologica das tropas.",
            category: "contradicao",
            xpReward: 60,
            isContradiction: true
          },
          {
            id: "clue_alexandre_limite_humano",
            title: "A Fronteira Biologica do Imperio",
            excerpt:
              "\"Os olhos dos veteranos nao procuram mais novos reinos; procuram o reencontro com suas maes e esposas.\"",
            analysisNote:
              "O ponto de ruptura onde a promessa de riqueza e prestigio deixa de ter valor de incentivo para os executores da operacao.",
            category: "cronologia",
            xpReward: 45
          }
        ]
      },
      {
        id: "doc_alexandre_mapa",
        code: "DOC-03 // INTELIGENCIA TATICA",
        title: "Relatorio Cartografico e Rumores do Imperio Nanda",
        typeLabel: "Prontuario de Reconhecimento Geografico",
        dateLabel: "Peninsula Indiana — Al-Biruni / Arriano Reconstituicao",
        summary:
          "Relatorio de batedores persas e indianos detalhando o poderio do reino Magadha e a frota de elefantes de guerra que aguardava alem do rio Ganges.",
        fullText:
          "Interrogatorios dos reis locais confirmam: alem do Hifasis estende-se um deserto de doze dias de marcha que conduz ao caudaloso rio Ganges. Do outro lado aguardam os exercitos do rei Nanda: duzentos mil infantes, oitenta mil cavaleiros, seis mil elefantes de guerra treinados para pisar falanges. As tropas macedonias ouviram os relatos dos mercadores nos acampamentos vizinhos e o panico se alastrou como fogo nas tendas.",
        clues: [
          {
            id: "clue_alexandre_elefantes_nanda",
            title: "Assimetria Tatica dos Elefantes de Guerra no Ganges",
            excerpt:
              "\"Do outro lado aguardam duzentos mil infantes e seis mil elefantes treinados para pisar falanges.\"",
            analysisNote:
              "Informacao assimetrica e de terror psicologico que transformou a relutancia em recusa aberta a continuar.",
            category: "mapa",
            xpReward: 50
          },
          {
            id: "clue_alexandre_desconexao_base",
            title: "Linha Logistica Estendida por Mais de 25.000 km",
            excerpt:
              "\"Alem do Hifasis estende-se um deserto de doze dias... longe da Grecia e dos centros de reposicao.\"",
            analysisNote:
              "A vulnerabilidade extrema da cadeia de suprimento: uma unica derrota alem do Hifasis exterminaria todo o exercito sem possibilidade de socorro.",
            category: "logistica",
            xpReward: 45
          }
        ]
      },
      {
        id: "doc_alexandre_strata",
        code: "DOC-04 // RELATORIO ANALITICO STRATA",
        title: "Dossie Strata de Riscos Sistemicos: Serie 326 a.C.",
        typeLabel: "Analise de Teoria de Decisao Estrategica",
        dateLabel: "Consultoria Strata — Sao Paulo / Londres",
        summary:
          "Estudo de conformidade corporativa comparando a parada no Hifasis com a incapacidade de organizacoes modernas de reconhecerem quando o ciclo de crescimento atingiu o topo.",
        fullText:
          "Anotacao na margem do Arquivo 01: \"HIFASIS — 326 A.C. // OBSERVAR ANTES DA MUDANCA. Alexandre permaneceu fechado em sua tenda por tres dias inteiros, esperando que a tropa mudasse de ideia por vergonha. Quando percebeu que o silencio do acampamento era inabalavel, sacrificou aos deuses em busca de pressagios desfavoraveis que lhe permitissem anunciar a retirada sem admitir a derrota aos olhos dos homens. O maior genio militar da Antiguidade precisou criar uma justificativa ritualistica para obedecer a realidade material.\"",
        clues: [
          {
            id: "clue_alexandre_ponto_inflexao",
            title: "O Ponto de Inflexao da Expansao Sistemica",
            excerpt:
              "\"Alexandre sacrificou aos deuses em busca de pressagios desfavoraveis que lhe permitissem anunciar a retirada sem admitir a derrota.\"",
            analysisNote:
              "A criacao de uma narrativa de saida honrosa quando a estrutura interna nao suporta mais o plano original do tomador de decisao.",
            category: "opcional",
            xpReward: 65
          },
          {
            id: "clue_alexandre_fronteira_logistica",
            title: "A Subordinacao do Lider aos Fatos Materiais",
            excerpt:
              "\"O maior genio militar da Antiguidade precisou criar uma justificativa ritualistica para obedecer a realidade material.\"",
            analysisNote:
              "A licao fundacional: quando a autoridade tenta dobrar as leis da fisica e da biologia pelo peso da vontade, ela e forcada a capitular.",
            category: "logistica",
            xpReward: 55
          }
        ]
      }
    ],
    connectionChallenges: [
      {
        id: "conn_alexandre_1",
        stepNumber: 1,
        question:
          "Qual choque fundamental entre as condicoes materiais e a coesao de comando determinou a interrupcao da marcha de Alexandre no Rio Hifasis?",
        promptHint:
          "Relacione o desgaste extremo das armas e o clima de 70 dias de chuvas (DOC-01) com a firme recusa verbal dos soldados liderados por Coeno (DOC-02).",
        requiredClueIds: ["clue_alexandre_chuvas", "clue_alexandre_motim_silencioso"],
        successTitle: "Vinculo Estrategico Validado: O Limite da Elasticidade Humana",
        successConclusion:
          "Voce desvendou a mecanica do impasse no Hifasis: nao foram os exercitos indianos que detiveram Alexandre, mas a constatacao de que a degradacao fisica dos equipamentos e o colapso emocional dos soldados tornavam qualquer avanco posterior um ato de autofagia militar irremediavel.",
        errorFeedback:
          "Inconsistencia de analise: Selecione a evidencia material de 70 dias de chuvas torrenciais (DOC-01) e o testemunho de Coeno sobre a recusa em combater por pura coercao (DOC-02).",
        xpReward: 120,
        unlocksMapConnections: true
      }
    ],
    hypothesisTheses: [
      {
        id: "thesis_alexandre_termodinamica",
        tag: "TESE ALPHA (LOGISTICA)",
        title: "A Exaustao da Cadeia de Suprimentos e Degradacao Material",
        subtitle: "O colapso da capacidade de manutencao de campo a 25.000 km da base",
        description:
          "A interrupcao no Hifasis foi motivada prioritariamente pelo esgotamento fisico irrecuperavel do armamento e da integridade sanitaria da tropa. A expansao atingiu sua fronteira termodinamica inegociavel.",
        supportingClueIds: ["clue_alexandre_chuvas", "clue_alexandre_armas"],
        feedbackStrong:
          "Tese Soberbamente Fundamentada: Voce provou com base nos diarios primarios que a fisica e a biologia derrotaram o impeto imperial antes de qualquer embate no Ganges.",
        feedbackPartial:
          "Para reforcar esta hipotese material, conecte as chuvas de moncao as avarias de armas descritas no DOC-01."
      },
      {
        id: "thesis_alexandre_motim",
        tag: "TESE BETA (POLITICA)",
        title: "A Ruptura do Contrato Social da Falange Macedonia",
        subtitle: "A crise de legitimidade entre a visao do monarca e os objetivos dos homens",
        description:
          "Os soldados macedonios ja haviam vingado a Persia e acumulado espolios sem precedentes. O plano de avancar ate os mares orientais pertencia exclusivamente a ambicao pessoal de Alexandre, que perdeu o consentimento de seus veteranos.",
        supportingClueIds: ["clue_alexandre_motim_silencioso", "clue_alexandre_limite_humano"],
        feedbackStrong:
          "Excelente Analise Institucional: Voce identificou a quebra do pacto tacito de comando quando a meta da lideranca se descola do proposito compartilhado da organizacao.",
        feedbackPartial:
          "Anexe o discurso de Coeno do DOC-02 e o ponto sobre a saciedade de gloria das falanges."
      },
      {
        id: "thesis_alexandre_psicologica",
        tag: "TESE GAMMA (ASSIMETRIA)",
        title: "O Efeito Dissuasorio da Inteligencia sobre o Imperio Nanda",
        subtitle: "A percepcao do risco assimetrico dos seis mil paquidermes de guerra",
        description:
          "Os relatos de batedores sobre a imensidao do exercito Nanda no Ganges funcionaram como o detonador psicologico que converteu a fadiga acumulada em panico coletivo insuperavel.",
        supportingClueIds: ["clue_alexandre_elefantes_nanda", "clue_alexandre_desconexao_base"],
        feedbackStrong:
          "Leitura Tatica Perspicaz: Voce apontou como a informacao de risco incomensuravel paralisa ate as tropas mais experientes do planeta.",
        feedbackPartial:
          "Combine a estimativa de forcas no rio Ganges (DOC-03) com a distancia de retorno a Grecia."
      }
    ],
    simulationPrompt:
      "Voce e o executivo de inovacao de um projeto hiper-escalado que alcancou sucesso estrondoso no mercado global, mas sua equipe de engenharia central trabalhou 80 horas por semana nos ultimos dez meses ininterruptos. A diretoria quer abrir uma nova frente operacional em um mercado emergente desconhecido que dobraria os lucros se der certo, mas ha relatorios claros de turnover iminente e colapso de infraestrutura tecnica. Qual caminho voce ordena?",
    simulationChoices: [
      {
        id: "sim_alexandre_a",
        tag: "A",
        title: "Interromper a Marcha e Consolidar os Territorios Ja Conquistados",
        subtitle: "Preservar os homens e consolidar a governanca dos ativos existentes",
        description:
          "Suspender a expansao rumo ao novo mercado, erguer estruturas de defesa e dedicar os proximos 12 meses a regeneracao das equipes e estabilizacao do produto existente.",
        consequenceSummary:
          "Voce assegura a sobrevivencia a longo prazo da empresa e evita o colapso catastrofico das equipes, aceitando que a fatia de mercado adicional sera disputada no futuro.",
        deltaCaos: -14,
        deltaLivreArbitrio: 16,
        deltaPerfil: { analitico: 16, estrategico: 14, humanista: 18, exploratorio: 6 },
        deltaSkills: { leituraEvidencias: 16, reconhecimentoPadroes: 18, raciocinioEstrategico: 18, tomadaDecisao: 16 }
      },
      {
        id: "sim_alexandre_b",
        tag: "B",
        title: "Exigir o Salto Final Prometendo Bonus Exorbitantes",
        subtitle: "Tentar vencer o limite da fadiga com compensacoes materiais extremas",
        description:
          "Pressionar o time a entregar mais uma arrancada de seis meses, oferecendo remuneracao extraordinaria e participacao acionaria agressiva a quem permanecer ate o lancamento.",
        consequenceSummary:
          "Voce pode atingir um pico momentaneo de entrega, mas gera debandada em massa dos talentos insubstituiveis e quebra o produto por falha estrutural de suporte.",
        deltaCaos: 20,
        deltaLivreArbitrio: -10,
        deltaPerfil: { analitico: 8, estrategico: 16, humanista: -12, exploratorio: 14 },
        deltaSkills: { leituraEvidencias: 12, reconhecimentoPadroes: 10, raciocinioEstrategico: 14, tomadaDecisao: 12 }
      },
      {
        id: "sim_alexandre_c",
        tag: "C",
        title: "Fracionar a Operacao e Delegar o Avanco a uma Forca Voluntaria",
        subtitle: "Liberar os veteranos exaustos e avancar com uma subsidiaria autonoma",
        description:
          "Permitir que os funcionarios cansados regressem as rotinas estaveis e recrutar parceiros locais e uma equipe enxuta para explorar o novo mercado em ritmo experimental.",
        consequenceSummary:
          "Voce mantem o canal de inovacao aberto sem colocar em risco a integridade do nucleo da companhia, aprendendo a operar de forma distribuida.",
        deltaCaos: 4,
        deltaLivreArbitrio: 12,
        deltaPerfil: { analitico: 12, estrategico: 12, humanista: 10, exploratorio: 16 },
        deltaSkills: { leituraEvidencias: 14, reconhecimentoPadroes: 15, raciocinioEstrategico: 16, tomadaDecisao: 15 }
      }
    ],
    alternativeInterpretations: [
      "Leitura Historiografica: A parada no Hifasis salvou o exercito de Alexandre de um massacre inevitavel contra as frotas de elefantes e arqueiros do vale do Ganges.",
      "Leitura de Lideranca: A grandeza de um lider nao reside apenas em saber acelerar, mas em ter a coragem de aceitar o recuo quando as premissas operacionais da realidade fisica se impoem.",
      "Leitura Sistemica (Strata): Todo crescimento desprovido de tempo de ancoragem consome sua propria base de sustentacao ate ser parado pela greve silenciosa de seus executores."
    ],
    connectedTo: ["salomao", "cesar"],
    hypotheses: [
      {
        id: "alexandre_a",
        tag: "A",
        title: "Obedecer ao Limite dos Homens e Retornar",
        subtitle: "Preservacao da Forca Viva e Consolidacao dos Espolios",
        description: "Construir os doze altares na margem do rio e ordenar o recuo das legioes macedonias.",
        consequence: "Garante o retorno do nucleo do exercito, embora encerre o sonho de alcancar o Oceano Oriental.",
        deltaCaos: -10,
        deltaLivreArbitrio: 15,
        deltaPerfil: { analitico: 15, estrategico: 15, humanista: 20 }
      },
      {
        id: "alexandre_b",
        tag: "B",
        title: "Forcar a Travessia a Qualquer Preco",
        subtitle: "Imposicao Absoluta da Vontade sobre a Fadiga",
        description: "Castigar a insubordinacao de Coeno e marchar com as tropas descontentes contra o reino Nanda.",
        consequence: "Desencadeia uma rebeliao armada no interior do exercito e a fragmentacao precoce do imperio.",
        deltaCaos: 30,
        deltaLivreArbitrio: -15,
        deltaPerfil: { analitico: 5, estrategico: 10, humanista: -20 }
      }
    ]
  },

  // ==========================================
  // CASO 004: LEONARDO DA VINCI (1490 // MILAO)
  // ==========================================
  {
    id: "da_vinci",
    name: "Leonardo da Vinci",
    fullName: "Leonardo da Vinci e a Arquitetura da Duvida",
    year: "1490",
    timelineLabel: "1490 Milao",
    location: "Milao — Oficina do Castelo Sforzesco",
    era: "moderna",
    coords: { x: 50, y: 32 },
    geoCoords: { x: 51.5, y: 33.2 },
    image: daVinciImg,
    dossierCover: "/dossiers/forensic_analysis_room_3d_clean.webp",
    status: "disponivel",
    isVolumeOne: true,
    missionCode: "CASO 004 // ARQUIVO 05",
    missionTitle: "A PRESERVACAO DA PERGUNTA",
    title: "Leonardo da Vinci e a Arquitetura da Duvida",
    subtitle: "1490 — Milao // Bancada de Mecanica Analogica",
    shortDescription:
      "Em meio aos desenhos de eclusas e pontes moveis para o Duque de Milao, Da Vinci encontra em folhas de contabilidade de mercadores venezianos uma anotacao sobre assimetria de informacao. Investigue como a transmissao analogica de dilemas humanos sobreviveu por seculos sem precisar de uma sociedade secreta formal.",
    missionBullets: [
      "Examinar o Codex com os estudos de ondas de retardo em canais e comportas de navegacao.",
      "Analisar a folha contabil veneziana com o calculo de seguros de carga antes do cerco militar.",
      "Identificar o principio da transmissao continua de enunciados que conectou a Renascenca a era digital."
    ],
    evidence: {
      title: "Arquivo do Caso 004 — Oficina do Castelo Sforzesco",
      artifactCode: "DOC-MILANO-1490-05",
      locationSubtitle: "COORDENADAS HISTORICAS: 45°28′N 09°10′E // CASTELLO SFORZESCO, DUCADO DE MILAO",
      parchmentNote:
        "Sobre a bancada principal de carvalho escuro espalhavam-se folhas de estudo: engrenagens de bronze, comportas de canais, pontes moveis e mecanismos de reducao de atrito. Ao lado da lamparina, repousava uma folha usada comprada de um cartorio de intendencia de Veneza.",
      confidentialTelemetry:
        "NOTA DO ARQUIVISTA: Nao era necessaria uma sociedade secreta viva desde a Antiguidade. A unica coisa que precisava sobreviver de um seculo para o outro era a pergunta."
    },
    documents: [
      {
        id: "doc_davinci_caderno",
        code: "DOC-01 // MANUSCRITO DE ENGENHARIA",
        title: "Caderno de Estudos Hidraulicos e Mecanicos (Codex f. 182r)",
        typeLabel: "Manuscrito Tecnico Primario",
        dateLabel: "Outono de 1490 — Oficina Ducal, Milao",
        summary:
          "Esbocos de Da Vinci analisando o comportamento dos fluxos hidricos e o tempo de retardo entre o fechamento de uma comporta a montante e o efeito sobre os barqueiros a jusante.",
        fullText:
          "Texto em escrita especular: \"A agua que toca a comporta fechada acumula pressao no mesmo instante, mas o barqueiro que navega a tres milhas abaixo nao ve o leito secar senao depois de passado o tempo que a onda de desnivel consome para percorrer o canal. Se ele tentar manobrar quando ja avista a pedra do fundo, seu esforco sera vao: sua quilha batera porque a decisao que lhe tirou a agua foi tomada muito antes de seus olhos a perceberem.\"",
        clues: [
          {
            id: "clue_davinci_onda_comporta",
            title: "A Dinamica da Onda de Retardo em Canais",
            excerpt:
              "\"A decisao que lhe tirou a agua foi tomada muito antes de seus olhos a perceberem... o leito seca apos o tempo de transito.\"",
            analysisNote:
              "PRINCIPIO DO ATRASO DE FEEDBACK: O intervalo temporal entre a causa remota e a consequencia local cria a ilusao de estabilidade nos agentes a jusante.",
            category: "logistica",
            xpReward: 45
          },
          {
            id: "clue_davinci_maquina_invisivel",
            title: "O Reconhecimento da Sociedade como Mecanismo Analogico",
            excerpt:
              "\"Alguem aqui tentou desenhar uma maquina invisivel que opera pelas leis da agua.\"",
            analysisNote:
              "A intuicao pioneira de Da Vinci de que a economia e o poder humano obedecem a principios hidrodinamicos de pressao e retardo.",
            category: "logistica",
            xpReward: 40
          }
        ]
      },
      {
        id: "doc_davinci_conta_veneziana",
        code: "DOC-02 // REGISTRO MERCANTIL",
        title: "Folha Contabil Comprada de Cartorio de Intendencia de Veneza",
        typeLabel: "Documento Financeiro de Epoca",
        dateLabel: "Veneza — Registro Maritimo de Fretes do Levante (1462)",
        summary:
          "Folha reutilizada trazida por um aprendiz contendo tabelas de seguros de trigo e uma anotacao manuscrita em latim inserida na margem por um escrivao desconhecido.",
        fullText:
          "Colunas com despesas de fretes maritimos de cereais e taxas de risco de pirataria no Adriatico. Na margem lateral inferior, gravada com tinta ferrogolica escura, le-se a pergunta em latim: \"Si principis decisio mutatur cum notitia mutatur, quid accidit cum notitia sero pervenit ad eum qui eligere debet?\" (Se a decisao do governante muda quando a informacao muda, o que acontece quando a informacao chega tarde demais para quem precisa escolher?)",
        clues: [
          {
            id: "clue_davinci_pergunta_margem",
            title: "A Pergunta da Margem sobre Assimetria de Informacao",
            excerpt:
              "\"Se a decisao do governante muda quando a informacao muda, o que acontece quando a informacao chega tarde demais?\"",
            analysisNote:
              "CONTRADICAO FUNDAMENTAL: A autoridade acredita que decide livremente, mas esta na realidade presa a defasagem e distorcao dos canais de dados que a alimentam.",
            category: "contradicao",
            xpReward: 65,
            isContradiction: true
          },
          {
            id: "clue_davinci_preco_trigo_boato",
            title: "Antecipacao dos Precos antes do Conflito Oficial",
            excerpt:
              "\"Tabela de fretes e seguros que variavam semanas antes do anuncio publico de cerco dos portos.\"",
            analysisNote:
              "Os fluxos de capital e frete funcionavam como sensores empiricos da verdade muito antes dos editais governamentais.",
            category: "cronologia",
            xpReward: 40
          }
        ]
      },
      {
        id: "doc_davinci_instrucao_aprendiz",
        code: "DOC-03 // REGISTRO DE ATELIE",
        title: "Apontamento ao Jovem Aprendiz sobre Preservacao do Enunciado",
        typeLabel: "Instrucao Pessoal de Mestre",
        dateLabel: "Oficina do Castelo Sforzesco, 1490",
        summary:
          "Instrucao ditada por Leonardo ao aprendiz sobre a transcricao da pergunta da margem veneziana para as primeiras paginas de seus cadernos limpos.",
        fullText:
          "O jovem aprendiz perguntou: \"Mestre, e algum tratado importante? Copio a tabela inteira de tributos?\" Leonardo respondeu: \"Copie apenas a pergunta da margem. So a pergunta. E anote no canto onde voce comprou esse papel e a data de hoje. Porque amanha alguem pode querer saber por onde essa duvida passou. E se ninguem perguntar amanha, talvez alguem pergunte daqui a cem anos.\"",
        clues: [
          {
            id: "clue_davinci_transmissao_pergunta",
            title: "A Preservacao do Enunciado em Vez da Resposta Falsa",
            excerpt:
              "\"Copie apenas a pergunta da margem. So a pergunta... porque amanha alguem pode querer saber por onde essa duvida passou.\"",
            analysisNote:
              "METODO HISTORICO DE TRANSMISSAO: Da Vinci sabia que as respostas das epocas se tornam obsoletas, mas o enunciado dos dilemas permanece eterno.",
            category: "logistica",
            xpReward: 50
          },
          {
            id: "clue_davinci_horizonte_cem_anos",
            title: "A Visao Temporal de Longa Duracao",
            excerpt:
              "\"E se ninguem perguntar amanha, mestre? Entao talvez alguem pergunte daqui a cem anos.\"",
            analysisNote:
              "A consciencia de que o conhecimento estrutural se comunica entre mentes distantes no tempo sem necessidade de ordens hierarquicas imediatas.",
            category: "opcional",
            xpReward: 45
          }
        ]
      },
      {
        id: "doc_davinci_strata",
        code: "DOC-04 // MEMORANDO HISTORIOGRAFICO STRATA",
        title: "Auditoria Strata: Da Transmissao Difusa a Centralizacao (1998)",
        typeLabel: "Dossie Epistemologico de Inteligencia",
        dateLabel: "Arquivo de Pesquisa Historica da Strata — Sao Paulo",
        summary:
          "Sintese de Caio e Marina sobre a cadeia de custodia da folha renascentista ate o seculo XVIII e o perigo de falseamento por ilusao de conspiracao unificada.",
        fullText:
          "Caio fechou o volume de transcricoes: \"Aquelas pessoas passavam longe de preservar um plano mestre. Elas preservavam o enunciado do problema. Uma pessoa encontrava a anotacao num arquivo morto, reconhecia a logica na crise do proprio tempo, acrescentava uma observacao na margem e deixava para o proximo. Nunca foi necessario existir uma sociedade secreta viva desde a epoca de Da Vinci. A unica coisa que precisava sobreviver de um seculo para o outro era a pergunta.\"",
        clues: [
          {
            id: "clue_davinci_rede_descentralizada",
            title: "A Transmissao Sem Linha de Comando Central",
            excerpt:
              "\"Aquelas pessoas passavam longe de preservar um plano mestre. Elas preservavam o enunciado do problema.\"",
            analysisNote:
              "A rede de transmissao historica funcionou como um protocolo descentralizado de ideias, imune a destruicao de um no central.",
            category: "mapa",
            xpReward: 60
          },
          {
            id: "clue_davinci_erro_da_sintese",
            title: "O Risco da Ilusao Teleologica nos Arquivos",
            excerpt:
              "\"Qualquer pessoa que tenta costurar seculos de anotacoes alheias corre o risco imediato de enxergar intencao onde so existia repeticao de estrutura.\"",
            analysisNote:
              "ADVERTENCIA PERICIAL CRITICA: Os analistas tendem a inventar conspiracoes deliberadas onde ha apenas convergencia natural de dilemas humanos sob restricao.",
            category: "contradicao",
            xpReward: 55
          }
        ]
      }
    ],
    connectionChallenges: [
      {
        id: "conn_davinci_1",
        stepNumber: 1,
        question:
          "Como o estudo de dinamicas de comportas hidricas de Da Vinci elucida a anotacao contabil veneziana sobre governantes que recebem informacoes tardias?",
        promptHint:
          "Conecte o principio fisico da onda de retardo no leito do canal (DOC-01) com a duvida manuscrita do escrivao veneziano na margem da folha (DOC-02).",
        requiredClueIds: ["clue_davinci_onda_comporta", "clue_davinci_pergunta_margem"],
        successTitle: "Vinculo Epistemologico Validado: A Lei Hidraulica da Informacao",
        successConclusion:
          "Voce desvendou a sintese renascentista: tanto nos canais de irrigacao quanto nas redes de governo, a distancia temporal entre o evento e o feedback produz cegueira funcional. Quando o governante finalmente age, as condicoes que tornavam sua ordem eficaz ja deixaram de existir.",
        errorFeedback:
          "Inconsistencia de analise: Combine o estudo da onda de retardo na comporta (DOC-01) com a interrogacao latina sobre a decisao tardia do governante (DOC-02).",
        xpReward: 120,
        unlocksMapConnections: true
      }
    ],
    hypothesisTheses: [
      {
        id: "thesis_davinci_retardo",
        tag: "TESE ALPHA (SISTEMICA)",
        title: "O Retardo Estrutural dos Canais de Decisao",
        subtitle: "A defasagem de feedback como causa principal dos colapsos estatais",
        description:
          "Da Vinci percebeu que as crises politicas e mercantis nao decorrem essencialmente da maldade dos governantes, mas da fisica do transito de dados: a decisao chega ao campo de batalha ou ao mercado quando a onda de consequencias ja quebrou o sistema.",
        supportingClueIds: ["clue_davinci_onda_comporta", "clue_davinci_pergunta_margem"],
        feedbackStrong:
          "Tese Soberbamente Fundamentada: Voce conectou a fisica mecanica a ciencia da computacao e da tomada de decisao sob assimetria.",
        feedbackPartial:
          "Associe o conceito da onda de retardo (DOC-01) com a pergunta marginal de Veneza (DOC-02)."
      },
      {
        id: "thesis_davinci_transmissao",
        tag: "TESE BETA (EPISTEMOLOGICA)",
        title: "A Transmissao Descentralizada da Duvida Cientifica",
        subtitle: "A sobrevivencia dos enigmas atraves de anotacoes marginais autonomas",
        description:
          "A verdadeira forca da heranca cultural humana nao esteve em sociedades hermeticas, mas na capacidade de mentes isoladas transcreverem a pergunta pura na margem de cadernos publicos, permitindo que cada geracao a redescobrisse.",
        supportingClueIds: ["clue_davinci_transmissao_pergunta", "clue_davinci_rede_descentralizada"],
        feedbackStrong:
          "Visao Epistemologica Notavel: Voce demonstrou como o conhecimento livre de dogmas se propaga melhor por meio de perguntas abertas do que por respostas fechadas.",
        feedbackPartial:
          "Relacione o apontamento ao aprendiz no DOC-03 com a conclusao do memorando da Strata no DOC-04."
      },
      {
        id: "thesis_davinci_mercado",
        tag: "TESE GAMMA (ECONOMICA)",
        title: "A Antecipacao de Sinais pelos Mercados Informais",
        subtitle: "A eficiencia dos precos em capturar a realidade antes dos editais formais",
        description:
          "Os livros contabeis de Veneza registravam o encarecimento de seguros antes de qualquer proclamacao ducal, provando que redes mercantis descentralizadas processam a verdade factual mais rapido que os conselhos de Estado.",
        supportingClueIds: ["clue_davinci_preco_trigo_boato", "clue_davinci_maquina_invisivel"],
        feedbackStrong:
          "Leitura Economica Brilhante: Voce identificou a inteligencia agregada de precos livres em contraste com a lentidao dos orgaos burocraticos de comando.",
        feedbackPartial:
          "Vincule a tabela de fretes do Levante do DOC-02 com a analogia da maquina invisivel no DOC-01."
      }
    ],
    simulationPrompt:
      "Voce atua como arquiteto de sistemas e descobre uma anomalia grave: a telemetria do banco central mostra que os juros aplicados nos emprestimos rurais estao defasados em tres semanas em relacao ao indice de quebra de safra, o que causara uma onda em cadeia de falencias bancarias no proximo mes. No entanto, o conselho executivo prefere silenciar o problema para fechar o balanco trimestral com bonus. Como voce age diante dessa comporta de retardo?",
    simulationChoices: [
      {
        id: "sim_davinci_a",
        tag: "A",
        title: "Documentar a Pergunta e a Evidencia em Repositorio Aberto e Auditado",
        subtitle: "Preservar o enunciado do problema com carimbo temporal indelevel",
        description:
          "Registrar o relatorio tecnico completo com todas as formulas de retardo no repositorio geral de conformidade publica, notificando os auditores externos e salvaguardando a pergunta para a posteridade.",
        consequenceSummary:
          "Voce cumpre o dever etico supremo da preservacao da verdade, desarmando a negacao dos diretores e forcando o sistema a corrigir o canal antes que a onda quebre.",
        deltaCaos: -10,
        deltaLivreArbitrio: 18,
        deltaPerfil: { analitico: 18, estrategico: 16, humanista: 14, exploratorio: 14 },
        deltaSkills: { leituraEvidencias: 18, reconhecimentoPadroes: 20, raciocinioEstrategico: 18, tomadaDecisao: 16 }
      },
      {
        id: "sim_davinci_b",
        tag: "B",
        title: "Tentar Forcar uma Intervencao Rapida e Monocratica nos Algoritmos",
        subtitle: "Alterar os parametros nos servidores na calada da noite para estancar a sangria",
        description:
          "Usar suas credenciais de administrador para corrigir as taxas de retardo diretamente no codigo em producao, sem esperar a autorizacao formal do conselho.",
        consequenceSummary:
          "Voce pode evitar um dano financeiro passageiro, mas comete infracao regulatoria grave e sera responsabilizado individualmente por qualquer oscilacao de mercado.",
        deltaCaos: 16,
        deltaLivreArbitrio: -6,
        deltaPerfil: { analitico: 12, estrategico: 8, humanista: -4, exploratorio: 10 },
        deltaSkills: { leituraEvidencias: 14, reconhecimentoPadroes: 12, raciocinioEstrategico: 10, tomadaDecisao: 14 }
      },
      {
        id: "sim_davinci_c",
        tag: "C",
        title: "Submeter o Estudo sob Sigilo aos Grandes Bancos Afetados",
        subtitle: "Vender a consultoria do retardo aos agentes a jusante para lucrar com a crise",
        description:
          "Monetizar a assimetria informacional oferecendo estrategias de hedge para os bancos antes que a quebra de safra se torne publica.",
        consequenceSummary:
          "Voce enriquece no curto prazo explorando a defasagem alheia, mas se torna cumplice ativo da engrenagem que esmaga os produtores rurais.",
        deltaCaos: 25,
        deltaLivreArbitrio: -14,
        deltaPerfil: { analitico: 10, estrategico: 18, humanista: -20, exploratorio: 6 },
        deltaSkills: { leituraEvidencias: 12, reconhecimentoPadroes: 14, raciocinioEstrategico: 14, tomadaDecisao: 10 }
      }
    ],
    alternativeInterpretations: [
      "Leitura Renascentista: Leonardo nunca viu fronteira entre a pintura, a hidraulica e a sociologia; para ele, tudo e movimento continuo de energia sob atrito.",
      "Leitura de Teoria da Informacao: O maior segredo de uma crise nao e o que os homens nao sabem, mas a velocidade com que a realidade ultrapassa a capacidade de resposta dos governos.",
      "Leitura Estrutural (Strata): As perguntas nao morrem porque pertencem a condicao humana; quando um livro e queimado ou um arquivo e apagado, outro olhar desperto reencontra o dilema na calcada da historia."
    ],
    connectedTo: ["joana", "napoleao"],
    hypotheses: [
      {
        id: "davinci_a",
        tag: "A",
        title: "Preservar a Duvida e Transmitir o Enunciado",
        subtitle: "Primazia da Investigacao Cientifica sobre a Conveniencia Politica",
        description: "Transcrever a pergunta da margem e torna-la acessivel aos pensadores dos proximos seculos.",
        consequence: "Garante que o problema do retardo de informacao continue sendo investigado pela humanidade.",
        deltaCaos: -12,
        deltaLivreArbitrio: 22,
        deltaPerfil: { analitico: 20, estrategico: 15, humanista: 15 }
      },
      {
        id: "davinci_b",
        tag: "B",
        title: "Silenciar a Descoberta em Nome da Tranquilidade Ducal",
        subtitle: "Subordinacao da Verdade ao Mecenato dos Sforza",
        description: "Destruir a folha contabil veneziana para nao criar atrito com os intendentes de Milao.",
        consequence: "Preserva os contratos de armas do castelo, mas sela a ignorancia coletiva sobre o colapso iminente.",
        deltaCaos: 20,
        deltaLivreArbitrio: -18,
        deltaPerfil: { analitico: 5, estrategico: -10, humanista: -15 }
      }
    ]
  }
];
