import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { token, email } = req.query || {};
  if (!token && !email) {
    return res.status(400).json({ error: 'Informe seu e-mail ou token de leitor.' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    let query = supabase
      .from('readers')
      .select('id, email, name, status, referral_code, access_token, created_at');

    if (token) {
      query = query.eq('access_token', String(token).trim());
    } else if (email) {
      query = query.eq('email', String(email).trim().toLowerCase());
    }

    const { data: reader, error } = await query.maybeSingle();

    if (error || !reader) {
      return res.status(404).json({ error: 'Leitor nao encontrado. Verifique o e-mail utilizado no cadastro ou compra.' });
    }

    const { count: referralCount } = await supabase
      .from('readers')
      .select('id', { count: 'exact', head: true })
      .eq('referred_by', reader.referral_code);

    const { data: traits } = await supabase
      .from('reader_traits')
      .select('interactions, hypotheses, explored_links, reading_progress')
      .eq('reader_id', reader.id)
      .maybeSingle();

    const readerObj = {
      id: reader.id,
      name: reader.name,
      email: reader.email,
      status: reader.status,
      access_token: reader.access_token,
      referral_code: reader.referral_code,
      referralCode: reader.referral_code,
      created_at: reader.created_at
    };

    return res.status(200).json({
      success: true,
      reader: readerObj,
      profile: {
        name: reader.name,
        email: reader.email,
        status: reader.status,
        accessToken: reader.access_token,
        referralCode: reader.referral_code,
        referralLink: 'https://ush-livro.vercel.app/?ref=' + reader.referral_code,
        referralCount: referralCount || 0,
        createdAt: reader.created_at,
        traits: traits || {}
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro interno no servidor' });
  }
}
