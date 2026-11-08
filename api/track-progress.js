// API Serverless: Rastreamento de Progresso do E-Reader + Central de Investigação 3D (Supabase)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  const {
    token,
    accessToken,
    last_chapter,
    last_chapter_title,
    clicked_buy,
    investigation_state,
    community_notes,
  } = req.body || {};

  const effectiveToken = token || accessToken;

  if (!effectiveToken) {
    return res.status(400).json({ error: 'Token do leitor obrigatorio' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
  const SUPABASE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    // 1. Localiza o leitor pelo access_token
    const readerRes = await fetch(
      `${SUPABASE_URL}/rest/v1/readers?access_token=eq.${encodeURIComponent(effectiveToken)}&select=id,status`,
      { method: 'GET', headers }
    );

    const readers = await readerRes.json();
    if (!readerRes.ok || !Array.isArray(readers) || readers.length === 0) {
      return res.status(404).json({ error: 'Leitor nao encontrado' });
    }

    const reader = readers[0];

    // 2. Busca reader_traits existente
    const traitsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/reader_traits?reader_id=eq.${reader.id}&select=*`,
      { method: 'GET', headers }
    );

    const traitsList = await traitsRes.json();
    const existingTrait = Array.isArray(traitsList) && traitsList.length > 0 ? traitsList[0] : null;
    const currentProgress =
      existingTrait && existingTrait.reading_progress ? existingTrait.reading_progress : {};
    const currentInteractions =
      existingTrait && existingTrait.interactions ? existingTrait.interactions : {};

    // 3. Mescla progresso de leitura do livro
    const newProgress = {
      ...currentProgress,
      last_chapter:
        last_chapter !== undefined
          ? last_chapter
          : currentProgress.last_chapter !== undefined
          ? currentProgress.last_chapter
          : 0,
      last_chapter_title: last_chapter_title || currentProgress.last_chapter_title || '',
      max_chapter: Math.max(currentProgress.max_chapter || 0, last_chapter || 0),
      clicked_buy: clicked_buy === true ? true : currentProgress.clicked_buy === true,
      updated_at: new Date().toISOString(),
    };

    if (clicked_buy === true && !currentProgress.clicked_buy_at) {
      newProgress.clicked_buy_at = new Date().toISOString();
    }

    // 4. Mescla estado completo da Central de Investigação 3D e Mural de Campo em interactions (JSONB)
    const newInteractions = {
      ...currentInteractions,
      ...(investigation_state
        ? {
            investigation_state: {
              ...(currentInteractions.investigation_state || {}),
              ...investigation_state,
              synced_at: new Date().toISOString(),
            },
          }
        : {}),
      ...(community_notes ? { community_notes } : {}),
    };

    const updatedHypotheses =
      investigation_state && investigation_state.formulatedHypotheses
        ? Object.entries(investigation_state.formulatedHypotheses).map(([caseId, text]) => ({
            caseId,
            text,
          }))
        : existingTrait?.hypotheses || [];

    const updatedExploredLinks =
      investigation_state && Array.isArray(investigation_state.completedNodes)
        ? investigation_state.completedNodes
        : existingTrait?.explored_links || [];

    // 5. Salva ou atualiza em reader_traits no Supabase
    if (existingTrait) {
      await fetch(`${SUPABASE_URL}/rest/v1/reader_traits?id=eq.${existingTrait.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          reading_progress: newProgress,
          interactions: newInteractions,
          hypotheses: updatedHypotheses,
          explored_links: updatedExploredLinks,
          updated_at: new Date().toISOString(),
        }),
      });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/reader_traits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          reader_id: reader.id,
          reading_progress: newProgress,
          interactions: newInteractions,
          hypotheses: updatedHypotheses,
          explored_links: updatedExploredLinks,
        }),
      });
    }

    return res.status(200).json({
      success: true,
      progress: newProgress,
      interactions: newInteractions,
    });
  } catch (err) {
    console.error('[Track Progress Error]:', err);
    return res.status(500).json({ error: err.message || 'Erro ao registrar progresso' });
  }
}
