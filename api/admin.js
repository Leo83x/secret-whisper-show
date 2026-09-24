import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'ush-admin-2026';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (token !== ADMIN_PASS) {
    return res.status(401).json({ error: 'Nao autorizado. Senha incorreta.' });
  }

  try {
    const action = req.query.action || req.body?.action;

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

      if (error) throw error;
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

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Acesso revogado com sucesso!', reader: data });
    }

    // Listagem Geral de Leitores e Métricas
    const { data: readers, error } = await supabase
      .from('readers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalReaders = readers.length;
    const paidReaders = readers.filter(r => r.status === 'paid').length;
    const freeReaders = readers.filter(r => r.status === 'free').length;
    const totalRevenue = paidReaders * 49;

    // Métricas da Corrente (Indicações)
    const referralMap = {};
    readers.forEach(r => {
      if (r.referred_by) {
        referralMap[r.referred_by] = (referralMap[r.referred_by] || 0) + 1;
      }
    });

    const readersWithChain = readers.map(r => ({
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
    return res.status(500).json({ error: err.message || 'Erro interno no servidor' });
  }
}
