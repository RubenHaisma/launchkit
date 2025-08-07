import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content, from = 'LaunchPilot <noreply@launchpilot.ai>' } = await request.json()

    if (!to || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll simulate sending
    // In production, uncomment the resend.emails.send call
    
    /*
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: content,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 400 })
    }
    */

    // Simulate successful send
    const data = { id: `demo_${Date.now()}` }

    return NextResponse.json({
      success: true,
      data,
      message: 'Email sent successfully (demo mode)'
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}