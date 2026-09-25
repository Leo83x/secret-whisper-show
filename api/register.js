// Endpoint Serverless compatível com Vercel Node Runtime
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

  const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

  try {
    let name = '';
    let email = '';
    let phone = '';
    let ref = '';

    // Ler body seguro (Object ou JSON String)
    const body = req.body;
    if (body) {
      if (typeof body === 'object') {
        name = body.name || '';
        email = body.email || '';
        phone = body.phone || '';
        ref = body.ref || '';
      } else if (typeof body === 'string') {
        try {
          const parsed = JSON.parse(body);
          name = parsed.name || '';
          email = parsed.email || '';
          phone = parsed.phone || '';
          ref = parsed.ref || '';
        } catch (e) {}
      }
    }

    // Fallback para query params se body vier vazio
    if (!name && req.query && req.query.name) name = req.query.name;
    if (!email && req.query && req.query.email) email = req.query.email;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim();
    const cleanPhone = phone ? String(phone).trim() : null;

    // 1. Consulta se o leitor já existe via REST nativo
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/readers?email=eq.${encodeURIComponent(cleanEmail)}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    const checkText = await checkRes.text();
    let checkData = [];
    if (checkText) {
      try { checkData = JSON.parse(checkText); } catch(e) {}
    }

    if (Array.isArray(checkData) && checkData.length > 0) {
      return res.status(200).json({
        success: true,
        reader: checkData[0],
        message: 'Leitor já cadastrado'
      });
    }

    // 2. Insere novo leitor via REST nativo
    const accessToken = 'TK_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const firstName = cleanName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const refCode = 'USH-' + (firstName || 'LEITOR') + '-' + Math.floor(1000 + Math.random() * 9000);

    const payload = [{
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      status: 'free',
      access_token: accessToken,
      referral_code: refCode,
      referred_by: ref || null
    }];

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/readers`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    const insertText = await insertRes.text();
    let insertData = [];
    if (insertText) {
      try { insertData = JSON.parse(insertText); } catch(e) {}
    }

    if (!insertRes.ok) {
      return res.status(500).json({ error: 'Erro Supabase Insert (' + insertRes.status + '): ' + insertText });
    }

    const newReader = Array.isArray(insertData) ? insertData[0] : insertData;

    // 3. Cria o registro de traits via REST nativo
    if (newReader && newReader.id) {
      await fetch(`${SUPABASE_URL}/rest/v1/reader_traits`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          reader_id: newReader.id,
          reading_progress: { max_chapter: 1, last_chapter: 1 }
        }])
      });
    }

    return res.status(200).json({
      success: true,
      reader: newReader
    });

  } catch (err) {
    return res.status(500).json({ error: 'Erro de execução: ' + (err.stack || err.message || String(err)) });
  }
}
