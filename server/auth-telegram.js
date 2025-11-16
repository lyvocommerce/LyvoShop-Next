// src/app/auth-telegram.js
import crypto from 'node:crypto';

// ✅ Telegram WebApp data validation — final version
export function verifyTelegramInitData(initData, botToken) {
  try {
    // 🩵 Попробуем двойное декодирование и нормализацию
    let decoded = decodeURIComponent(initData);
    decoded = decoded.replace(/\\\//g, '/'); // заменяем все '\/' на '/'

    const params = new URLSearchParams(decoded);
    const hash = params.get('hash');
    if (!hash) return false;

    // Формируем data_check_string
    const pairs = [];
    for (const [key, value] of params.entries()) {
      if (key !== 'hash') pairs.push(`${key}=${value}`);
    }
    pairs.sort();
    const dataCheckString = pairs.join('\n');

    // ✅ secret = HMAC_SHA256("WebAppData", botToken)
    const secret = crypto.createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // ✅ computed = HMAC_SHA256(secret, data_check_string)
    const computed = crypto.createHmac('sha256', secret)
      .update(dataCheckString)
      .digest('hex');

    console.log('[Auth Debug]', { decoded, computed, hash, match: computed === hash });
    return computed === hash;
  } catch (err) {
    console.error('[Auth Error]', err);
    return false;
  }
}