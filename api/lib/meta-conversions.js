import crypto from 'crypto';

export const META_PIXEL_ID = process.env.META_PIXEL_ID || '29098135723126727';
export const META_CONVERSION_TOKEN = process.env.META_CONVERSION_API_TOKEN || 'EAAWlvZAx59ZA0BS2BfaKMOQn8ITXnztRw0T7hiqfiHhYSZCfopy3JRQpZAw9IgF0YaVtmbtHhiECA8ZC6H3v7NqU6MGzrv6O5wvIGn1JMDQ7k8efIoGieLuBksSgJ7fShex1slZBpaO6NmCE2r0NJ3aZA5sZC7zXZAMnvZAYZCehi2XZAZAZBmO8q0LJiK9ol1vGhdmTCakgZDZD';

/**
 * SHA-256 hash helper complying with Meta CAPI requirements
 */
export function hashData(val) {
  if (!val || typeof val !== 'string') return null;
  const clean = val.trim().toLowerCase();
  if (!clean) return null;
  return crypto.createHash('sha256').update(clean).digest('hex');
}

/**
 * Format and hash phone number with country code (defaults to 55 Brazil)
 */
export function hashPhone(phone) {
  if (!phone) return null;
  let digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10 || digits.length === 11) {
    digits = '55' + digits;
  }
  return crypto.createHash('sha256').update(digits).digest('hex');
}

/**
 * Extract cookies like _fbp and _fbc from request
 */
export function getMetaCookies(req) {
  const cookieHeader = req?.headers?.cookie || '';
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const parts = c.trim().split('=');
    if (parts.length >= 2) {
      cookies[parts[0]] = decodeURIComponent(parts.slice(1).join('='));
    }
  });
  return {
    fbp: cookies['_fbp'] || null,
    fbc: cookies['_fbc'] || null
  };
}

/**
 * Send conversion event to Meta Conversions API (Graph API)
 */
export async function sendMetaConversionEvent({
  eventName,
  eventId = null,
  eventSourceUrl = 'https://ultimosegredo.com.br/reader/',
  userData = {},
  customData = {},
  req = null,
  testEventCode = null
}) {
  try {
    const token = META_CONVERSION_TOKEN;
    const pixelId = META_PIXEL_ID;

    if (!token || !pixelId) {
      console.warn('[Meta CAPI] Token or Pixel ID missing, skipping event.');
      return { skipped: true };
    }

    // IP address extraction
    let clientIp = null;
    if (req) {
      const forwarded = req.headers?.['x-forwarded-for'];
      clientIp = forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress;
    }

    // User agent extraction
    const clientUserAgent = req?.headers?.['user-agent'] || null;

    // Cookie extraction
    const metaCookies = req ? getMetaCookies(req) : {};
    const fbp = userData.fbp || metaCookies.fbp || null;
    const fbc = userData.fbc || metaCookies.fbc || null;

    // First and last names
    let fnHash = null;
    let lnHash = null;
    if (userData.name) {
      const parts = userData.name.trim().split(/\s+/);
      if (parts.length > 0) fnHash = hashData(parts[0]);
      if (parts.length > 1) lnHash = hashData(parts.slice(1).join(' '));
    }

    const formattedUserData = {};

    const emHash = hashData(userData.email);
    if (emHash) formattedUserData.em = [emHash];

    const phHash = hashPhone(userData.phone);
    if (phHash) formattedUserData.ph = [phHash];

    if (fnHash) formattedUserData.fn = [fnHash];
    if (lnHash) formattedUserData.ln = [lnHash];

    if (userData.external_id) {
      formattedUserData.external_id = [hashData(String(userData.external_id))];
    }

    if (clientIp) formattedUserData.client_ip_address = clientIp;
    if (clientUserAgent) formattedUserData.client_user_agent = clientUserAgent;
    if (fbp) formattedUserData.fbp = fbp;
    if (fbc) formattedUserData.fbc = fbc;

    const eventPayload = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: eventSourceUrl,
      user_data: formattedUserData,
      custom_data: customData
    };

    if (eventId) {
      eventPayload.event_id = String(eventId);
    }

    const bodyPayload = {
      data: [eventPayload]
    };

    if (testEventCode) {
      bodyPayload.test_event_code = testEventCode;
    }

    const apiUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload)
    });

    const resData = await response.json();
    if (!response.ok) {
      console.error('[Meta CAPI Error]', resData);
      return { success: false, error: resData };
    }

    console.log(`[Meta CAPI Success] Event "${eventName}" sent. Events received:`, resData.events_received);
    return { success: true, data: resData };

  } catch (err) {
    console.error('[Meta CAPI Exception]', err.message);
    return { success: false, error: err.message };
  }
}
