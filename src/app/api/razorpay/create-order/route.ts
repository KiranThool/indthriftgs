import { NextResponse } from 'next/server';
import { createRazorpayOrder, isRazorpayConfigured } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        {
          configured: false,
          message:
            'Razorpay live API credentials (RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET) are not configured in .env.local. Direct placement mode is available for testing.',
        },
        { status: 200 }
      );
    }

    // Convert amount in INR to paise
    const razorpayOrder = await createRazorpayOrder({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      notes: notes || {},
    });

    return NextResponse.json({
      configured: true,
      order: razorpayOrder,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
