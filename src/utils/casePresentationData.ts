export interface CasePresentationMeta {
  code: string;
  heroTitle: string;
  heroSubtitle: string;
  punchline: string;
  backdropDesktop: string;
  backdropMobile: string;
  historicalEraBadge: string;
}

export const CASE_PRESENTATION_MAP: Record<string, CasePresentationMeta> = {
  napoleao: {
    code: "CASO 004",
    heroTitle: "O ATRASO NA LAMA DE WATERLOO",
    heroSubtitle: "Napoleão Bonaparte • 1815",
    punchline: "Uma batalha decisiva. Uma decisão que mudaria a história.",
    backdropDesktop: "/dossiers/waterloo_hero_desktop.jpg",
    backdropMobile: "/dossiers/waterloo_hero_mobile.jpg",
    historicalEraBadge: "ERA NAPOLEÔNICA // 1815",
  },
  salomao: {
    code: "CASO 000",
    heroTitle: "O LIMITE DA SABEDORIA CENTRALIZADA",
    heroSubtitle: "Rei Salomão • 970 a.C.",
    punchline: "Quando os registros não bastam, a verdade se revela naquilo que se aceita perder.",
    backdropDesktop: "/dossiers/archive_room_3d_clean.webp",
    backdropMobile: "/dossiers/archive_room_3d_clean.webp",
    historicalEraBadge: "ARQUIVO FUNDACIONAL // JERUSALÉM 970 a.C.",
  },
  cesar: {
    code: "CASO 001",
    heroTitle: "O PONTO CEGO DO VENCEDOR",
    heroSubtitle: "Júlio César • 49 a.C.",
    punchline: "Na margem estreita de um riacho, nove dias de trigo forçaram a queda da República.",
    backdropDesktop: "/dossiers/dossier_01_rubicon.webp",
    backdropMobile: "/dossiers/caesar_topdown_3d_clean.webp",
    historicalEraBadge: "ROMA ANTIGA // 49 a.C.",
  },
  alexandre: {
    code: "CASO 002",
    heroTitle: "A FRONTEIRA DO MUNDO CONHECIDO",
    heroSubtitle: "Alexandre, o Grande • 326 a.C.",
    punchline: "O império marchou até o fim do mapa. Mas os homens encontraram o seu limite.",
    backdropDesktop: "/dossiers/field_simulation_3d_clean.webp",
    backdropMobile: "/dossiers/field_simulation_3d_clean.webp",
    historicalEraBadge: "EXPEDIÇÃO MACEDÔNIA // RIO HÍFASIS 326 a.C.",
  },
  cleopatra: {
    code: "CASO 003",
    heroTitle: "O CÁLCULO DE ALEXANDRIA",
    heroSubtitle: "Cleópatra VII • 30 a.C.",
    punchline: "Entre o veneno e a submissão a Roma, o cálculo da última soberana do Nilo.",
    backdropDesktop: "/dossiers/cleopatra_stage1_3d_clean.webp",
    backdropMobile: "/dossiers/cleopatra_topdown_3d_clean.webp",
    historicalEraBadge: "EGITO PTOLOMAICO // 30 a.C.",
  },
  da_vinci: {
    code: "CASO 005",
    heroTitle: "A PRESERVAÇÃO DA PERGUNTA",
    heroSubtitle: "Leonardo da Vinci • 1490",
    punchline: "A pergunta sobreviveu na margem de uma folha. Sem ordens secretas por quinhentos anos.",
    backdropDesktop: "/dossiers/forensic_analysis_room_3d_clean.webp",
    backdropMobile: "/dossiers/forensic_analysis_room_3d_clean.webp",
    historicalEraBadge: "RENASCENÇA ITALIANA // MILÃO 1490",
  },
  joana: {
    code: "CASO 006",
    heroTitle: "O FOGO E A CONVICÇÃO",
    heroSubtitle: "Joana d'Arc • 1429",
    punchline: "Uma voz na noite contra muralhas de pedra. A fé onde a diplomacia fracassou.",
    backdropDesktop: "/dossiers/archive_room_3d_clean.webp",
    backdropMobile: "/dossiers/field_simulation_3d_clean.webp",
    historicalEraBadge: "FRANÇA MEDIEVAL // ORLÉANS 1429",
  },
  turing: {
    code: "CASO 007",
    heroTitle: "O DILEMA ESTATÍSTICO DE ULTRA",
    heroSubtitle: "Alan Turing • 1941",
    punchline: "Possuir a resposta exata não permite evitar o desastre sem revelar a sua fonte.",
    backdropDesktop: "/dossiers/dossier_03_bletchley.webp",
    backdropMobile: "/dossiers/turing_topdown_3d_clean.webp",
    historicalEraBadge: "GUERRA CRIPTOGRÁFICA // BLETCHLEY 1941",
  },
  mandela: {
    code: "CASO 008",
    heroTitle: "O PROCESSO DE RIVONIA",
    heroSubtitle: "Nelson Mandela • 1964",
    punchline: "Vinte e sete anos de silêncio forçado para transformar o cárcere em fundação de uma nação.",
    backdropDesktop: "/dossiers/archive_room_3d_clean.webp",
    backdropMobile: "/dossiers/field_simulation_3d_clean.webp",
    historicalEraBadge: "RESISTÊNCIA // ÁFRICA DO SUL 1964",
  },
  jobs: {
    code: "CASO 009",
    heroTitle: "O CAMINHO DOURADO NO MOSCONE CENTER",
    heroSubtitle: "Steve Jobs • 2007",
    punchline: "Uma demonstração ao vivo sobre um fio de navalha. O dispositivo que mudou o mundo.",
    backdropDesktop: "/dossiers/dossier_04_travamento.webp",
    backdropMobile: "/dossiers/jobs_topdown_3d_clean.webp",
    historicalEraBadge: "ERA DIGITAL // SÃO FRANCISCO 2007",
  },
};

export const getCasePresentationMeta = (caseId: string): CasePresentationMeta => {
  return (
    CASE_PRESENTATION_MAP[caseId] || {
      code: "CASO ATIVO",
      heroTitle: "INVESTIGAÇÃO HISTÓRICA",
      heroSubtitle: "Arquivo Central",
      punchline: "Uma decisão pode mudar o curso da história.",
      backdropDesktop: "/dossiers/archive_room_3d_clean.webp",
      backdropMobile: "/dossiers/archive_room_3d_clean.webp",
      historicalEraBadge: "REGISTRO CLASSIFICADO",
    }
  );
};
