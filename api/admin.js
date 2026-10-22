// API Serverless pura sem dependencias externas (Direct Supabase REST API)
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ush-admin-2026';

  if (token !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Nao autorizado. Senha incorreta.' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

  try {
    const action = req.query.action || (req.body ? req.body.action : null);

    // Acao: Liberacao/Revogacao Manual de Acesso
    if ((action === 'grant-access' || action === 'revoke-access') && req.method === 'POST') {
      const { readerId } = req.body || {};
      if (!readerId) {
        return res.status(400).json({ success: false, error: 'ID do leitor nao fornecido.' });
      }

      const newStatus = action === 'grant-access' ? 'paid' : 'free';

      const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/readers?id=eq.${readerId}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        return res.status(500).json({ success: false, error: `Erro ao alterar no Supabase (${updateRes.status}): ${errText}` });
      }

      const updatedData = await updateRes.json();
      return res.status(200).json({
        success: true,
        message: `Acesso do leitor alterado para ${newStatus === 'paid' ? 'LIBERADO (PAGO)' : 'DEGUSTACAO (GRATIS)'}!`,
        reader: updatedData
      });
    }

    // Chamada REST nativa para listar leitores COM dados de progresso e intencao de compra
    const restRes = await fetch(`${SUPABASE_URL}/rest/v1/readers?select=*,reader_traits(*)&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const readersData = await restRes.json();

    if (!restRes.ok) {
      return res.status(200).json({
        success: false,
        stats: { totalReaders: 0, paidReaders: 0, freeReaders: 0, totalRevenue: 0, clickedBuyCount: 0 },
        readers: [],
        error: `Supabase retornou erro (${restRes.status}). Verifique se o projeto esta ativo.`
      });
    }

    const safeReaders = Array.isArray(readersData) ? readersData : [];
    const totalReaders = safeReaders.length;
    const paidReaders = safeReaders.filter(r => r.status === 'paid').length;
    const freeReaders = safeReaders.filter(r => r.status !== 'paid').length;
    const totalRevenue = paidReaders * 29.90;

    const referralMap = {};
    safeReaders.forEach(r => {
      if (r.referred_by) {
        referralMap[r.referred_by] = (referralMap[r.referred_by] || 0) + 1;
      }
    });

    let clickedBuyTotal = 0;

    const readersWithChain = safeReaders.map(r => {
      const traits = Array.isArray(r.reader_traits) && r.reader_traits.length > 0 ? r.reader_traits[0] : null;
      const progress = traits && traits.reading_progress ? traits.reading_progress : null;

      let lastChapter = 'Não iniciado';
      let lastChapterNum = -1;
      if (progress && progress.last_chapter !== undefined && progress.last_chapter !== null) {
        lastChapterNum = progress.last_chapter;
        if (progress.last_chapter === 0) {
          lastChapter = 'Prólogo';
        } else if (progress.last_chapter_title) {
          lastChapter = progress.last_chapter_title;
        } else {
          lastChapter = `Capítulo ${progress.last_chapter}`;
        }
      }

      const clickedBuy = progress ? progress.clicked_buy === true : false;
      if (clickedBuy) clickedBuyTotal++;

      return {
        ...r,
        referrals_count: referralMap[r.referral_code] || 0,
        ultimo_capitulo_lido: lastChapter,
        ultimo_capitulo_num: lastChapterNum,
        clicou_comprar: clickedBuy,
        clicou_comprar_em: progress?.clicked_buy_at || null
      };
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalReaders,
        paidReaders,
        freeReaders,
        totalRevenue,
        clickedBuyCount: clickedBuyTotal
      },
      readers: readersWithChain
    });

  } catch (err) {
    return res.status(200).json({
      success: false,
      stats: { totalReaders: 0, paidReaders: 0, freeReaders: 0, totalRevenue: 0, clickedBuyCount: 0 },
      readers: [],
      error: `Falha ao conectar com o banco Supabase: ${err.message || String(err)}. Verifique se o projeto no Supabase nao esta pausado por inatividade.`
    });
  }
}
