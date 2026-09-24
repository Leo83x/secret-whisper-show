// API Serverless pura sem dependências externas (Direct Supabase REST API)
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
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

  try {
    const action = req.query.action || (req.body ? req.body.action : null);

    // Ação: Liberação/Revogação Manual
    if ((action === 'grant-access' || action === 'revoke-access') && req.method === 'POST') {
      const { readerId } = req.body || {};
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

      const updatedData = await updateRes.json();
      return res.status(200).json({ success: true, message: `Status alterado para ${newStatus} com sucesso!`, reader: updatedData });
    }

    // Chamada REST nativa para listar leitores (sem SDK)
    const restRes = await fetch(`${SUPABASE_URL}/rest/v1/readers?select=*&order=created_at.desc`, {
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
        success: true,
        stats: { totalReaders: 0, paidReaders: 0, freeReaders: 0, totalRevenue: 0 },
        readers: [],
        supaError: readersData
      });
    }

    const safeReaders = Array.isArray(readersData) ? readersData : [];
    const totalReaders = safeReaders.length;
    const paidReaders = safeReaders.filter(r => r.status === 'paid').length;
    const freeReaders = safeReaders.filter(r => r.status === 'free').length;
    const totalRevenue = paidReaders * 49;

    const referralMap = {};
    safeReaders.forEach(r => {
      if (r.referred_by) {
        referralMap[r.referred_by] = (referralMap[r.referred_by] || 0) + 1;
      }
    });

    const readersWithChain = safeReaders.map(r => ({
      ...r,
      referrals_count: referralMap[r.referral_code] || 0
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalReaders,
        paidReaders,
        freeReaders,
        totalRevenue
      },
      readers: readersWithChain
    });

  } catch (err) {
    return res.status(200).json({
      success: true,
      stats: { totalReaders: 0, paidReaders: 0, freeReaders: 0, totalRevenue: 0 },
      readers: [],
      error: String(err)
    });
  }
}
