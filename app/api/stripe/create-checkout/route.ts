// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Import Stripe constructor (not default export)
import { Stripe } from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { priceId, customerEmail, customerName } = await request.json()
    
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key not configured' },
        { status: 500 }
      )
    }

    // Initialize Stripe with proper constructor
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-05-28.basil'
    })
    
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
        customer_name: customerName || '',
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
