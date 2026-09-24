import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ush-admin-2026';

  const authHeader = req.headers.authorization || req.headers.Authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (token !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Nao autorizado. Senha incorreta.' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Listagem Geral de Leitores e Métricas
    const { data: readers, error } = await supabase
      .from('readers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(200).json({
        success: true,
        stats: { totalReaders: 0, paidReaders: 0, freeReaders: 0, totalRevenue: 0 },
        readers: [],
        note: 'Supabase table empty or error: ' + error.message
      });
    }

    const safeReaders = readers || [];
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
