import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, prospect } = await request.json()

    // Email content
    const emailContent = `
      New QuickBooks Connection Alert! 🎉
      
      A new prospect has connected their QuickBooks account:
      
      👤 Name: ${prospect.name}
      🏢 Company: ${prospect.company}
      📧 Email: ${prospect.email}
      📱 Phone: ${prospect.phone || 'Not provided'}
      ⏰ Connected: ${new Date().toLocaleString()}
      
      Next Steps:
      1. Review their QuickBooks data
      2. Generate financial analysis
      3. Schedule consultation call
      
      Dashboard: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/dashboard/main
    `

    // Using a simple email service (replace with your preferred provider)
    // Example with Resend (recommended for Next.js)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'quickscope@staxx.com',
        to: [to],
        subject: subject,
        text: emailContent,
      }),
    })

    if (response.ok) {
      return NextResponse.json({ success: true })
    } else {
      throw new Error('Failed to send email')
    }
  } catch (error) {
    console.error('Email notification error:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
