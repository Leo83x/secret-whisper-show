import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';
const PAGARME_KEY = process.env.PAGARME_API_KEY || 'sk_54a3c94367f448e48b15cdb7f0e39b42';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function isValidCPF(cpf) {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
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
  if (remainder !== parseInt(cpf.substring(10, 11), 10)) return false;
  return true;
}

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
    const { token, payment_method, cpf, card } = req.body || {};
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

    const cleanCpf = (cpf || (card && card.cpf) || reader.cpf || '').replace(/\D/g, '');
    if (!isValidCPF(cleanCpf)) {
      return res.status(400).json({ error: 'Por favor, informe um CPF valido (11 digitos).' });
    }

    const rawPhone = (reader.phone || '21996982886').replace(/\D/g, '');
    const areaCode = rawPhone.length >= 10 ? rawPhone.substring(0, 2) : '21';
    const phoneNumber = rawPhone.length >= 10 ? rawPhone.substring(2) : '996982886';

    const method = payment_method === 'credit_card' ? 'credit_card' : 'pix';

    const orderPayload = {
      items: [
        {
          amount: 2990,
          description: 'O Ultimo Segredo da Humanidade - Acesso Vitalicio + E-reader (Oferta de Lancamento)',
          quantity: 1
        }
      ],
      customer: {
        name: (card && card.holder_name) || reader.name || 'Leitor VIP',
        email: reader.email,
        document: cleanCpf,
        document_type: 'cpf',
        type: 'individual',
        phones: {
          mobile_phone: {
            country_code: '55',
            area_code: areaCode,
            number: phoneNumber
          }
        }
      },
      payments: [],
      metadata: {
        access_token: reader.access_token,
        reader_id: reader.id,
        referral_code: reader.referral_code
      }
    };

    if (method === 'pix') {
      orderPayload.payments.push({
        payment_method: 'pix',
        pix: { expires_in: 86400 }
      });
    } else {
      // Cartao de Credito
      const { number, holder_name, exp_month, exp_year, cvv, installments, billing_address } = card || {};
      if (!number || !holder_name || !exp_month || !exp_year || !cvv) {
        return res.status(400).json({ error: 'Preencha todos os campos do cartao (numero, nome, validade e CVV).' });
      }

      const cleanNumber = String(number).replace(/\D/g, '');
      const cleanCvv = String(cvv).replace(/\D/g, '');
      const cleanMonth = parseInt(exp_month, 10);
      let cleanYear = parseInt(exp_year, 10);
      if (cleanYear < 100) cleanYear += 2000;

      const numInstallments = Math.max(1, Math.min(12, parseInt(installments || 1, 10)));

      orderPayload.payments.push({
        payment_method: 'credit_card',
        credit_card: {
          recurrence: false,
          installments: numInstallments,
          statement_descriptor: 'USH LIVRO',
          card: {
            number: cleanNumber,
            holder_name: String(holder_name).trim().toUpperCase(),
            exp_month: cleanMonth,
            exp_year: cleanYear,
            cvv: cleanCvv,
            billing_address: billing_address || {
              line_1: 'Av Paulista, 1000',
              zip_code: '01310100',
              city: 'Sao Paulo',
              state: 'SP',
              country: 'BR'
            }
          }
        }
      });
    }

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
      let errDetail = pagarmeData.message || '';
      if (pagarmeData.errors) {
        try {
          const errList = [];
          for (const key in pagarmeData.errors) {
            const val = pagarmeData.errors[key];
            errList.push(key + ': ' + (Array.isArray(val) ? val.join(', ') : val));
          }
          if (errList.length) errDetail += ' (' + errList.join('; ') + ')';
        } catch(e) {}
      }
      return res.status(400).json({ error: 'Erro Pagar.me: ' + (errDetail || JSON.stringify(pagarmeData)) });
    }

    const charge = (pagarmeData.charges && pagarmeData.charges[0]) || {};
    const tx = charge.last_transaction || {};

    if (method === 'pix') {
      if (!tx.qr_code) {
        const errMsg = (tx.gateway_response && tx.gateway_response.errors && tx.gateway_response.errors[0] && tx.gateway_response.errors[0].message)
          || pagarmeData.message
          || 'PIX nao gerado. Verifique o CPF e tente novamente.';
        return res.status(400).json({ error: 'Erro PIX: ' + errMsg });
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
    } else {
      // Cartao de Credito - Checar status da cobranca
      const chargeStatus = charge.status || pagarmeData.status;

      if (chargeStatus === 'paid') {
        // Aprovado imediatamente!
        await supabase
          .from('readers')
          .update({
            pagarme_order_id: pagarmeData.id,
            cpf: cleanCpf,
            status: 'paid'
          })
          .eq('id', reader.id);

        return res.status(200).json({
          success: true,
          paid: true,
          orderId: pagarmeData.id,
          message: 'Pagamento aprovado com sucesso! Seu acesso ao livro está liberado.'
        });
      } else if (chargeStatus === 'failed') {
        const declineMsg = (tx.gateway_response && tx.gateway_response.errors && tx.gateway_response.errors[0] && tx.gateway_response.errors[0].message)
          || (tx.acquirer_message)
          || 'Cartão recusado pelo emissor. Verifique os dados, o limite ou tente outro cartão.';
        return res.status(400).json({ error: declineMsg });
      } else {
        // Em analise / processamento
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
          paid: false,
          pending: true,
          orderId: pagarmeData.id,
          message: 'Transação em análise pela operadora. O acesso será liberado assim que confirmado.'
        });
      }
    }

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Erro interno no servidor' });
  }
}
