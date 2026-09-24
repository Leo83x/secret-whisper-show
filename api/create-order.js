import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';
const PAGARME_KEY = process.env.PAGARME_API_KEY || 'sk_54a3c94367f448e48b15cdb7f0e39b42';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, payment_method } = req.body || {};
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

    const orderPayload = {
      items: [
        {
          amount: 4900,
          description: 'O Ultimo Segredo da Humanidade - Acesso Vitalicio + E-reader',
          quantity: 1
        }
      ],
      customer: {
        name: reader.name,
        email: reader.email,
        phones: reader.phone ? {
          mobile_phone: {
            country_code: '55',
            area_code: reader.phone.replace(/\D/g, '').substring(0, 2) || '11',
            number: reader.phone.replace(/\D/g, '').substring(2) || '999999999'
          }
        } : undefined
      },
      payments: [
        {
          payment_method: payment_method === 'pix' ? 'pix' : 'checkout',
          pix: payment_method === 'pix' ? { expires_in: 86400 } : undefined,
          checkout: payment_method !== 'pix' ? {
            expires_in: 86400,
            billing_address_editable: false,
            customer_editable: false,
            accepted_payment_methods: ['credit_card', 'pix', 'boleto'],
            success_url: `https://ush-livro.vercel.app/reader/?token=${reader.access_token}&status=success`
          } : undefined
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
      return res.status(400).json({ error: pagarmeData.message || 'Erro ao gerar cobrança no Pagar.me' });
    }

    await supabase
      .from('readers')
      .update({ pagarme_order_id: pagarmeData.id, status: 'pending' })
      .eq('id', reader.id);

    const checkoutUrl = pagarmeData.checkouts && pagarmeData.checkouts[0] ? pagarmeData.checkouts[0].payment_url : null;
    const pixData = pagarmeData.charges && pagarmeData.charges[0] && pagarmeData.charges[0].last_transaction ? pagarmeData.charges[0].last_transaction : null;

    return res.status(200).json({
      success: true,
      orderId: pagarmeData.id,
      checkoutUrl: checkoutUrl,
      pix: pixData
    });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro interno no servidor' });
  }
}
