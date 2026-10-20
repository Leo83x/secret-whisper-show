import { sendMetaConversionEvent, META_PIXEL_ID, META_CONVERSION_TOKEN } from './lib/meta-conversions.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Healthcheck / Diagnostic or Test Event trigger
  if (req.method === 'GET') {
    const { test, code, test_event_code, event } = req.query || {};
    const testCode = code || test_event_code || null;
    const shouldTest = test === 'true' || Boolean(testCode);

    if (shouldTest) {
      const eventName = event || 'Purchase';
      const customData = {
        source: 'meta_capi_test_ping'
      };

      if (eventName === 'Purchase' || eventName === 'InitiateCheckout') {
        customData.currency = 'BRL';
        customData.value = 29.90;
        customData.content_name = 'O Ultimo Segredo da Humanidade - Acesso Vitalicio';
      } else if (eventName === 'Lead') {
        customData.content_name = 'Cadastro Degustacao E-reader';
      }

      const testResult = await sendMetaConversionEvent({
        eventName: eventName,
        eventId: 'test_' + eventName.toLowerCase() + '_' + Date.now(),
        eventSourceUrl: 'https://ultimosegredo.com.br/reader/',
        userData: {
          email: 'diagnostic.test@ultimosegredo.com.br',
          phone: '21996982886',
          name: 'Leitor Teste Meta CAPI'
        },
        customData: customData,
        req,
        testEventCode: testCode
      });

      return res.status(200).json({
        success: testResult.success !== false,
        service: 'Meta Conversions API Test Trigger',
        pixelId: META_PIXEL_ID,
        eventSent: eventName,
        testEventCode: testCode,
        metaResponse: testResult.data || testResult.error,
        instruction: testCode 
          ? 'Evento enviado! Abra a aba Testar Eventos no Gerenciador de Eventos da Meta para visualizar.'
          : 'Evento enviado em modo producao. Para ver na aba de teste, passe ?code=SEU_CODIGO'
      });
    }

    return res.status(200).json({
      service: 'Meta Conversions API Endpoint',
      status: 'active',
      pixelId: META_PIXEL_ID,
      tokenConfigured: !!META_CONVERSION_TOKEN,
      usage: {
        testPurchase: '/api/meta-event/?code=TEST42141',
        testLead: '/api/meta-event/?code=TEST42141&event=Lead',
        testInitiateCheckout: '/api/meta-event/?code=TEST42141&event=InitiateCheckout'
      }
    });
  }

  // POST: Send conversion event
  if (req.method === 'POST') {
    try {
      const {
        eventName = 'PageView',
        eventId,
        eventSourceUrl,
        userData = {},
        customData = {},
        testEventCode,
        code
      } = req.body || {};

      const result = await sendMetaConversionEvent({
        eventName,
        eventId,
        eventSourceUrl,
        userData,
        customData,
        req,
        testEventCode: testEventCode || code || null
      });

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
