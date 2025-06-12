// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(request: NextRequest) {
  try {
    const { priceId, customerEmail, customerName } = await request.json()
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        customer_name: customerName,
      },
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Environment variables needed:
// STRIPE_SECRET_KEY=sk_test_...
// STRIPE_PUBLISHABLE_KEY=pk_test_...
// NEXT_PUBLIC_SITE_URL=https://www.quickscope.info

// Stripe Price IDs (create these in Stripe Dashboard):
// - Starter: price_1234567890 ($29/month)
// - Professional: price_0987654321 ($49/month)  
// - Enterprise: price_1122334455 ($99/month)
