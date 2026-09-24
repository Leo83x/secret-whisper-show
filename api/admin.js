import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ush-admin-2026';

export default async function handler(req, res) {
  // Configuração de cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (token !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Nao autorizado. Senha incorreta.' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const action = req.query.action || (req.body ? req.body.action : null);

    // Ação: Liberação Manual de Acesso (Upgrade free -> paid)
    if (action === 'grant-access' && req.method === 'POST') {
      const { readerId } = req.body || {};
      if (!readerId) return res.status(400).json({ error: 'readerId obrigatorio' });

      const { data, error } = await supabase
        .from('readers')
        .update({ status: 'paid' })
        .eq('id', readerId)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, message: 'Acesso vitalicio liberado com sucesso!', reader: data });
    }

    // Ação: Revogar Acesso (paid -> free)
    if (action === 'revoke-access' && req.method === 'POST') {
      const { readerId } = req.body || {};
      if (!readerId) return res.status(400).json({ error: 'readerId obrigatorio' });

      const { data, error } = await supabase
        .from('readers')
        .update({ status: 'free' })
        .eq('id', readerId)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true, message: 'Acesso revogado com sucesso!', reader: data });
    }

    // Listagem Geral de Leitores e Métricas
    const { data: readers, error } = await supabase
      .from('readers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Erro no Supabase: ' + error.message });
    }

    const safeReaders = readers || [];
    const totalReaders = safeReaders.length;
    const paidReaders = safeReaders.filter(r => r.status === 'paid').length;
    const freeReaders = safeReaders.filter(r => r.status === 'free').length;
    const totalRevenue = paidReaders * 49;

    // Métricas da Corrente (Indicações)
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
    return res.status(500).json({ error: 'Erro de execução: ' + (err.message || String(err)) });
  }
}
