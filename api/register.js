import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    const { name, email, phone, ref } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone ? phone.trim() : null;

    // 1. Verifica se o leitor já existe no banco
    const { data: existing, error: selectErr } = await supabase
      .from('readers')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      return res.status(200).json({
        success: true,
        reader: existing,
        message: 'Leitor já cadastrado'
      });
    }

    // 2. Cria novo leitor se não existir
    const accessToken = 'TK_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const firstName = cleanName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const refCode = 'USH-' + (firstName || 'LEITOR') + '-' + Math.floor(1000 + Math.random() * 9000);

    const { data: newReader, error: insertErr } = await supabase
      .from('readers')
      .insert([{
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone,
        status: 'free',
        access_token: accessToken,
        referral_code: refCode,
        referred_by: ref || null
      }])
      .select()
      .single();

    if (insertErr) {
      return res.status(500).json({ error: 'Erro Supabase Insert: ' + insertErr.message });
    }

    // 3. Inicializa os traits/progresso do leitor
    if (newReader) {
      await supabase
        .from('reader_traits')
        .insert([{
          reader_id: newReader.id,
          reading_progress: { max_chapter: 1, last_chapter: 1 }
        }]);
    }

    return res.status(200).json({
      success: true,
      reader: newReader
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erro interno server: ' + (err.message || String(err)) });
  }
}
