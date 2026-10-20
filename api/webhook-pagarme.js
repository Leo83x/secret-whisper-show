import { createClient } from '@supabase/supabase-js';
import { sendMetaConversionEvent } from './lib/meta-conversions.js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body || {};
    const eventType = payload.type || payload.event;
    const orderData = payload.data || {};

    // Verifica se e um evento de pagamento confirmado (order.paid ou charge.paid)
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

          // 2. Registra na tabela da Corrente se o leitor veio por indicacao
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
          const amountCharged = orderData.amount ? (orderData.amount / 100) : 29.90;
          await sendMetaConversionEvent({
            eventName: 'Purchase',
            eventId: `order_${orderId}`,
            eventSourceUrl: 'https://ultimosegredo.com.br/reader/',
            userData: {
              email: reader.email,
              phone: reader.phone,
              name: reader.name,
              external_id: reader.access_token
            },
            customData: {
              currency: 'BRL',
              value: amountCharged,
              content_name: 'O Ultimo Segredo da Humanidade - Acesso Vitalicio + E-reader',
              content_type: 'product',
              order_id: String(orderId)
            },
            req
          });
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
