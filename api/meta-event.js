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
    const { test, code, event } = req.query || {};

    if (test === 'true') {
      const testResult = await sendMetaConversionEvent({
        eventName: event || 'PageView',
        eventId: 'test_' + Date.now(),
        eventSourceUrl: 'https://ultimosegredo.com.br/reader/',
        userData: {
          email: 'diagnostic@test.com',
          name: 'Meta CAPI Diagnostic'
        },
        customData: {
          source: 'diagnostic_ping'
        },
        req,
        testEventCode: code || null
      });

      return res.status(200).json({
        service: 'Meta Conversions API Diagnostic',
        pixelId: META_PIXEL_ID,
        tokenConfigured: !!META_CONVERSION_TOKEN,
        testResult
      });
    }

    return res.status(200).json({
      service: 'Meta Conversions API Endpoint',
      status: 'active',
      pixelId: META_PIXEL_ID,
      tokenConfigured: !!META_CONVERSION_TOKEN
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
        testEventCode
      } = req.body || {};

      const result = await sendMetaConversionEvent({
        eventName,
        eventId,
        eventSourceUrl,
        userData,
        customData,
        req,
        testEventCode
      });

      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
