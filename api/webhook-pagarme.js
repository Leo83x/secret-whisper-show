import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';
const META_PIXEL_ID = process.env.META_PIXEL_ID || '29098135723126727';
const META_CONVERSION_TOKEN = process.env.META_CONVERSION_API_TOKEN;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body || {};
    const eventType = payload.type || payload.event;
    const orderData = payload.data || {};

    // Verifica se é um evento de pagamento confirmado (order.paid ou charge.paid)
    const isPaid = eventType === 'order.paid' || eventType === 'charge.paid' || (orderData.status === 'paid');

    if (isPaid) {
      const orderId = orderData.id || (orderData.order ? orderData.order.id : null);
      const metadata = orderData.metadata || (orderData.order ? orderData.order.metadata : {}) || {};
      const accessToken = metadata.access_token;

      if (accessToken || orderId) {
        // Busca o leitor no Supabase
        let query = supabase.from('readers').select('*');
        if (accessToken) {
          query = query.eq('access_token', accessToken);
        } else {
          query = query.eq('pagarme_order_id', orderId);
        }

        const { data: reader } = await query.maybeSingle();

        if (reader) {
          // 1. Atualiza o status do leitor no Supabase para PAID (Acesso liberado!)
          await supabase
            .from('readers')
            .update({ status: 'paid' })
            .eq('id', reader.id);

          // 2. Registra na tabela da Corrente se o leitor veio por indicação
          if (reader.referred_by) {
            const { data: referrer } = await supabase
              .from('readers')
              .select('id')
              .eq('referral_code', reader.referred_by)
              .maybeSingle();

            if (referrer) {
              await supabase
                .from('referral_chain')
                .insert([{ referrer_id: referrer.id, converted_reader_id: reader.id }]);
            }
          }

          // 3. Dispara o evento Purchase para a Meta Conversion API (Server-side)
          if (META_CONVERSION_TOKEN) {
            try {
              await fetch(`https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events?access_token=${META_CONVERSION_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  data: [
                    {
                      event_name: 'Purchase',
                      event_time: Math.floor(Date.now() / 1000),
                      action_source: 'website',
                      user_data: {
                        em: [Buffer.from(reader.email.trim().toLowerCase()).toString('hex')],
                        fn: [Buffer.from(reader.name.trim().toLowerCase()).toString('hex')]
                      },
                      custom_data: {
                        currency: 'BRL',
                        value: 49.00
                      }
                    }
                  ]
                })
              });
            } catch (convErr) {
              console.error('Meta Conv API Error:', convErr);
            }
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
