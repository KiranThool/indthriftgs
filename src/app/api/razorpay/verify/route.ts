import { NextResponse } from 'next/server';
import { verifyRazorpaySignature, isRazorpayConfigured } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required signature verification fields' },
        { status: 400 }
      );
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Razorpay credentials are not configured. Cannot verify signature on server.',
        },
        { status: 400 }
      );
    }

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (isValid) {
      return NextResponse.json({
        success: true,
        payment_id: razorpay_payment_id,
        message: 'Cryptographic signature verified successfully',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Cryptographic signature verification failed' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Signature verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Verification exception' },
      { status: 500 }
    );
  }
}
