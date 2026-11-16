import crypto from 'crypto';

export interface RazorpayOrderPayload {
  amount: number; // in paise (e.g. 100 INR = 10000 paise)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export const isRazorpayConfigured = () => {
  return (
    process.env.RAZORPAY_KEY_ID !== undefined &&
    process.env.RAZORPAY_KEY_ID !== '' &&
    process.env.RAZORPAY_KEY_SECRET !== undefined &&
    process.env.RAZORPAY_KEY_SECRET !== ''
  );
};

export const getRazorpayPublicKey = () => {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || '';
};

/**
 * Server-side order creation with Razorpay REST API
 */
export async function createRazorpayOrder(payload: RazorpayOrderPayload) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      'Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local.'
    );
  }

  const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${basicAuth}`,
    },
    body: JSON.stringify({
      amount: payload.amount,
      currency: payload.currency || 'INR',
      receipt: payload.receipt,
      notes: payload.notes || {},
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.description || 'Failed to create Razorpay order');
  }

  return response.json();
}

/**
 * Server-side cryptographic HMAC SHA-256 signature verification
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return false;

  const generatedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
}
