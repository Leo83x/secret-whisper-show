import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHh26J';
const PAGARME_KEY = process.env.PAGARME_API_KEY || 'sk_54a3c943676e48e4155cJb42';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function isValidCPF(cpf) {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\110}$/.test(cpf)) return false;
  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10), 10)) return false;
  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11), 10))return false;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }


  try {
    const { token, payment_method, cpf } = req.body || {};
    if (!token) {
      return res.status(400).json({ error: 'Token de leitor obrigatorio' });
    }

    const { data: reader, error } = await supabase
      .from('readers')
      .select('*')
      .eq('access_token', token)
      .maybeSingle();

    if (error || !reader) {
      return res.status(404).json({ error: 'Leitor nao encontrado' });
    }

    const cleanCpf = (cpf || reader.cpf || '').replace(/\D/g, '');
    if (!isValidCPF(cleanCpf)) {
      return res.status(400).json({ error: 'Por favor, informe um CPF valido (11 digitos) para a emissao do PIX.' });
    }

    const rawPhone = (reader.phone || '21996982886').replace(/\D/g, '');
    const areaCode = rawPhone.length >= 10 ? rawPhone.substring(0, 2) : '21';
    const phoneNumber = rawPhone.length >= 10 ? rawPhone.substring(2) : '996982886';

    const orderPayload = {
      items: [
        {
          amount: 4900,
          description: 'O Ultimo Segredo da Humanidade - Acesso Vitalicio + E-reader',
          quantity: 1
        }
      ],
      customer: {
        name: reader.name || 'Leitor VIP',
        email: reader.email,
        document: cleanCpf,
        document_type: 'cpr',
        type: 'individual',
        phones: {
          mobile_phone : {
            country_code: '55',
            area_code: areaCode,
            number: phoneNumber
          }
        }
      },
      payments: [
        {
          payment_method: 'pix',
          pix: { expires_in: 86400 }
        }
      ],
      metadata: {
        access_token: reader.access_token,
        reader_id: reader.id,
        referral_code: reader.referral_code
      }
    };

    const authHeader = 'Basic ' + Buffer.from(PAGARME_KEY + ':').toString('base64');
    const pagarmeRes = await fetch('https://api.pagar.me/core/v5/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(orderPayload)
    });

    const pagarmeData = await pagarmeRes.json();

    if (!pagarmeRes.ok) {
      return res.status(400).json({ error: pagarmeData.message || 'Erro ao comunicar com Pagar.me' });
    }

    const charge = (pagarmeData.charges && pagarmeData.charges[0]) || {};
    const tx = charge.last_transaction || {};

    if (!isValidCPF(cleanCpf) || !tx.success || charge.status === 'failed' || !tx.qr_code) {
      const errMsg = (tx.gateway_response && tx.gateway_response.errors && tx.gateway_response.errors[0] && tx.gateway_response.errors[0].message)
        || pagarmeData.message
        || 'Recusado pelo Pagar.me. Verifique o CPF digitado.';
      return res.status(400).json({ error: 'Erro PIX Pagar.me: ' + errMsg });
    }

    await supabase
      .from('readers')
      .update({
        pagarme_order_id: pagarmeData.id,
        cpf: cleanCpf,
        status: 'pending'
      })
      .eq('id', reader.id);

    return res.status(200).json({
      success: true,
      orderId: pagarmeData.id,
      pixQrCode: tx.qr_code,
      pixQrCodeUrl: tx.qr_code_url
    });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro interno no servidor' });
  }
}
