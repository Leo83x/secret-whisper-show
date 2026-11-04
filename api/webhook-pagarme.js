import { createClient } from '@supabase/supabase-js';
import { sendMetaConversionEvent } from './lib/meta-conversions.js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ydezgyxfggplxapargdq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_-qMnoAUnFU0chU6ySsDaXQ_pHHhU26J';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function markReaderClickedBuy(readerId) {
  try {
    const { data: traits } = await supabase.from('reader_traits').select('id, reading_progress').eq('reader_id', readerId).maybeSingle();
    const nowIso = new Date().toISOString();
    if (traits) {
      const prog = traits.reading_progress || {};
      await supabase.from('reader_traits').update({
        reading_progress: { ...prog, clicked_buy: true, clicked_buy_at: prog.clicked_buy_at || nowIso, purchased_at: prog.purchased_at || nowIso },
        updated_at: nowIso
      }).eq('id', traits.id);
    } else {
      await supabase.from('reader_traits').insert([{
        reader_id: readerId,
        reading_progress: { last_chapter: 0, last_chapter_title: 'Não iniciado', max_chapter: 0, clicked_buy: true, clicked_buy_at: nowIso, purchased_at: nowIso },
        interactions: {},
        hypotheses: [],
        explored_links: []
      }]);
    }
  } catch (e) {
    console.error('Error marking clicked_buy in webhook:', e);
  }
}

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

      const readerId = metadata.reader_id;
      const customerEmail = (orderData.customer && orderData.customer.email) || (orderData.order && orderData.order.customer && orderData.order.customer.email);

      if (accessToken || orderId || readerId || customerEmail) {
        // Busca o leitor no Supabase (com multiplas camadas de seguranca)
        let reader = null;
        if (accessToken) {
          const { data } = await supabase.from('readers').select('*').eq('access_token', accessToken).maybeSingle();
          if (data) reader = data;
        }
        if (!reader && readerId) {
          const { data } = await supabase.from('readers').select('*').eq('id', readerId).maybeSingle();
          if (data) reader = data;
        }
        if (!reader && orderId) {
          const { data } = await supabase.from('readers').select('*').eq('pagarme_order_id', orderId).maybeSingle();
          if (data) reader = data;
        }
        if (!reader && customerEmail) {
          const { data } = await supabase.from('readers').select('*').eq('email', customerEmail.trim().toLowerCase()).maybeSingle();
          if (data) reader = data;
        }

        if (reader) {
          // 1. Atualiza o status do leitor no Supabase para PAID (Acesso liberado!)
          await supabase
            .from('readers')
            .update({
              status: 'paid',
              pagarme_order_id: orderId || reader.pagarme_order_id
            })
            .eq('id', reader.id);

          await markReaderClickedBuy(reader.id);

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
