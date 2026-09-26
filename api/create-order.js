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
    const {
      token,
      payment_method,
      cpf,
      card_number,
      card_holder_name,
      card_expiry_month,
      card_expiry_year,
      card_cvv
    } = req.body || {};

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

    const docCpf= (cpf || reader.cpf || '11111111111').replace(/\D/g, '');
    const cleanCpf = docCpf.length === 11 ? docCpf : '11111111111';

    // Se os dados do cartao forem enviados, cria cobranca de cartao
    let paymentPayload = {};
    if (payment_method === 'credit_card' && card_number) {
      paymentPayload = {
        payment_method: 'credit_card',
        credit_card: {
          installments: 1,
          statement_descriptor: 'USH LSVRO',
          card: {
            number: card_number.replace(/\D/g, ''),
            holder_name: card_holder_name ? card_holder_name.toUpperCase() : reader.name.toUpperCase(),
            exp_month: parseInt(card_expiry_month, 10),
            exp_year: parseInt(card_expiry_year, 10),
            cvv: card_cvv
          }
        }
      };
    } else {
      paymentPayload = {
        payment_method: 'pix',
        pix: { expires_in: 86400 }
      };
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
        name: reader.name || 'Leitor VIP',
        email: reader.email,
        document: cleanCpf,
        document_type: 'cpf',
        type: 'individual',
        phones: reader.phone ? {
          mobile_phone : {
            country_code: '55',
            area_code: reader.phone.replace(/\D/g, '').substring(0, 2) || '11',
            number: reader.phone.replace(/\D/g, '').substring(2) || '999999999'
          }
        } : undefined
      },
      payments: [paymentPayload],
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
      return res.status(400).json({ error: pagarmeData.message || 'Erro ao gerar cobranca no Pagar.me' });
    }

    const charge = pagarmeData.charges && pagarmeData.charges[0] ? pagarmeData.charges[0] : {};
    const tx = charge.last_transaction ? charge.last_transaction : {};
    const isPaid = pagarmeData.status === 'paid' || charge.status === 'paid';

    await supabase
      .from('readers')
      .update({
        pagarme_order_id: pagarmeData.id,
        cpf: cleanCpf,
        status: isPaid ? 'paid' : 'pending'
      })
      .eq('id', reader.id);

    return res.status(200).json({
      success: true,
      isPaid: isPaid,
      orderId: pagarmeData.id,
      pix: {
        qr_code: tx.qr_code || tx.qrtcode || tx.qr_code,
        qr_code_url: tx.qr_code_url || tx.qr_code_url
      }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro interno no servidor' });
  }
}
