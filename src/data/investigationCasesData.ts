import { EXTENDED_HISTORICAL_NODES } from "./investigationCasesExtended";
import { HistoricalNode } from '../types/investigation';
import cesarImg from '../assets/characters/julio_cesar.webp';
import jobsImg from '../assets/characters/jobs.webp';
import napoleaoImg from '../assets/characters/napoleao.webp';
import turingImg from '../assets/characters/turing.webp';
import cleopatraImg from '../assets/characters/cleopatra.webp';
import joanaImg from '../assets/characters/joana_darc.webp';
import mandelaImg from '../assets/characters/mandela.webp';

const ORIGINAL_HISTORICAL_NODES: HistoricalNode[] = [
  {
    id: 'cesar',
    name: 'Júlio César',
    fullName: 'Júlio César e o Rubicão',
    year: '49 a.C.',
    timelineLabel: '49 a.C. Roma',
    location: 'Roma — Rio Rubicão',
    era: 'antiguidade',
    coords: { x: 64, y: 36 },
    geoCoords: { x: 50.8, y: 34.8 },
    image: cesarImg,
    dossierCover: '/dossiers/dossier_01_rubicon.webp',
    status: 'disponivel',
    isVolumeOne: true,
    missionCode: 'CASO 001 // MISSÃO 01',
    missionTitle: 'O PONTO CEGO DO VENCEDOR',
    title: 'Júlio César e o Rubicão',
    subtitle: '49 a.C. — Roma // Margens do Rio Rubicão',
    shortDescription: 'Na noite de 10 de janeiro de 49 a.C., a 13ª Legião parou diante de um riacho estreito na fronteira da Itália. Identifique quais fatores materiais e informacionais precipitaram a travessia e por que a versão oficial omitiu o impasse.',
    missionBullets: [
      'Abrir e examinar os 4 documentos do arquivo histórico e extrair pistas para o seu Arquivo Pessoal.',
      'Montar e validar as relações de causa e contradição na Mesa de Conexões.',
      'Formular sua hipótese sustentada por evidências e decidir diante do dilema de campo.'
    ],
    evidence: {
      title: 'Arquivo do Caso 001 — Margens do Rubicão',
      artifactCode: 'DOC-STRATA-49BC-01',
      locationSubtitle: 'COORDENADAS HISTÓRICAS: 44°04′N 12°25′E // FRONTEIRA DA GÁLIA CISALPINA',
      parchmentNote: 'Sob o toldo da tenda de campanha, o intendente-chefe conferia as tábuas de cera à luz da lamparina: restavam rações de trigo para apenas 9 dias. Tropas de Pompeu bloqueavam o crédito no sul.',
      confidentialTelemetry: 'OBJETIVO DA MISSÃO: Compare o comunicado do Senado com os registros logísticos de Ravena para descobrir o que realmente forçou a decisão.'
    },
    documents: [
      {
        id: 'doc_senado',
        code: 'DOC-01 // CRONOLOGIA OFICIAL',
        title: 'Ata do Senado Romano (7–9 Jan 49 a.C.)',
        typeLabel: 'Registro Institucional',
        dateLabel: '7 de Janeiro de 49 a.C. — Cúria Hostília, Roma',
        summary: 'Decreto final do Senado exigindo que César entregue o comando imediatamente, sob a premissa pública de que suas tropas estavam abastecidas e seguras em Ravena.',
        fullText: 'Em sessão extraordinária, os cônsules aprovam o Senatus Consultum Ultimum. O relator registra em ata pública que "o procônsul Caio Júlio César dispõe de celeiros cheios em Ravena para manter a 13ª Legião aquartelada durante todo o inverno sem risco à tropa". Qualquer pedido de dilação de prazo será tratado como rebelião aberta contra a República.',
        clues: [
          {
            id: 'clue_senado_inverno',
            title: 'Alegação Oficial de Abastecimento Pleno',
            excerpt: '"O Senado registra que a 13ª Legião dispõe de celeiros cheios em Ravena para aguardar pacificamente todo o inverno."',
            analysisNote: 'Versão pública difundida em Roma para mostrar que César não tinha urgência material.',
            category: 'cronologia',
            xpReward: 40
          },
          {
            id: 'clue_senado_ultimato',
            title: 'Fechamento de Canal Institucional',
            excerpt: '"Qualquer pedido de dilação de prazo será tratado como rebelião aberta, vetando novas audiências aos tribunos."',
            analysisNote: 'Remove a margem jurídica de negociação formal sem desmobilização prévia.',
            category: 'cronologia',
            xpReward: 35
          }
        ]
      },
      {
        id: 'doc_tabuleta',
        code: 'DOC-02 // REGISTRO DE CAMPO',
        title: 'Tabuleta de Cera da Intendência da 13ª Legião',
        typeLabel: 'Evidência Material Primária',
        dateLabel: '9 de Janeiro de 49 a.C., 23h — Acampamento de Ravena',
        summary: 'Inventário físico confidencial de grãos, forragem e soldos assinado pelo intendente-chefe horas antes da marcha para o Rubicão.',
        fullText: 'Contagem física dos silos móveis: restam rações de trigo para exatos 9 dias. As carroças vindas da Gália Transalpina ficaram retidas pelo gelo nos passos do norte. Mercadores da Úmbria informam que agentes ligados a Pompeu arremataram todo o grão disponível ao sul de Ariminum e suspenderam o crédito cambial do acampamento.',
        clues: [
          {
            id: 'clue_trigo_9dias',
            title: 'Inconsistência Crítica: Apenas 9 Dias de Trigo',
            excerpt: '"Contagem física dos silos: restam rações de trigo para exatos 9 dias; comboios do norte retidos pelo gelo."',
            analysisNote: 'CONTRADIÇÃO DETECTADA: Desmente diretamente a ata do Senado (DOC-01) que afirmava haver provisões para todo o inverno.',
            category: 'contradicao',
            xpReward: 60,
            isContradiction: true
          },
          {
            id: 'clue_bloqueio_credito',
            title: 'Estrangulamento de Crédito e Grãos no Sul',
            excerpt: '"Agentes ligados a Pompeu arremataram o grão ao sul de Ariminum e suspenderam o crédito cambial do acampamento."',
            analysisNote: 'Mostra uma ação coordenada de asfixia logística antes do confronto militar.',
            category: 'logistica',
            xpReward: 45
          }
        ]
      },
      {
        id: 'doc_mapa_rubicao',
        code: 'DOC-03 // CARTOGRAFIA TÁTICA',
        title: 'Mapa da Fronteira & Cálculo de Deslocamento',
        typeLabel: 'Levantamento Geográfico',
        dateLabel: '10 de Janeiro de 49 a.C. — Vale do Rubicão',
        summary: 'Mapeamento das distâncias viárias pela Via Flaminia entre Ravena, o Rio Rubicão, Ariminum (Rímini) e Roma.',
        fullText: 'Distância de Ravena a Roma pela Via Flaminia sob inverno: 6 dias a cavalo para ida e 6 dias para retorno. Tempo mínimo para envio de uma última embaixada e retorno da resposta senatorial: 12 a 14 dias. Já a cidade portuária e os armazéns de Ariminum ficam a apenas 1 noite de marcha além do Rubicão.',
        clues: [
          {
            id: 'clue_tempo_embaixada',
            title: 'Janela Temporal Negativa (12 Dias vs. 9 Dias)',
            excerpt: '"Enviar uma última embaixada a Roma exigiria 12 a 14 dias — 3 a 5 dias após o esgotamento total da comida do acampamento."',
            analysisNote: 'Dado crucial: esperar a resposta diplomática significava fome e deserção em massa antes do retorno do mensageiro.',
            category: 'mapa',
            xpReward: 50
          }
        ]
      },
      {
        id: 'doc_strata_nota',
        code: 'DOC-04 // ARQUIVO DA INVESTIGAÇÃO',
        title: 'Nota de Auditoria Strata — "O Ponto Cego"',
        typeLabel: 'Documento Ficcional // Caderno de Caio Avelar',
        dateLabel: 'Arquivo Contemporâneo — São Paulo / Faria Lima',
        summary: 'Anotação de Caio Avelar cruzando o modelo de liquidez de 49 a.C. com outros colapsos históricos registrados no terminal.',
        fullText: 'Quando olhamos apenas para a frase célebre ("Alea jacta est"), caímos no ponto cego do vencedor: achamos que a história foi movida apenas por coragem ou ambição. Mas os números no terminal Strata mostram a mesma assinatura matemática em 1815 (Waterloo) e em 2007 (São Francisco): uma janela de tempo que se fecha antes do prazo de negociação.',
        clues: [
          {
            id: 'clue_padrao_strata',
            title: 'Pista Opcional: Assinatura Recorrente (49 a.C. / 1815 / 2007)',
            excerpt: '"O terminal Strata aponta a mesma equação de restrição temporal em 49 a.C., em Waterloo (1815) e nos bastidores de 2007."',
            analysisNote: 'Pista Bônus: permite vincular o caso do Rubicão a outros dois séculos na Mesa de Conexões.',
            category: 'opcional',
            xpReward: 50,
            isOptional: true
          }
        ]
      }
    ],
    connectionChallenges: [
      {
        id: 'conn_cesar_1',
        stepNumber: 1,
        question: '1. Qual par de evidências comprova uma contradição direta entre a narrativa pública de Roma e a realidade material do acampamento?',
        promptHint: 'Selecione no seu Arquivo Pessoal a alegação oficial do Senado e o registro físico que a desmente.',
        requiredClueIds: ['clue_senado_inverno', 'clue_trigo_9dias'],
        successTitle: 'Contradição Documental Comprovada',
        successConclusion: 'Enquanto a ata pública do Senado afirmava que César tinha trigo para todo o inverno, a tabuleta de intendência registrava apenas 9 dias de ração. A estabilidade alegada em Roma não existia no terreno.',
        errorFeedback: 'Essas duas pistas não formam a contradição direta sobre os estoques de inverno. Compare o que o Senado declarou em ata (DOC-01) com a contagem física dos silos (DOC-02).',
        xpReward: 80
      },
      {
        id: 'conn_cesar_2',
        stepNumber: 2,
        question: '2. Por que a sugestão de recuar e enviar uma última embaixada a Roma tornou-se fisicamente inviável naquela noite?',
        promptHint: 'Relacione o estoque real de sobrevivência da tropa com o tempo geográfico de deslocamento até Roma.',
        requiredClueIds: ['clue_trigo_9dias', 'clue_tempo_embaixada'],
        successTitle: 'Impasse Matemático Identificado (-3 Dias)',
        successConclusion: 'Com apenas 9 dias de trigo e 12 a 14 dias necessários para o retorno de um emissário de Roma, aguardar em Ravena dissolveria a legião por fome antes de qualquer resposta institucional.',
        errorFeedback: 'Para provar a inviabilidade do tempo de espera, você precisa cruzar a duração exata das rações de trigo com o cálculo de dias de viagem até Roma.',
        xpReward: 80
      },
      {
        id: 'conn_cesar_3',
        stepNumber: 3,
        question: '3. Qual relação explica como a pressão externa transformou a fronteira do Rubicão na única saída logística imediata?',
        promptHint: 'Conecte o bloqueio comercial/financeiro imposto ao sul com a descoberta do padrão de restrição temporal.',
        requiredClueIds: ['clue_bloqueio_credito', 'clue_padrao_strata'],
        successTitle: 'Padrão Intertemporal Desbloqueado no Mapa Mundial!',
        successConclusion: 'O estrangulamento de crédito somado ao fechamento da janela de tempo revela um padrão que atravessa os séculos. As conexões com Napoleão (1815) e Steve Jobs (2007) foram reveladas no Mapa Mundial!',
        errorFeedback: 'Vincule a pista sobre o bloqueio de crédito e grãos no sul com a nota de auditoria sobre o padrão recorrente (1815 / 2007).',
        xpReward: 90,
        unlocksMapConnections: true
      }
    ],
    hypothesisTheses: [
      {
        id: 'thesis_cesar_logistica',
        tag: 'Hipótese I',
        title: 'Ruptura Forçada por Asfixia Logística',
        subtitle: 'A decisão nasceu da janela negativa entre suprimentos (9 dias) e diplomacia (12 dias).',
        description: 'César cruzou o Rubicão porque o cerco financeiro e o inverno criaram um relógio biológico irreversível: permanecer na legalidade significava a desintegração da 13ª Legião sem combate.',
        supportingClueIds: ['clue_trigo_9dias', 'clue_tempo_embaixada', 'clue_bloqueio_credito'],
        feedbackStrong: 'Hipótese Sólida e Bem Fundamentada: As provas anexadas demonstram matematicamente que o tempo diplomático excedia o limite físico de abastecimento.',
        feedbackPartial: 'Hipótese Plausível, mas incompleta: Para sustentar a tese de asfixia logística com rigor máximo, é essencial anexar a contagem de 9 dias de trigo e o tempo de 12 dias da embaixada.'
      },
      {
        id: 'thesis_cesar_politica',
        tag: 'Hipótese II',
        title: 'Catalisador Estratégico para Tomada de Poder',
        subtitle: 'A crise de suprimentos era real, mas foi instrumentalizada para legitimar o avanço sobre Roma.',
        description: 'Embora o bloqueio de grãos restringisse o tempo, César utilizou o ultimato do Senado e a escassez iminente para unir a tropa em torno de uma marcha ofensiva que já fazia parte de seu cálculo político.',
        supportingClueIds: ['clue_senado_ultimato', 'clue_bloqueio_credito', 'clue_padrao_strata'],
        feedbackStrong: 'Hipótese Crítica Bem Fundamentada: Mesmo divergindo de uma leitura puramente defensiva, você selecionou evidências que mostram como o fechamento político foi convertido em vantagem estratégica.',
        feedbackPartial: 'Hipótese Interessante, porém pouco ancorada: Anexe o ultimato do Senado ou o bloqueio de crédito para demonstrar o jogo político bilateral.'
      },
      {
        id: 'thesis_cesar_erro',
        tag: 'Hipótese III',
        title: 'Erro de Cálculo Informacional do Senado',
        subtitle: 'Roma operava com dados falsos sobre os celeiros de Ravena e precipitou a guerra sem perceber.',
        description: 'Os senadores acreditavam nas informações de que a 13ª Legião tinha provisões para todo o inverno; ao emitirem o ultimato sem margem de prazo, criaram acidentalmente o gatilho da invasão.',
        supportingClueIds: ['clue_senado_inverno', 'clue_trigo_9dias', 'clue_senado_ultimato'],
        feedbackStrong: 'Hipótese Alternativa Muito Bem Sustentada: Você provou com documentos oficiais que a assimetria de informação entre a Cúria em Roma e a tenda em Ravena precipitou o colapso.',
        feedbackPartial: 'Para defender a tese de falha informacional do Senado, anexe a Ata do Senado (celeiros cheios) em contraste com a Tabuleta de Intendência.'
      }
    ],
    simulationPrompt: 'Você lidera uma operação estratégica auditada. Seus recursos vitais se esgotam em 9 dias, o crédito foi congelado e o protocolo oficial exige uma espera formal de 12 dias que desintegrará sua equipe. Diante desse padrão, qual decisão você toma?',
    simulationChoices: [
      {
        id: 'sim_cesar_a',
        tag: 'A',
        title: 'Manter o Protocolo Institucional e Recuar',
        subtitle: 'Preservar a legalidade estrita mesmo sob risco de colapso interno',
        description: 'Recuar até Ravena, cortar as rações pela metade e enviar a embaixada formal de 12 dias, recusando-se a ser o autor da ruptura.',
        consequenceSummary: 'Você preserva sua integridade jurídica perante o sistema, mas transfere todo o controle do tempo e da sobrevivência do grupo para o adversário.',
        deltaCaos: -12,
        deltaLivreArbitrio: -8,
        deltaPerfil: { analitico: 8, estrategico: -4, humanista: 10, exploratorio: 4 },
        deltaSkills: { leituraEvidencias: 15, reconhecimentoPadroes: 12, raciocinioEstrategico: 10, tomadaDecisao: 15 }
      },
      {
        id: 'sim_cesar_b',
        tag: 'B',
        title: 'Romper a Linha de Restrição Imediatamente',
        subtitle: 'Ação decisiva sob janela de tempo crítica (Salto do Rubicão)',
        description: 'Avançar na madrugada até o primeiro posto de suprimentos antes que a fome paralise a equipe, forçando uma nova mesa de negociação a partir de uma posição de força.',
        consequenceSummary: 'Você salva a capacidade operacional imediata da sua estrutura, mas inaugura um conflito aberto cujas ondas de choque não podem mais ser revertidas.',
        deltaCaos: 18,
        deltaLivreArbitrio: 14,
        deltaPerfil: { analitico: 6, estrategico: 14, humanista: -4, exploratorio: 8 },
        deltaSkills: { leituraEvidencias: 15, reconhecimentoPadroes: 15, raciocinioEstrategico: 20, tomadaDecisao: 18 }
      },
      {
        id: 'sim_cesar_c',
        tag: 'C',
        title: 'Desclassificar a Anomalia e Quebrar o Sigilo',
        subtitle: 'Expor a manipulação logística para abrir uma terceira via',
        description: 'Tornar público o bloqueio clandestino de grãos e a discrepância dos 9 dias perante as cidades vizinhas e os próprios soldados, exigindo abertura imediata dos armazéns sem marchar sobre a capital.',
        consequenceSummary: 'Você desarma a narrativa oficial usando transparência documental, criando uma saída de alto impacto investigativo e menor custo humano.',
        deltaCaos: 4,
        deltaLivreArbitrio: 18,
        deltaPerfil: { analitico: 12, estrategico: 8, humanista: 8, exploratorio: 14 },
        deltaSkills: { leituraEvidencias: 20, reconhecimentoPadroes: 18, raciocinioEstrategico: 15, tomadaDecisao: 16 }
      }
    ],
    alternativeInterpretations: [
      'Leitura Logística: A travessia não foi um ato impulsivo, mas a única resposta matematicamente viável diante de um déficit de 3 dias entre comida e diplomacia.',
      'Leitura Política: O estrangulamento de crédito por aliados de Pompeu buscava forçar César ao erro jurídico, mas subestimou sua velocidade de marcha noturna.',
      'Leitura Sistêmica (O Padrão): Sempre que uma instituição exige um prazo de conformidade maior que a reserva vital do auditado, o próprio protocolo fabrica a ruptura.'
    ],
    connectedTo: ['napoleao', 'jobs'],
    hypotheses: [
      {
        id: 'cesar_a',
        tag: 'A',
        title: 'Manter o Protocolo de Ordem',
        subtitle: 'Submissão ao Senado e Linha Temporal Conservadora',
        description: 'Recuar com a legião até Ravena e despachar nova embaixada aos cônsules.',
        consequence: 'Preserva a institucionalidade republicana imediata, mas transfere o controle do tempo.',
        deltaCaos: -15,
        deltaLivreArbitrio: -10,
        deltaPerfil: { analitico: 20, estrategico: -5, humanista: 15 }
      },
      {
        id: 'cesar_b',
        tag: 'B',
        title: 'Intervir e Forçar a Ruptura',
        subtitle: 'Salto Estratégico sob Restrição Absoluta',
        description: 'Cruzar o Rubicão em armas antes do esgotamento das rações de 9 dias.',
        consequence: 'Desencadeia a ruptura aberta e redefine o centro de poder.',
        deltaCaos: 25,
        deltaLivreArbitrio: 20,
        deltaPerfil: { analitico: 10, estrategico: 25, humanista: -10 }
      }
    ]
  },
  {
    id: 'cleopatra',
    name: 'Cleópatra',
    fullName: 'Cleópatra e o Fim da Dinastia Ptolomaica',
    year: '30 a.C.',
    timelineLabel: '30 a.C. Egito',
    location: 'Alexandria — Egito',
    era: 'antiguidade',
    coords: { x: 63, y: 54 },
    geoCoords: { x: 55.4, y: 42.0 },
    image: cleopatraImg,
    dossierCover: '/reader/assets/chapters/ch06_cleopatra.webp',
    status: 'quarentena',
    isVolumeOne: false,
    missionCode: 'CASO 002 // VOLUME II',
    missionTitle: 'O TESOURO DE ALEXANDRIA',
    title: 'Cleópatra VII e a Queda de Alexandria',
    subtitle: '30 a.C. — Egito // Arquivo Reservado — Volume II',
    shortDescription: 'A última rainha do Nilo em confronto com a expansão imperial de Otaviano. Negociação, tesouro real e o limite da soberania.',
    missionBullets: [
      'Arquivo classificado no compêndio principal.',
      'Liberação programada para a camada de Simulação do Volume II.'
    ],
    evidence: {
      title: 'Arquivo sob Quarentena',
      artifactCode: 'DOC-QUARANTINE-30BC',
      locationSubtitle: 'PALÁCIO REAL DE ALEXANDRIA // ACESSO RESTRITO',
      parchmentNote: 'Documento selado pela auditoria externa.',
      confidentialTelemetry: 'Em quarentena analítica.'
    },
    connectedTo: ['cesar'],
    hypotheses: []
  },
  {
    id: 'joana',
    name: 'Joana d\'Arc',
    fullName: 'Joana d\'Arc e o Cerco de Orléans',
    year: '1429',
    timelineLabel: '1429 França',
    location: 'Orléans — França',
    era: 'idade_media',
    coords: { x: 34, y: 31 },
    geoCoords: { x: 47.0, y: 32.2 },
    image: joanaImg,
    dossierCover: '/reader/assets/chapters/ch08_joana_darc.webp',
    status: 'quarentena',
    isVolumeOne: false,
    missionCode: 'CASO 003 // VOLUME II',
    missionTitle: 'A RUPTURA DE ORLÉANS',
    title: 'Joana d\'Arc e a Virada da Guerra dos Cem Anos',
    subtitle: '1429 — França // Arquivo Reservado — Volume II',
    shortDescription: 'A quebra inesperada do protocolo militar feudal e a retomada de Orléans sob colapso moral do reino francês.',
    missionBullets: [
      'Arquivo classificado no compêndio principal.',
      'Liberação programada para a camada de Simulação do Volume II.'
    ],
    evidence: {
      title: 'Arquivo sob Quarentena',
      artifactCode: 'DOC-QUARANTINE-1429',
      locationSubtitle: 'PORTAS DE ORLÉANS // ACESSO RESTRITO',
      parchmentNote: 'Documento selado pela auditoria externa.',
      confidentialTelemetry: 'Em quarentena analítica.'
    },
    connectedTo: ['cesar'],
    hypotheses: []
  },
  {
    id: 'napoleao',
    name: 'Napoleão',
    fullName: 'Napoleão Bonaparte e Waterloo',
    year: '1815',
    timelineLabel: '1815 Europa',
    location: 'Waterloo — Bélgica',
    era: 'moderna',
    coords: { x: 58, y: 17 },
    geoCoords: { x: 48.6, y: 29.2 },
    image: napoleaoImg,
    dossierCover: '/dossiers/dossier_02_waterloo.webp',
    status: 'disponivel',
    isVolumeOne: true,
    missionCode: 'CASO 004 // MISSÃO 02',
    missionTitle: 'O ATRASO NA LAMA DE WATERLOO',
    title: 'Napoleão e Waterloo',
    subtitle: '18 de Junho de 1815 — Bélgica // Platô de Mont-Saint-Jean',
    shortDescription: 'Quatro horas de espera pela secagem do solo após uma tempestade noturna alteraram o destino da Europa. Investigue os despachos de Grouchy e o colapso de sincronia.',
    missionBullets: [
      'Examinar o boletim meteorológico, o diário de artilharia e os despachos de Grouchy.',
      'Cruzar o atraso das 07h às 11h30 com a marcha oculta dos prussianos de Blücher.',
      'Sustentar sua hipótese sobre o fator determinante da derrota e registrar sua decisão.'
    ],
    evidence: {
      title: '1. Registros da Batalha de Waterloo',
      artifactCode: 'DOC-STRATA-1815-04',
      locationSubtitle: 'COORDENADAS HISTÓRICAS: 50°40′N 4°24′E // FAZENDA LE CAILLOU',
      parchmentNote: 'O comandante de artilharia Drouot advertiu que os canhões de 12 libras afundavam até os eixos no barro. Napoleão adiou o ataque das 07h para as 11h30, crendo que Blücher estava a dois dias de distância.',
      confidentialTelemetry: 'RELATÓRIO STRATA // VARIÁVEL DE ATRITO: O atraso tático de 270 minutos abriu a janela exata para a chegada de 30.000 prussianos pelo flanco direito.'
    },
    documents: [
      {
        id: 'doc_nap_artilharia',
        code: 'DOC-01 // LAUDO DE ARTILHARIA',
        title: 'Parecer Técnico do General Drouot (06h30)',
        typeLabel: 'Registro Militar de Campo',
        dateLabel: '18 de Junho de 1815, 06h30 — Le Caillou',
        summary: 'Avaliação física do terreno encharcado após doze horas de chuva torrencial na véspera da batalha.',
        fullText: 'As rodas das baterias de 12 libras afundam até o cubo na argila saturada. Ademais, as balas rasas não ricocheteiam na lama, perdendo 60% do efeito de impacto sobre a infantaria de Wellington. Recomenda-se aguardar 4 horas de sol e vento para firmeza do solo.',
        clues: [
          {
            id: 'clue_nap_lama',
            title: 'Adiamento de 4h30 por Restrição Física do Solo',
            excerpt: '"O início do bombardeio foi adiado das 07h00 para as 11h30 aguardando a secagem da argila para manobra dos canhões."',
            analysisNote: 'Ganho de eficiência balística imediata ao custo de 270 minutos de janela estratégica.',
            category: 'logistica',
            xpReward: 45
          }
        ]
      },
      {
        id: 'doc_nap_despacho',
        code: 'DOC-02 // COMUNICAÇÃO DE ESTADO-MAIOR',
        title: 'Despacho do Marechal Soult ao Marechal Grouchy',
        typeLabel: 'Ordem Escrita Interceptada',
        dateLabel: '18 de Junho de 1815, 10h00 — Quartel-General Imperial',
        summary: 'Ordem enviada por apenas um oficial a cavalo e redigida em termos ambíguos enquanto Grouchy marchava para Wavre.',
        fullText: 'O Imperador ordena que Vossa Excelência manobre em direção ao nosso flanco direito... Contudo, o despacho foi expedido por um único mensageiro em terreno hostil e levará mais de 4 horas para percorrer 22 quilômetros até Gembloux.',
        clues: [
          {
            id: 'clue_nap_mensageiro',
            title: 'Inconsistência de Comando: Despacho Único e Tardio',
            excerpt: '"Ordem crítica enviada às 10h00 por um único mensageiro a cavalo, chegando a Grouchy apenas às 16h00 — quando os prussianos já atacavam Plancenoit."',
            analysisNote: 'CONTRADIÇÃO DE PROTOCOLO: O manual de Berthier exigia envio triplo por rotas distintas em dias de batalha decisiva.',
            category: 'contradicao',
            xpReward: 60,
            isContradiction: true
          }
        ]
      },
      {
        id: 'doc_nap_blucher',
        code: 'DOC-03 // RECONHECIMENTO DE FLANCO',
        title: 'Relatório de Patrulha de Cavalaria em Saint-Lambert',
        typeLabel: 'Alerta de Inteligência',
        dateLabel: '18 de Junho de 1815, 13h15 — Colinas de Chapelle-Saint-Lambert',
        summary: 'Avistamento de colunas densas na floresta a leste, inicialmente confundidas pelo Estado-Maior com as tropas amigas de Grouchy.',
        fullText: 'Lentes de campanha identificam massas escuras emergindo dos bosques de Saint-Lambert. Prisioneiro hussardo capturado confirma: não é Grouchy, mas a vanguarda do IV Corpo Prussiano de Bülow, em marcha forçada desde a aurora.',
        clues: [
          {
            id: 'clue_nap_prussianos',
            title: 'Convergência Prussiana às 13h30 (Janela Fechada)',
            excerpt: '"Se o ataque tivesse começado às 07h00, o centro de Wellington teria sido rompido 3 horas antes da chegada de Bülow às 13h30."',
            analysisNote: 'Mostra que o tempo economizado para a artilharia foi exatamente o tempo necessário para a junção dos exércitos inimigos.',
            category: 'mapa',
            xpReward: 55
          }
        ]
      }
    ,
      {
        id: "doc_nap_cavalaria",
        code: "DOC-04 // RELATÓRIO DE CAVALARIA",
        title: "Registro de Ataque da Cavalaria do Marechal Ney",
        typeLabel: "Diário de Combate de Vanguarda",
        dateLabel: "18 de Junho de 1815, 16h00 — Colina de Mont-Saint-Jean",
        summary: "Relatório das sucessivas cargas de couraçados contra os quadrados britânicos sem apoio coordenado de infantaria ou artilharia de reserva.",
        fullText: "O Marechal Ney lançou 5.000 cavaleiros sobre o planalto de Mont-Saint-Jean sem infantaria de suporte. Os britânicos formaram quadrados impenetráveis. A cavalaria pesada exauriu seus cavalos e perdeu o momento decisivo sem conseguir capturar as baterias inimigas.",
        clues: [
          {
            id: "clue_nap_cavalaria",
            title: "Carga Isolada de Cavalaria sem Apoio Combinado",
            excerpt: "\"Ney lançou 5.000 cavaleiros sobre o planalto sem infantaria de suporte; os britânicos formaram quadrados impenetráveis e exauriram a cavalaria.\"",
            analysisNote: "Quebra da doutrina tática de armas combinadas: ação precipitada que esgotou a reserva de choque francesa antes do clímax.",
            category: "logistica",
            xpReward: 40
          }
        ]
      }
    ],
    connectionChallenges: [
      {
        id: 'conn_nap_1',
        stepNumber: 1,
        question: '1. Como a decisão técnica de aguardar a secagem do solo anulou a vantagem estratégica de Napoleão?',
        promptHint: 'Relacione o adiamento de 4h30 da artilharia com o horário real de chegada das colunas prussianas em Saint-Lambert.',
        requiredClueIds: ['clue_nap_lama', 'clue_nap_prussianos'],
        successTitle: 'Colapso da Janela de Isolamento Confirmado',
        successConclusion: 'Esperar das 07h00 às 11h30 melhorou o tiro dos canhões, mas entregou a Blücher as 4 horas exatas de que precisava para cruzar o terreno lamacento e atingir o flanco francês.',
        errorFeedback: 'Conecte o adiamento pelas condições da lama (DOC-01) com o avistamento das colunas prussianas (DOC-03).',
        xpReward: 85
      },
      {
        id: 'conn_nap_2',
        stepNumber: 2,
        question: '2. Por que os 33.000 homens de Grouchy permaneceram ausentes enquanto os prussianos decidiam a batalha?',
        promptHint: 'Cruze a falha no protocolo de envio do despacho imperial com a chegada prussiana no flanco direito.',
        requiredClueIds: ['clue_nap_mensageiro', 'clue_nap_prussianos'],
        successTitle: 'Assimetria de Sincronia e Conexões Reveladas!',
        successConclusion: 'O envio de um único mensageiro às 10h00 gerou um atraso de comunicação de 6 horas, impedindo Grouchy de interceptar a marcha de Blücher. Conexões históricas desbloqueadas no Mapa!',
        errorFeedback: 'Relacione a falha do despacho único a cavalo (DOC-02) com a chegada prussiana em Saint-Lambert (DOC-03).',
        xpReward: 90,
        unlocksMapConnections: true
      }
    ],
    hypothesisTheses: [
      {
        id: 'thesis_nap_tempo',
        tag: 'Hipótese I',
        title: 'Armadilha da Perfeição Tática sobre a Urgência Estratégica',
        subtitle: 'Buscar o cenário ideal para a artilharia custou a janela única de vitória.',
        description: 'Napoleão priorizou a eficácia técnica local (solo seco para os canhões) em detrimento da variável crítica global: o tempo de junção dos dois exércitos adversários.',
        supportingClueIds: ['clue_nap_lama', 'clue_nap_prussianos'],
        feedbackStrong: 'Hipótese Sólida: As evidências provam que o ganho balístico das 11h30 foi superado pela perda irreversível da janela temporal.',
        feedbackPartial: 'Anexe o parecer da lama e o relatório de chegada prussiana para fundamentar totalmente esta tese.'
      },
      {
        id: 'thesis_nap_comando',
        tag: 'Hipótese II',
        title: 'Colapso da Rede de Informação e Comando',
        subtitle: 'A ausência de redundância nos despachos cegou o exército francês.',
        description: 'Mesmo com o atraso matinal, a batalha era vencível se o Estado-Maior tivesse usado múltiplos mensageiros na madrugada para reorientar Grouchy.',
        supportingClueIds: ['clue_nap_mensageiro', 'clue_nap_prussianos'],
        feedbackStrong: 'Hipótese Muito Bem Sustentada: Você demonstrou que a falha estrutural na transmissão de ordens decidiu o confronto.',
        feedbackPartial: 'Inclua a pista do mensageiro único (DOC-02) para sustentar a tese de falha de comando.'
      }
    ],
    simulationPrompt: 'Em uma operação crítica, sua equipe técnica pede 4 horas extras para garantir 100% de eficiência das ferramentas, mas você suspeita que um concorrente ou ameaça externa está em movimento. Como você decide?',
    simulationChoices: [
      {
        id: 'sim_nap_a',
        tag: 'A',
        title: 'Aguardar as 4 Horas para Eficiência Técnica Máxima',
        subtitle: 'Priorizar controle de qualidade e precisão instrumental',
        description: 'Autorizar a espera até que o ambiente esteja estável, confiando que sua linha secundária conterá imprevistos externos.',
        consequenceSummary: 'Você reduz falhas operacionais internas, mas corre o risco de perder a janela de oportunidade antes de concluir a ação.',
        deltaCaos: 12,
        deltaLivreArbitrio: -5,
        deltaPerfil: { analitico: 12, estrategico: -4, humanista: 6, exploratorio: 4 },
        deltaSkills: { leituraEvidencias: 16, reconhecimentoPadroes: 14, raciocinioEstrategico: 12, tomadaDecisao: 14 }
      },
      {
        id: 'sim_nap_b',
        tag: 'B',
        title: 'Agir Imediatamente com Capacidade Parcial',
        subtitle: 'Priorizar a velocidade e o domínio do tempo sobre a perfeição',
        description: 'Iniciar a operação às 07h00 mesmo sob atrito severo, garantindo que o objetivo principal seja alcançado antes que o cenário externo mude.',
        consequenceSummary: 'Você enfrenta maior desgaste imediato, mas impede a convergência das forças adversárias.',
        deltaCaos: -8,
        deltaLivreArbitrio: 15,
        deltaPerfil: { analitico: 6, estrategico: 15, humanista: -2, exploratorio: 10 },
        deltaSkills: { leituraEvidencias: 14, reconhecimentoPadroes: 18, raciocinioEstrategico: 20, tomadaDecisao: 18 }
      }
    ],
    alternativeInterpretations: [
      'A chuva não derrotou Napoleão sozinha: foi a combinação entre esperar o solo secar e subestimar a velocidade de marcha prussiana.',
      'A ausência do Marechal Berthier (antigo chefe de Estado-Maior) explica por que despachos vitais foram enviados sem cópias redundantes.'
    ],
    connectedTo: ['cesar', 'jobs'],
    hypotheses: [
      {
        id: 'napoleao_a',
        tag: 'A',
        title: 'Aguardar a Secagem do Solo (11h30)',
        subtitle: 'Priorizar a Doutrina de Artilharia',
        description: 'Adiar o início do assalto até o meio-dia para maximizar o efeito dos canhões.',
        consequence: 'Concede a Blücher as quatro horas decisivas para atingir o flanco francês.',
        deltaCaos: 20,
        deltaLivreArbitrio: -15,
        deltaPerfil: { analitico: 15, estrategico: -10, humanista: 5 }
      },
      {
        id: 'napoleao_b',
        tag: 'B',
        title: 'Ataque de Infantaria na Aurora (07h00)',
        subtitle: 'Sacrificar o Poder de Fogo pelo Tempo',
        description: 'Lançar as colunas às 07h00 sobre a lama, buscando romper Wellington antes dos prussianos.',
        consequence: 'Preserva a janela temporal antes da chegada de Bülow.',
        deltaCaos: -10,
        deltaLivreArbitrio: 25,
        deltaPerfil: { analitico: 5, estrategico: 30, humanista: -15 }
      }
    ]
  },
  {
    id: 'turing',
    name: 'Alan Turing',
    fullName: 'Alan Turing e a Cifra Enigma',
    year: '1941',
    timelineLabel: '1941 Mundo',
    location: 'Bletchley Park — Inglaterra',
    era: 'contemporanea',
    coords: { x: 37, y: 14 },
    geoCoords: { x: 46.2, y: 27.2 },
    image: turingImg,
    dossierCover: '/dossiers/dossier_03_bletchley.webp',
    status: 'disponivel',
    isVolumeOne: true,
    missionCode: 'CASO 005 // MISSÃO 03',
    missionTitle: 'O DILEMA ESTATÍSTICO DE ULTRA',
    title: 'Alan Turing e Bletchley Park',
    subtitle: '1941 — Inglaterra // Cabana 8 — Inteligência Ultra',
    shortDescription: 'Quebrar o código naval alemão foi apenas a metade matemática do problema. A outra metade era impedir que o inimigo percebesse que seus segredos estavam sendo lidos.',
    missionBullets: [
      'Examinar os telegramas descriptografados da Cabana 8 e a tabela de probabilidade de suspeita.',
      'Conectar a taxa de desvio de comboios com o risco de troca dos rotores da Enigma.',
      'Formular sua hipótese sobre a gestão da informação assimétrica e decidir sob pressão ética.'
    ],
    evidence: {
      title: '1. Arquivos Ultra — Cabana 8',
      artifactCode: 'DOC-STRATA-1941-08',
      locationSubtitle: 'COORDENADAS HISTÓRICAS: 51°59′N 0°44′W // BLETCHLEY PARK',
      parchmentNote: 'Se todos os submarinos fossem interceptados ou evitados imediatamente após a leitura das mensagens, o Almirantado em Berlim concluiria que a Enigma foi quebrada e mudaria os rotores no dia seguinte.',
      confidentialTelemetry: 'RELATÓRIO STRATA // ASSIMETRIA DA INFORMAÇÃO: Saber tudo impõe o fardo de simular ignorância estatística para preservar a vantagem sistêmica.'
    },
    documents: [
      {
        id: 'doc_tur_ultra',
        code: 'DOC-01 // DESCRIPTOGRAFIA',
        title: 'Telegrama Naval Alemão Interceptado (Cabana 8)',
        typeLabel: 'Inteligência Ultra // Top Secret',
        dateLabel: 'Maio de 1941 — Bletchley Park',
        summary: 'Coordenadas exatas de uma matilha de submarinos U-Boat posicionada na rota de um comboio aliado no Atlântico Norte.',
        fullText: 'Chave Naval Dolphin decifrada pela Bomba Eletromecânica às 04h12: oito submarinos aguardam na grade AK-42. Contudo, nenhuma aeronave aliada sobrevoou a região nas últimas 48 horas.',
        clues: [
          {
            id: 'clue_tur_coordenadas',
            title: 'Informação Perfeita sem Cobertura Visual',
            excerpt: '"A Cabana 8 sabe a posição exata dos 8 submarinos, mas nenhum avião de reconhecimento aliado avistou a matilha oficialmente."',
            analysisNote: 'Agir sem justificativa visual revelaria a Berlim que o rádio criptografado foi violado.',
            category: 'logistica',
            xpReward: 50
          }
        ]
      },
      {
        id: 'doc_tur_estatistica',
        code: 'DOC-02 // MODELO MATEMÁTICO',
        title: 'Memorando sobre Limiar de Suspeita Estatística',
        typeLabel: 'Cálculo de Probabilidade',
        dateLabel: 'Maio de 1941 — Equipe de Estatística',
        summary: 'Cálculo de quantas ações diretas o Almirantado Britânico poderia realizar antes que a inteligência alemã detectasse anomalia não-aleatória.',
        fullText: 'Se desviarmos 100% dos comboios sem avistamento prévio de patrulha aérea, a probabilidade de acaso cai para menos de 0,02%. O Almirantado alemão introduzirá um quarto rotor imediatamente, cegando os Aliados pelos próximos 18 meses.',
        clues: [
          {
            id: 'clue_tur_rotor',
            title: 'Risco de Cegueira Estratégica de 18 Meses',
            excerpt: '"Intervenções acima do limiar estatístico provocarão a troca imediata dos rotores da Enigma, anulando a vantagem da guerra."',
            analysisNote: 'Contradição trágica entre salvar um comboio hoje vs. encurtar a guerra mundial em dois anos.',
            category: 'contradicao',
            xpReward: 65,
            isContradiction: true
          }
        ]
      }
    ],
    connectionChallenges: [
      {
        id: 'conn_tur_1',
        stepNumber: 1,
        question: '1. Por que possuir a localização exata dos submarinos não permitia o desvio imediato de todas as rotas sem cobertura?',
        promptHint: 'Conecte a ausência de avistamento aéreo com o cálculo estatístico de troca dos rotores.',
        requiredClueIds: ['clue_tur_coordenadas', 'clue_tur_rotor'],
        successTitle: 'Paradoxo da Criptografia Revelado!',
        successConclusion: 'Usar uma informação secreta sem fabricar uma causa plausível (como um voo de patrulha "casual") destrói a própria fonte da informação. Conexões desbloqueadas no Mapa!',
        errorFeedback: 'Vincule a pista da ausência de cobertura visual (DOC-01) com o memorando sobre o limiar estatístico (DOC-02).',
        xpReward: 95,
        unlocksMapConnections: true
      }
    ],
    hypothesisTheses: [
      {
        id: 'thesis_tur_sistemica',
        tag: 'Hipótese I',
        title: 'Preservação Sistêmica por Camuflagem Estatística',
        subtitle: 'A vitória exigia ocultar o próprio sucesso criptográfico.',
        description: 'O verdadeiro salto de Bletchley Park foi tratar a informação como um recurso finito que precisava ser dosado dentro da margem do acaso.',
        supportingClueIds: ['clue_tur_coordenadas', 'clue_tur_rotor'],
        feedbackStrong: 'Hipótese Sólida e Fundamentada: Você conectou a quebra matemática do código com a necessidade de proteção estatística da fonte.',
        feedbackPartial: 'Anexe ambas as pistas da Cabana 8 para fundamentar esta tese.'
      }
    ],
    simulationPrompt: 'Sua auditoria descobre uma falha crítica que permite prever fraudes sistêmicas. Se você bloquear todas as operações suspeitas hoje sem uma cobertura plausível, os operadores mudarão o protocolo em 24h e você perderá o rastreamento. Como procede?',
    simulationChoices: [
      {
        id: 'sim_tur_a',
        tag: 'A',
        title: 'Intervenção Imediata em Todos os Casos',
        subtitle: 'Prioridade ética absoluta ao presente imediato',
        description: 'Bloquear todas as operações detectadas agora, aceitando que o canal de monitoramento será perdido amanhã.',
        consequenceSummary: 'Você impede o dano imediato visível, mas perde a visibilidade estrutural de longo prazo.',
        deltaCaos: 15,
        deltaLivreArbitrio: 12,
        deltaPerfil: { analitico: -6, estrategico: -6, humanista: 18, exploratorio: 6 },
        deltaSkills: { leituraEvidencias: 14, reconhecimentoPadroes: 12, raciocinioEstrategico: 10, tomadaDecisao: 18 }
      },
      {
        id: 'sim_tur_b',
        tag: 'B',
        title: 'Camuflagem Analítica e Desmonte Estrutural',
        subtitle: 'Criar auditorias de cobertura antes de cada intervenção',
        description: 'Só intervir onde for possível simular uma descoberta rotineira externa, mantendo a fonte ativa até desmontar toda a rede.',
        consequenceSummary: 'Você preserva a inteligência estratégica até a resolução definitiva do conflito.',
        deltaCaos: -15,
        deltaLivreArbitrio: -5,
        deltaPerfil: { analitico: 16, estrategico: 14, humanista: -6, exploratorio: 10 },
        deltaSkills: { leituraEvidencias: 18, reconhecimentoPadroes: 20, raciocinioEstrategico: 20, tomadaDecisao: 16 }
      }
    ],
    alternativeInterpretations: [
      'A matemática em Bletchley Park não substituiu a decisão humana; ela tornou explícito o custo de cada escolha.',
      'O segredo de Ultra durou até o fim da guerra porque cada ação tática foi precedida por uma justificativa observável pelo inimigo.'
    ],
    connectedTo: ['jobs'],
    hypotheses: [
      {
        id: 'turing_a',
        tag: 'A',
        title: 'Intervenção Máxima Imediata nos Comboios',
        subtitle: 'Prioridade Humanitária de Curto Prazo',
        description: 'Desviar todos os navios mercantes sob ameaça detectada para salvar vidas hoje.',
        consequence: 'Salva vidas imediatas, mas precipita a alteração da cifra Enigma.',
        deltaCaos: 20,
        deltaLivreArbitrio: 15,
        deltaPerfil: { analitico: -15, estrategico: -10, humanista: 30 }
      },
      {
        id: 'turing_b',
        tag: 'B',
        title: 'Gestão Algorítmica do Silêncio',
        subtitle: 'Preservação Estratégica do Segredo Maior',
        description: 'Só agir militarmente quando houver justificativa de patrulha aérea plausível.',
        consequence: 'Garante o encurtamento da guerra em anos.',
        deltaCaos: -25,
        deltaLivreArbitrio: -10,
        deltaPerfil: { analitico: 30, estrategico: 20, humanista: -20 }
      }
    ]
  },
  {
    id: 'mandela',
    name: 'Nelson Mandela',
    fullName: 'Nelson Mandela e a Transição Sul-Africana',
    year: '1994',
    timelineLabel: '1994 África do Sul',
    location: 'Pretória — África do Sul',
    era: 'contemporanea',
    coords: { x: 53.5, y: 76 },
    geoCoords: { x: 53.5, y: 74.5 },
    image: mandelaImg,
    dossierCover: '/reader/assets/chapters/ch19_mandela.webp',
    status: 'quarentena',
    isVolumeOne: false,
    missionCode: 'CASO 006 // VOLUME II',
    missionTitle: 'O DESARMAMENTO DO ÓDIO',
    title: 'Nelson Mandela e o Desarmamento do Ódio',
    subtitle: '1994 — Pretória // Arquivo Reservado — Volume II',
    shortDescription: 'Como evitar a guerra civil iminente contendo simultaneamente o aparato de segurança do antigo regime e as exigências de revanche.',
    missionBullets: [
      'Arquivo classificado no compêndio principal.',
      'Liberação programada para a camada de Simulação do Volume II.'
    ],
    evidence: {
      title: 'Arquivo sob Quarentena',
      artifactCode: 'DOC-QUARANTINE-1994',
      locationSubtitle: 'GOVERNO DE TRANSIÇÃO // ACESSO RESTRITO',
      parchmentNote: 'Documento selado pela auditoria externa.',
      confidentialTelemetry: 'Em quarentena analítica.'
    },
    connectedTo: ['jobs'],
    hypotheses: []
  },
  {
    id: 'jobs',
    name: 'Steve Jobs',
    fullName: 'Steve Jobs e o Lançamento do iPhone',
    year: '2007',
    timelineLabel: '2007 Tecnologia',
    location: 'São Francisco — Califórnia',
    era: 'contemporanea',
    coords: { x: 16.5, y: 38.5 },
    geoCoords: { x: 16.5, y: 38.5 },
    image: jobsImg,
    dossierCover: '/dossiers/dossier_04_travamento.webp',
    status: 'disponivel',
    isVolumeOne: true,
    missionCode: 'CASO 007 // MISSÃO 04',
    missionTitle: 'O CAMINHO DOURADO NO MOSCONE CENTER',
    title: 'Steve Jobs e o Lançamento de 2007',
    subtitle: '9 de Janeiro de 2007 — Califórnia // Bastidores da Macworld',
    shortDescription: 'Minutos antes da apresentação que redefiniu a computação móvel, os protótipos sofriam quedas críticas de memória. Descubra a engenharia do "Caminho Dourado".',
    missionBullets: [
      'Examinar o log de memória RAM dos protótipos e o roteiro de palco ("Golden Path").',
      'Conectar o limite de 128 MB de memória com a troca oculta de aparelhos no púlpito.',
      'Formular sua hipótese sobre demonstração sob risco sistêmico e tomar sua decisão.'
    ],
    evidence: {
      title: '1. Logs de Engenharia — Projeto Purple',
      artifactCode: 'DOC-STRATA-2007-09',
      locationSubtitle: 'COORDENADAS HISTÓRICAS: 37°47′N 122°24′W // MOSCONE WEST',
      parchmentNote: 'Com apenas 128 MB de RAM, abrir o navegador Safari logo após o player de áudio causava Kernel Panic imediato. A equipe programou uma sequência única de cliques ("Caminho Dourado") e posicionou 6 aparelhos idênticos atrás do púlpito.',
      confidentialTelemetry: 'RELATÓRIO STRATA // ARQUITETURA DE PERCEPÇÃO: Quando a janela de mercado não permite adiamento, a estabilidade percebida precede a maturidade técnica.'
    },
    documents: [
      {
        id: 'doc_jobs_log',
        code: 'DOC-01 // LOG DE SISTEMA',
        title: 'Relatório de Crash Kernel Panic — Build P1 (08 Jan 2007)',
        typeLabel: 'Telemetria de Engenharia',
        dateLabel: '8 de Janeiro de 2007, 23h40 — Ensaio Geral no Moscone Center',
        summary: 'Registro de estouro de memória RAM quando três aplicativos nativos eram executados fora da ordem estrita.',
        fullText: 'Memória disponível cai para 4 MB ao alternar diretamente de Safari para E-mail com áudio ativo. O sistema reinicia em 18 segundos. Não há tempo hábil para recompilar o sistema operacional antes da abertura dos portões às 09h00.',
        clues: [
          {
            id: 'clue_jobs_ram',
            title: 'Colapso de Memória Fora da Ordem Estrita',
            excerpt: '"Executar três funções fora da sequência exata esgota os 128 MB de RAM e reinicia o protótipo no palco em 18 segundos."',
            analysisNote: 'O produto apresentado ao público como finalizado ainda não suportava uso livre contínuo.',
            category: 'contradicao',
            xpReward: 60,
            isContradiction: true
          }
        ]
      },
      {
        id: 'doc_jobs_golden',
        code: 'DOC-02 // ROTEIRO DE PALCO',
        title: 'Protocolo "Golden Path" & Bancada de 6 Protótipos',
        typeLabel: 'Documento Operacional Confidencial',
        dateLabel: '9 de Janeiro de 2007, 08h30 — Bastidores da Macworld',
        summary: 'Instrução de sequência cirúrgica de demonstração e revezamento silencioso de aparelhos enquanto a câmera focava no telão.',
        fullText: 'O apresentador deve seguir estritamente a sequência: Áudio -> Chamada -> SMS -> Fotos. Ao concluir o bloco 1, o aparelho A é pousado atrás do púlpito para reiniciar em segundo plano enquanto o aparelho B (idêntico e com memória limpa) é empunhado para o Safari.',
        clues: [
          {
            id: 'clue_jobs_revezamento',
            title: 'Coreografia de Revezamento de 6 Aparelhos',
            excerpt: '"Seis unidades idênticas foram alinhadas no púlpito para troca invisível a cada bloco, contornando o estouro de memória."',
            analysisNote: 'Prova que a fluidez vista pelo mundo foi sustentada por um protocolo de contenção de risco milimetricamente ensaiado.',
            category: 'logistica',
            xpReward: 55
          }
        ]
      }
    ],
    connectionChallenges: [
      {
        id: 'conn_jobs_1',
        stepNumber: 1,
        question: '1. Como a equipe impediu o travamento ao vivo diante de milhares de jornalistas sem ter tempo de corrigir o código-fonte?',
        promptHint: 'Relacione o limite de estouro de memória RAM com o protocolo de revezamento no púlpito.',
        requiredClueIds: ['clue_jobs_ram', 'clue_jobs_revezamento'],
        successTitle: 'Engenharia do Caminho Dourado Desvendada!',
        successConclusion: 'Sem horas para corrigir o vazamento de memória (9 meses antes do envio às lojas), a solução foi restringir a operação a um corredor matemático sem falhas e alternar o hardware fisicamente. Conexões desbloqueadas no Mapa!',
        errorFeedback: 'Conecte o relatório de estouro de memória (DOC-01) com o protocolo de revezamento de 6 aparelhos (DOC-02).',
        xpReward: 90,
        unlocksMapConnections: true
      }
    ],
    hypothesisTheses: [
      {
        id: 'thesis_jobs_ancora',
        tag: 'Hipótese I',
        title: 'Captura de Janela Histórica sob Risco Controlado',
        subtitle: 'A demonstração garantiu 6 meses de vantagem antes da entrega física.',
        description: 'Como o produto só seria entregue em junho, demonstrar a visão completa em janeiro (mesmo sustentada por um roteiro estrito) redefiniu todo o mercado antes da concorrência reagir.',
        supportingClueIds: ['clue_jobs_ram', 'clue_jobs_revezamento'],
        feedbackStrong: 'Hipótese Sólida: Você conectou a limitação técnica imediata com a estratégia de captura de percepção e tempo de mercado.',
        feedbackPartial: 'Anexe os dois documentos de bastidores para sustentar esta hipótese com força máxima.'
      }
    ],
    simulationPrompt: 'Faltam 2 horas para a apresentação mais importante do seu projeto. O sistema funciona perfeitamente se operado em uma sequência exata, mas trava se testado fora de ordem. A correção definitiva levará 3 semanas. O que você faz?',
    simulationChoices: [
      {
        id: 'sim_jobs_a',
        tag: 'A',
        title: 'Adiar o Anúncio e Apresentar Apenas Quando Estável',
        subtitle: 'Segurança técnica total acima do impacto de calendário',
        description: 'Cancelar a demonstração ao vivo hoje e aguardar 3 semanas até que o software suporte qualquer teste aleatório.',
        consequenceSummary: 'Você elimina o risco de falha pública imediata, mas cede o protagonismo do anúncio ao mercado.',
        deltaCaos: -12,
        deltaLivreArbitrio: -6,
        deltaPerfil: { analitico: 14, estrategico: -4, humanista: 8, exploratorio: 4 },
        deltaSkills: { leituraEvidencias: 15, reconhecimentoPadroes: 12, raciocinioEstrategico: 12, tomadaDecisao: 14 }
      },
      {
        id: 'sim_jobs_b',
        tag: 'B',
        title: 'Executar a Demonstração pelo "Caminho Dourado"',
        subtitle: 'Assumir o risco calculado com redundância nos bastidores',
        description: 'Subir ao palco seguindo estritamente a rota testada e usar unidades de backup para garantir a fluidez enquanto a equipe finaliza o sistema para o lançamento comercial.',
        consequenceSummary: 'Você conquista o marco histórico no momento exato, operando sob tensão máxima até a entrega final.',
        deltaCaos: 16,
        deltaLivreArbitrio: 16,
        deltaPerfil: { analitico: 8, estrategico: 16, humanista: -2, exploratorio: 12 },
        deltaSkills: { leituraEvidencias: 16, reconhecimentoPadroes: 18, raciocinioEstrategico: 20, tomadaDecisao: 18 }
      }
    ],
    alternativeInterpretations: [
      'Assim como no Rubicão em 49 a.C., o momento público decisivo foi precedido por uma gestão invisível de escassez nos bastidores.',
      'O "Caminho Dourado" não era ausência de produto, mas uma ponte tática de 180 dias entre o protótipo e a linha de montagem.'
    ],
    connectedTo: ['cesar', 'napoleao', 'turing'],
    hypotheses: [
      {
        id: 'jobs_a',
        tag: 'A',
        title: 'Adiar a Apresentação e Recolher Protótipos',
        subtitle: 'Segurança Técnica e Transparência',
        description: 'Adiar o anúncio até que o sistema operacional suporte multitarefa real.',
        consequence: 'Evita o risco de colapso no palco, mas perde a janela histórica.',
        deltaCaos: -20,
        deltaLivreArbitrio: -5,
        deltaPerfil: { analitico: 25, estrategico: -10, humanista: 10 }
      },
      {
        id: 'jobs_b',
        tag: 'B',
        title: 'Executar o "Caminho Dourado" ao Vivo',
        subtitle: 'Aposta Total na Percepção de Futuro',
        description: 'Subir ao palco com os protótipos instáveis seguindo a sequência cirúrgica.',
        consequence: 'Consolida a revolução móvel 6 meses antes do produto estar pronto.',
        deltaCaos: 15,
        deltaLivreArbitrio: 30,
        deltaPerfil: { analitico: 5, estrategico: 30, humanista: -5 }
      }
    ]
  }
];


const allNodesMap = new Map<string, HistoricalNode>();
[...EXTENDED_HISTORICAL_NODES, ...ORIGINAL_HISTORICAL_NODES].forEach(node => {
  allNodesMap.set(node.id, node);
});

const chronologicalOrder = [
  "salomao",
  "alexandre",
  "cesar",
  "cleopatra",
  "joana",
  "da_vinci",
  "napoleao",
  "turing",
  "mandela",
  "jobs"
];

export const HISTORICAL_NODES: HistoricalNode[] = chronologicalOrder
  .map(id => allNodesMap.get(id)!)
  .filter(Boolean);
