// API Serverless pura para captura de Carrinho Abandonado no Supabase
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

  const { name, email, phone, ref } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPhone = String(phone || '').replace(/\D/g, '');
  const cleanName = String(name || '').trim();

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

  try {
    // Verifica se leitor ja existe
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/readers?email=eq.${encodeURIComponent(cleanEmail)}&select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const existingReaders = await checkRes.json();
    const existing = Array.isArray(existingReaders) && existingReaders.length > 0 ? existingReaders[0] : null;

    if (existing) {
      // Se ja pagou, nao rebaixa status
      if (existing.status === 'paid') {
        return res.status(200).json({ success: true, status: 'paid', token: existing.access_token });
      }

      // Atualiza telefone, nome e marca status de carrinho abandonado
      await fetch(`${SUPABASE_URL}/rest/v1/readers?id=eq.${existing.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: cleanName || existing.name,
          phone: cleanPhone || existing.phone,
          status: 'carrinho_abandonado'
        })
      });

      return res.status(200).json({ success: true, token: existing.access_token });
    } else {
      // Cria novo leitor como carrinho abandonado
      const firstPart = cleanName.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').substring(0, 8) || 'LEITOR';
      const newRefCode = 'USH-' + firstPart + '-' + Math.floor(1000 + Math.random() * 9000);
      const newAccessToken = 'TK_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);

      const createRes = await fetch(`${SUPABASE_URL}/rest/v1/readers`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name: cleanName || 'Interessado Edição Especial',
          email: cleanEmail,
          phone: cleanPhone,
          access_token: newAccessToken,
          referral_code: newRefCode,
          referred_by: ref || null,
          status: 'carrinho_abandonado'
        })
      });

      const created = await createRes.json();
      const reader = Array.isArray(created) ? created[0] : created;

      return res.status(200).json({ success: true, token: reader?.access_token || newAccessToken });
    }
  } catch (err) {
    console.error('Error recording abandoned cart:', err);
    return res.status(500).json({ error: 'Erro ao registrar carrinho abandonado' });
  }
}
