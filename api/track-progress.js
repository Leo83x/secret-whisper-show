// API Serverless: Rastreamento de Progresso e Intencao de Compra
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

  const { token, last_chapter, last_chapter_title, clicked_buy } = req.body || {};

  if (!token) {
    return res.status(400).json({ error: 'Token do leitor obrigatorio' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    // 1. Localiza o leitor pelo access_token
    const readerRes = await fetch(`${SUPABASE_URL}/rest/v1/readers?access_token=eq.${encodeURIComponent(token)}&select=id,status`, {
      method: 'GET',
      headers
    });

    const readers = await readerRes.json();
    if (!readerRes.ok || !Array.isArray(readers) || readers.length === 0) {
      return res.status(404).json({ error: 'Leitor nao encontrado' });
    }

    const reader = readers[0];

    // 2. Busca reader_traits existente
    const traitsRes = await fetch(`${SUPABASE_URL}/rest/v1/reader_traits?reader_id=eq.${reader.id}&select=*`, {
      method: 'GET',
      headers
    });

    const traitsList = await traitsRes.json();
    const existingTrait = Array.isArray(traitsList) && traitsList.length > 0 ? traitsList[0] : null;
    const currentProgress = existingTrait && existingTrait.reading_progress ? existingTrait.reading_progress : {};

    // 3. Mescla progresso de leitura
    const newProgress = {
      ...currentProgress,
      last_chapter: last_chapter !== undefined ? last_chapter : (currentProgress.last_chapter !== undefined ? currentProgress.last_chapter : 0),
      last_chapter_title: last_chapter_title || currentProgress.last_chapter_title || '',
      max_chapter: Math.max(currentProgress.max_chapter || 0, last_chapter || 0),
      clicked_buy: clicked_buy === true ? true : (currentProgress.clicked_buy === true),
      updated_at: new Date().toISOString()
    };

    if (clicked_buy === true && !currentProgress.clicked_buy_at) {
      newProgress.clicked_buy_at = new Date().toISOString();
    }

    // 4. Salva ou atualiza em reader_traits
    if (existingTrait) {
      await fetch(`${SUPABASE_URL}/rest/v1/reader_traits?id=eq.${existingTrait.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          reading_progress: newProgress,
          updated_at: new Date().toISOString()
        })
      });
    } else {
      await fetch(`${SUPABASE_URL}/rest/v1/reader_traits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          reader_id: reader.id,
          reading_progress: newProgress,
          interactions: {},
          hypotheses: [],
          explored_links: []
        })
      });
    }

    return res.status(200).json({
      success: true,
      progress: newProgress
    });
  } catch (err) {
    console.error('[Track Progress Error]:', err);
    return res.status(500).json({ error: err.message || 'Erro ao registrar progresso' });
  }
}
