import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, from, type = 'campaign' } = body;

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // Use environment variable for from email or fallback
    const fromEmail = from || process.env.RESEND_FROM_EMAIL || 'noreply@launchpilot.ai';

    // Send email via Resend
    const data = await resend.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    // Log the send (in production, you'd save to database)
    console.log('Email sent successfully:', {
      id: data.id,
      to,
      subject,
      type,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        to,
        subject,
        type,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Handle specific Resend errors
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}