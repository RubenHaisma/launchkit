import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { encryptCredentials, decryptCredentials } from '@/lib/crypto';
import { z } from 'zod';

const prisma = new PrismaClient();

const EmailServiceSchema = z.object({
  serviceName: z.enum(['resend', 'smtp', 'sendgrid', 'mailgun', 'postmark']),
  displayName: z.string().min(1).max(100),
  credentials: z.object({}).passthrough(),
  config: z.object({}).optional(),
  isDefault: z.boolean().default(false)
});

export async function GET(request: NextRequest) {
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

    const services = await prisma.emailService.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        serviceName: true,
        displayName: true,
        isActive: true,
        isDefault: true,
        config: true,
        lastUsedAt: true,
        totalSent: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Get email services error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email services' },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const validated = EmailServiceSchema.parse(body);

    // Check if service already exists for this user
    const existingService = await prisma.emailService.findUnique({
      where: {
        userId_serviceName: {
          userId: user.id,
          serviceName: validated.serviceName
        }
      }
    });

    if (existingService) {
      return NextResponse.json(
        { error: 'Service already configured. Use PUT to update.' },
        { status: 409 }
      );
    }

    // If this is set as default, unset other defaults
    if (validated.isDefault) {
      await prisma.emailService.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      });
    }

    // Encrypt credentials
    const encryptedCredentials = await encryptCredentials(validated.credentials);

    const service = await prisma.emailService.create({
      data: {
        userId: user.id,
        serviceName: validated.serviceName,
        displayName: validated.displayName,
        credentials: encryptedCredentials,
        config: validated.config || {},
        isDefault: validated.isDefault
      },
      select: {
        id: true,
        serviceName: true,
        displayName: true,
        isActive: true,
        isDefault: true,
        config: true,
        createdAt: true
      }
    });

    return NextResponse.json({ service });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create email service error:', error);
    return NextResponse.json(
      { error: 'Failed to create email service' },
      { status: 500 }
    );
  }
}