import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe is initialized inside POST to check for existence of environment variables.

export async function POST(req: Request) {
    try {
        const secretKey = process.env.STRIPE_SECRET_KEY;

        if (!secretKey) {
            console.warn('STRIPE_KEY_MISSING: Secure Payment Node is unauthorized.');
            // For local development UI testing ONLY - return a mock if specifically allowed
            // return NextResponse.json({ clientSecret: "mock_secret_for_ui_only" });
            return NextResponse.json({
                error: "LAB_CONFIG_ERROR: Stripe API keys not detected in environment."
            }, { status: 401 });
        }

        const stripe = new Stripe(secretKey, {
            apiVersion: '2025-01-27' as any,
        });

        const { items } = await req.json();
        const amount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            metadata: { system: 'ELEMENT-01' }
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        console.error('STRP_ERR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
