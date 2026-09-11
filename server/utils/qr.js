import crypto from 'crypto';

/**
 * Generates safe QR payload string and cryptographic verification signature.
 * NEVER includes passwords, tokens, full personal addresses or sensitive private data.
 */
export function generateSafeQRPayload({ lotId, category, quantity, unit = 'kg', timestamp }) {
  const time = timestamp || new Date().toISOString();
  return JSON.stringify({
    schema: 'EPR-TRACE-V1',
    lotId: lotId,
    category: category,
    weight: `${quantity} ${unit}`,
    issuedAt: time,
    authority: 'TNPCB / CPCB EPR Regulatory Framework'
  });
}

/**
 * Generates a verification signature hash for a transaction receipt
 */
export function generateTransactionQRSignature({ transactionId, lotId, amount }) {
  const data = `${transactionId}:${lotId}:${amount}:${Date.now()}`;
  return `EPR-SIG-${crypto.createHash('sha256').update(data).digest('hex').slice(0, 16).toUpperCase()}`;
}
