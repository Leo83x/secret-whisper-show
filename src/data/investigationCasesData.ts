import { HistoricalNode } from '../types/investigation';
import cesarImg from '../assets/characters/julio_cesar.webp';
import jobsImg from '../assets/characters/jobs.webp';
import napoleaoImg from '../assets/characters/napoleao.webp';
import turingImg from '../assets/characters/turing.webp';
import cleopatraImg from '../assets/characters/cleopatra.webp';
import joanaImg from '../assets/characters/joana_darc.webp';
import mandelaImg from '../assets/characters/mandela.webp';

export const HISTORICAL_NODES: HistoricalNode[] = [
  {
    id: 'cesar',
    name: 'Júlio César',
    fullName: 'Júlio César e o Rubicão',
    year: '49 a.C.',
    timelineLabel: '49 a.C. Roma',
    location: 'Roma — Rio Rubicão',
    era: 'antiguidade',
    coords: { x: 48, y: 33 },
    image: cesarImg,
    dossierCover: '/dossiers/dossier_01_rubicon.webp',
    status: 'disponivel',
    isVolumeOne: true,
    title: 'Júlio César e o Rubicão',
    subtitle: '49 a.C. — Roma // Margens do Rio Rubicão',
    shortDescription: 'Uma travessia que redefiniu o mundo antigo. Descubra o que realmente estava em jogo nas tabuletas de intendência antes da famosa frase pública.',
    missionBullets: [
      'Examine os registros de trigo e soldos atrasados da 13ª Legião.',
      'Confronte as restrições logísticas de 49 a.C. com os episódios de 1815 e 2007.',
      'Formule a sua hipótese sobre o fator que precipitou a ruptura.'
    ],
    evidence: {
      title: '1. Registros da Travessia',
      artifactCode: 'DOC-STRATA-49BC-02',
      locationSubtitle: 'COORDENADAS HISTÓRICAS: 44°04\'N 12°25\'E // MARGENS DO RUBICÃO',
      parchmentNote: 'Sob o toldo da tenda de campanha, o intendente-chefe conferia as tábuas de cera à luz da lamparina: restavam rações de trigo para apenas 9 dias. Tropas de Pompeu bloqueavam o crédito no sul. Recuar significava desintegração por fome; esperar não era prudência, era rendição biológica.',
      confidentialTelemetry: 'RELATÓRIO STRATA // ANÁLISE DE VULNERABILIDADE: O discurso político esconde a mecânica da escassez. A travessia não nasceu de um capricho tirânico, mas de um estrangulamento deliberado das linhas de suprimento.'
    },
    connectedTo: ['jobs', 'napoleao'],
    hypotheses: [
      {
        id: 'cesar_a',
        tag: 'A',
        title: 'Manter o Protocolo de Ordem',
        subtitle: 'Submissão ao Senado e Linha Temporal Conservadora',
        description: 'Recuar com a legião até Ravena e despachar nova embaixada aos cônsules, mantendo a legalidade mesmo sob o risco de asfixia logística e isolamento político.',
        consequence: 'Preserva a institucionalidade republicana imediata, mas transfere o controle do tempo para as legiões de Pompeu.',
        deltaCaos: -15,
        deltaLivreArbitrio: -10,
        deltaPerfil: { analitico: 20, estrategico: -5, humanista: 15 }
      },
      {
        id: 'cesar_b',
        tag: 'B',
        title: 'Intervir e Forçar a Ruptura',
        subtitle: 'Salto Estratégico sob Restrição Absoluta',
        description: 'Cruzar o Rubicão em armas antes do esgotamento das rações de 9 dias, tomando a iniciativa e quebrando as regras estabelecidas para impor um novo centro de poder.',
        consequence: 'Desencadeia a guerra civil romana aberta, acelerando o colapso irreversível da República e a emergência do Império.',
        deltaCaos: 25,
        deltaLivreArbitrio: 20,
        deltaPerfil: { analitico: 10, estrategico: 25, humanista: -10 }
      }
    ]
  },
  {
    id: 'jobs',
    name: 'Steve Jobs',
    fullName: 'Steve Jobs e o Lançamento do iPhone',
    year: '2007',
    timelineLabel: '2007 Tecnologia',
    location: 'São Francisco — Moscone Center',
    era: 'contemporanea',
    coords: { x: 19, y: 35 },
    image: jobsImg,
    dossierCover: '/dossiers/dossier_04_travamento.webp',
    status: 'disponivel',
    isVolumeOne: true,
    title: 'Steve Jobs e o Lançamento de 2007',
    subtitle: '2007 — São Francisco // Bastidores do Moscone Center',
    shortDescription: 'Minutos antes da apresentação que moldou o século XXI, protótipos instáveis reiniciavam sozinhos nos bastidores. A ilusão de fluidez precisava resistir diante do mundo.',
    missionBullets: [
      'Analise os registros de telemetria de rede e o plano de contingência com 3 aparelhos.',
      'Identifique a simetria entre o palco de 2007 e a barranca do rio em 49 a.C.',
      'Avalie se a apresentação foi um ato de visão tecnológica ou um blefe de sobrevivência.'
    ],
    evidence: {
      title: '1. O Relatório dos Bastidores',
      artifactCode: 'DOC-STRATA-2007-09',
      locationSubtitle: 'MOSCONE WEST // SALA DE CONTROLE DE TELEMETRIA',
      parchmentNote: 'O protótipo estourava a memória se o navegador ficasse aberto por mais de dois minutos seguidos. Havia três unidades espelhadas na coxia para troca invisível durante a exibição dos slides. Cinco barras de sinal foram desenhadas na tela para disfarçar as quedas da antena.',
      confidentialTelemetry: 'RELATÓRIO STRATA // ASSINATURA DE RISCO: A certeza pública foi sustentada por uma rede de salvaguardas que operava no limiar absoluto da falha.'
    },
    connectedTo: ['cesar', 'turing'],
    hypotheses: [
      {
        id: 'jobs_a',
        tag: 'A',
        title: 'Apresentação Controlada em Vídeo Gravado',
        subtitle: 'Mitigação Clássica de Risco Operacional',
        description: 'Exibir a interface em vídeo pré-renderizado, evitando o risco de travamento ao vivo perante os analistas e a imprensa global.',
        consequence: 'Elimina o risco de colapso reputacional imediato, mas sinaliza fraqueza e pode atrasar o fechamento dos contratos de exclusividade.',
        deltaCaos: -10,
        deltaLivreArbitrio: -15,
        deltaPerfil: { analitico: 25, estrategico: -10, humanista: 5 }
      },
      {
        id: 'jobs_b',
        tag: 'B',
        title: 'Demonstração Real no Limiar da Falha',
        subtitle: 'Criação da Realidade por Antecipação',
        description: 'Manter a demonstração ao vivo com aparelhos alternados em sequência milimétrica, dobrando a aposta na capacidade de persuasão.',
        consequence: 'Consolida a revolução do mercado móvel em 90 minutos se obtiver sucesso; desastre total se o sistema congelar.',
        deltaCaos: 20,
        deltaLivreArbitrio: 25,
        deltaPerfil: { analitico: 5, estrategico: 30, humanista: -5 }
      }
    ]
  },
  {
    id: 'napoleao',
    name: 'Napoleão Bonaparte',
    fullName: 'Napoleão e o Campo de Waterloo',
    year: '1815',
    timelineLabel: '1815 Europa',
    location: 'Waterloo — Bélgica',
    era: 'moderna',
    coords: { x: 46, y: 27 },
    image: napoleaoImg,
    dossierCover: '/dossiers/dossier_02_waterloo.webp',
    status: 'disponivel',
    isVolumeOne: true,
    title: 'Napoleão e Waterloo',
    subtitle: '1815 — Waterloo // O Ponto de Inflexão da Europa',
    shortDescription: 'Chuva torrencial, ordens interceptadas e o relógio correndo contra o Império. Descubra como a lama e a assimetria de informação decidiram o destino do continente.',
    missionBullets: [
      'Investigue o atraso fatal da artilharia francesa devido ao solo enlameado.',
      'Analise os despachos ambíguos enviados ao Marechal Grouchy.',
      'Compare a perda de flexibilidade decisória de Napoleão com a crise do Rubicão.'
    ],
    evidence: {
      title: '1. O Despacho da Meia-Noite',
      artifactCode: 'DOC-STRATA-1815-04',
      locationSubtitle: 'QUARTEL-GENERAL FRANCÊS // LE CAILLOU',
      parchmentNote: 'A lama absorvia o impacto dos canhões e atrasou o início da batalha em quase quatro horas cruciais. Esse atraso permitiu que as colunas prussianas de Blücher cobrissem a distância necessária para atingir o flanco francês.',
      confidentialTelemetry: 'RELATÓRIO STRATA // ATRITO FÍSICO E TEMPO: Quando a flexibilidade de um sistema colapsa, qualquer variável meteorológica se torna determinante.'
    },
    connectedTo: ['cesar', 'jobs'],
    hypotheses: [
      {
        id: 'nap_a',
        tag: 'A',
        title: 'Ataque Frontal Precipitado sem Artilharia Plena',
        subtitle: 'Tentativa de Decisão Rápida antes da Junção Inimiga',
        description: 'Lançar a infantaria cedo mesmo sobre terreno lamacento para romper o centro britânico antes de qualquer aproximação prussiana.',
        consequence: 'Desgaste severo sob fogo de fuzilaria defensiva.',
        deltaCaos: 15,
        deltaLivreArbitrio: 10,
        deltaPerfil: { analitico: -10, estrategico: 20, humanista: -10 }
      },
      {
        id: 'nap_b',
        tag: 'B',
        title: 'Manobra de Retirada Tática e Reagrupamento',
        subtitle: 'Preservação do Exército Imperial em Profundidade',
        description: 'Recuar ordenadamente em direção a Charleroi para incorporar os 30 mil homens de Grouchy antes de dar combate geral.',
        consequence: 'Evita a aniquilação em Waterloo, mas desgasta o prestígio político de Napoleão em Paris.',
        deltaCaos: -20,
        deltaLivreArbitrio: -5,
        deltaPerfil: { analitico: 20, estrategico: 15, humanista: 10 }
      }
    ]
  },
  {
    id: 'turing',
    name: 'Alan Turing',
    fullName: 'Alan Turing e a Máquina de Bletchley',
    year: '1941',
    timelineLabel: '1941 Mundo',
    location: 'Bletchley Park — Inglaterra',
    era: 'contemporanea',
    coords: { x: 44, y: 23 },
    image: turingImg,
    dossierCover: '/dossiers/dossier_03_bletchley.webp',
    status: 'bloqueado',
    isVolumeOne: true,
    title: 'Alan Turing e Bletchley Park',
    subtitle: '1941 — Bletchley Park // A Guerra Silenciosa dos Códigos',
    shortDescription: 'Decifrar a máquina Enigma era apenas metade do problema. A metade mais sombria era calcular quais ataques interceptados podiam ser evitados sem alertar o inimigo.',
    missionBullets: [
      'Analise a equação estatística de proteção do segredo de Bletchley.',
      'Examine o diário do Hut 8 sobre os comboios do Atlântico Norte.',
      'Identifique a relação entre criptografia e preservação do monopólio de informação.'
    ],
    evidence: {
      title: '1. O Dilema dos Comboios',
      artifactCode: 'DOC-STRATA-1941-07',
      locationSubtitle: 'HUT 8 // GABINETE DE CRIPTOANÁLISE NAVAL',
      parchmentNote: 'Se todos os submarinos fossem interceptados com precisão imediata, Berlim mudaria os rotores da Enigma no dia seguinte. Proteger a fonte exigia permitir perdas calculadas.',
      confidentialTelemetry: 'RELATÓRIO STRATA // ASSIMETRIA DA INFORMAÇÃO: Saber tudo impõe o fardo de escolher quando fingir ignorância.'
    },
    connectedTo: ['jobs'],
    hypotheses: [
      {
        id: 'turing_a',
        tag: 'A',
        title: 'Intervenção Máxima Imediata nos Comboios',
        subtitle: 'Prioridade Humanitária de Curto Prazo',
        description: 'Desviar todos os navios mercantes sob ameaça detectada para salvar vidas hoje, assumindo o risco de perda futura do código.',
        consequence: 'Salva vidas imediatas, mas precipita a alteração da cifra Enigma pela marinha alemã.',
        deltaCaos: 20,
        deltaLivreArbitrio: 15,
        deltaPerfil: { analitico: -15, estrategico: -10, humanista: 30 }
      },
      {
        id: 'turing_b',
        tag: 'B',
        title: 'Gestão Algorítmica do Silêncio',
        subtitle: 'Preservação Estratégica do Segredo Maior',
        description: 'Só agir militarmente quando houver uma justificativa de patrulha aérea plausível para a inteligência inimiga.',
        consequence: 'Garante o encurtamento da guerra em anos, cobrando um preço silencioso e trágico em perdas locais.',
        deltaCaos: -25,
        deltaLivreArbitrio: -10,
        deltaPerfil: { analitico: 30, estrategico: 20, humanista: -20 }
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
    coords: { x: 53, y: 41 },
    image: cleopatraImg,
    dossierCover: '/assets/characters/cleopatra.webp',
    status: 'quarentena',
    isVolumeOne: false,
    title: 'Cleópatra VII e a Queda de Alexandria',
    subtitle: '30 a.C. — Egito // Arquivo Reservado — Volume II',
    shortDescription: 'A última rainha do Nilo em confronto com a expansão imperial de Otaviano. Negociação, tesouro e o veneno da soberania.',
    missionBullets: [
      'Arquivo classificado no compêndio principal.',
      'Liberação programada para a expansão do Volume II.'
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
    coords: { x: 44, y: 30 },
    image: joanaImg,
    dossierCover: '/assets/characters/joana_darc.webp',
    status: 'quarentena',
    isVolumeOne: false,
    title: 'Joana d\'Arc e a Virada da Guerra dos Cem Anos',
    subtitle: '1429 — França // Arquivo Reservado — Volume II',
    shortDescription: 'A ruptura mística do protocolo de cavalaria e a mobilização popular em um reino desestruturado.',
    missionBullets: [
      'Arquivo classificado no compêndio principal.',
      'Liberação programada para a expansão do Volume II.'
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
    id: 'mandela',
    name: 'Nelson Mandela',
    fullName: 'Nelson Mandela e a Transição Sul-Africana',
    year: '1994',
    timelineLabel: '1994 África do Sul',
    location: 'Pretória — África do Sul',
    era: 'contemporanea',
    coords: { x: 54, y: 78 },
    image: mandelaImg,
    dossierCover: '/assets/characters/mandela.webp',
    status: 'quarentena',
    isVolumeOne: false,
    title: 'Nelson Mandela e o Desarmamento do Ódio',
    subtitle: '1994 — Pretória // Arquivo Reservado — Volume II',
    shortDescription: 'Como evitar a guerra civil racial iminente contendo as exigências de vingança dos próprios aliados.',
    missionBullets: [
      'Arquivo classificado no compêndio principal.',
      'Liberação programada para a expansão do Volume II.'
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
  }
];
