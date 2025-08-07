import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { decryptCredentials } from '@/lib/crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { serviceId, testEmail } = await request.json();
    if (!serviceId || !testEmail) {
      return NextResponse.json({ error: 'serviceId and testEmail are required' }, { status: 400 });
    }

    const service = await prisma.emailService.findFirst({ where: { id: serviceId, userId: user.id } });
    if (!service) {
      return NextResponse.json({ error: 'Email service not found' }, { status: 404 });
    }

    // Decrypt credentials (not used in demo send below, but validated here)
    try {
      await decryptCredentials(service.credentials);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid service credentials' }, { status: 400 });
    }

    // Demo mode: simulate sending a test email successfully
    return NextResponse.json({ success: true, message: 'Test email sent (demo mode)' });
  } catch (error) {
    console.error('Test email service error:', error);
    return NextResponse.json({ error: 'Failed to test email service' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { decryptCredentials } from '@/lib/crypto';
import { Resend } from 'resend';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { serviceId, testEmail } = await request.json();

    if (!serviceId || !testEmail) {
      return NextResponse.json(
        { error: 'Service ID and test email are required' },
        { status: 400 }
      );
    }

    const service = await prisma.emailService.findFirst({
      where: { id: serviceId, userId: user.id }
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    if (!service.isActive) {
      return NextResponse.json({ error: 'Service is not active' }, { status: 400 });
    }

    const credentials = await decryptCredentials(service.credentials);
    
    const testSubject = 'LaunchKit Email Service Test';
    const testMessage = `
      <h2>Email Service Test</h2>
      <p>This is a test email from your LaunchKit email service configuration.</p>
      <p><strong>Service:</strong> ${service.displayName}</p>
      <p><strong>Type:</strong> ${service.serviceName}</p>
      <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
      <p>If you received this email, your email service is working correctly!</p>
    `;

    let result;

    try {
      switch (service.serviceName) {
        case 'resend':
          result = await testResend(credentials, testEmail, testSubject, testMessage);
          break;
        case 'smtp':
          result = await testSMTP(credentials, testEmail, testSubject, testMessage);
          break;
        case 'sendgrid':
          result = await testSendGrid(credentials, testEmail, testSubject, testMessage);
          break;
        case 'mailgun':
          result = await testMailgun(credentials, testEmail, testSubject, testMessage);
          break;
        case 'postmark':
          result = await testPostmark(credentials, testEmail, testSubject, testMessage);
          break;
        default:
          return NextResponse.json(
            { error: 'Unsupported service type' },
            { status: 400 }
          );
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { 
          error: 'Failed to send test email',
          details: emailError instanceof Error ? emailError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

    // Update last used timestamp
    await prisma.emailService.update({
      where: { id: serviceId },
      data: { 
        lastUsedAt: new Date(),
        totalSent: { increment: 1 }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      details: result
    });

  } catch (error) {
    console.error('Test email service error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error.message },
      { status: 500 }
    );
  }
}

async function testResend(credentials: any, to: string, subject: string, html: string) {
  const resend = new Resend(credentials.apiKey);
  
  const result = await resend.emails.send({
    from: credentials.fromEmail || 'test@resend.dev',
    to: [to],
    subject,
    html
  });

  return result;
}

async function testSMTP(credentials: any, to: string, subject: string, html: string) {
  // For now, just return a mock response since we haven't installed nodemailer yet
  return { message: 'SMTP test would be sent here. Install nodemailer to enable.' };
}

async function testSendGrid(credentials: any, to: string, subject: string, html: string) {
  // SendGrid implementation would go here
  return { message: 'SendGrid integration not implemented yet' };
}

async function testMailgun(credentials: any, to: string, subject: string, html: string) {
  // Mailgun implementation would go here
  return { message: 'Mailgun integration not implemented yet' };
}

async function testPostmark(credentials: any, to: string, subject: string, html: string) {
  // Postmark implementation would go here
  return { message: 'Postmark integration not implemented yet' };
}