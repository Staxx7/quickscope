// app/pricing/page.tsx - With Stripe Integration
'use client'

import { useState } from 'react'

const plans = [
  {
    name: 'Starter',
    price: 29,
    priceId: 'price_1RZ2tZAmMeRluIoWJP3fEKo0',
    description: 'Perfect for small businesses',
    features: [
      'Connect 1 QuickBooks company',
      'Basic financial analysis',
      'Monthly reports',
      'Email support'
    ]
  },
  {
    name: 'Professional',
    price: 49,
    priceId: 'price_1RZ2vbAmMeRluIoWPUjUCXh1',
    description: 'For growing businesses',
    features: [
      'Connect 3 QuickBooks companies',
      'Advanced AI analysis',
      'Weekly reports & alerts',
      'Cash flow forecasting',
      'Priority support'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 99,
    priceId: 'price_1RZ2xcAmMeRluIoWesiuavc0',
    description: 'For established businesses',
    features: [
      'Unlimited QuickBooks companies',
      'Custom AI insights',
      'Daily monitoring',
      'White-label reports',
      'Dedicated account manager'
    ]
  }
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, planName: string) => {
    setLoading(priceId)
    
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerEmail: '', // Will be collected in Stripe Checkout
          customerName: ''
        })
      })

      const { sessionId } = await response.json()
      
      // Redirect to Stripe Checkout
      const stripe = await import('@stripe/stripe-js').then(module => 
        module.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      )
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900">
      {/* Header */}
      <nav className="p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <h1 className="text-2xl font-bold text-white">QUICKSCOPE</h1>
          </div>
          <a href="/connect" className="bg-white text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Free Trial
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-5xl font-bold text-white mb-6">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
          Transform your QuickBooks data into actionable insights with AI-powered financial analysis. 
          Start your free trial today – no credit card required.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border ${
                plan.popular 
                  ? 'border-2 border-blue-400 transform scale-105 bg-opacity-15' 
                  : 'border-white border-opacity-20'
              } relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  ${plan.price}<span className="text-lg font-normal">/month</span>
                </div>
                <p className="text-slate-300">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-white">
                    <span className="text-green-400 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan.priceId, plan.name)}
                disabled={loading === plan.priceId}
                className={`w-full font-semibold py-4 rounded-lg transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white border-opacity-30'
                } ${loading === plan.priceId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading === plan.priceId ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  'Start Free Trial'
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h3>
          
          <div className="space-y-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">How does the free trial work?</h4>
              <p className="text-slate-300">Connect your QuickBooks and explore all features for 14 days. No credit card required. Cancel anytime.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Is my QuickBooks data secure?</h4>
              <p className="text-slate-300">Absolutely. We use bank-level encryption and only access the financial data needed for analysis. Your data never leaves secure servers.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-2">Can I change plans anytime?</h4>
              <p className="text-slate-300">Yes! Upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
              <h4 className="text-lg font-semibient text-white mb-2">What QuickBooks versions do you support?</h4>
              <p className="text-slate-300">We support QuickBooks Online (all versions). QuickBooks Desktop integration coming soon.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h3 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Financial Analysis?</h3>
          <p className="text-xl text-slate-300 mb-8">Join hundreds of businesses using QuickScope to make smarter financial decisions.</p>
          <a href="/connect" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
            Start Your Free Trial
          </a>
          <p className="text-sm text-slate-400 mt-4">14-day free trial • No credit card required • Cancel anytime</p>
        </div>
      </div>
    </div>
  )
}
