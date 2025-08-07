import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const OutreachCampaignSchema = z.object({
  name: z.string().min(1).max(200),
  subject: z.string().min(1).max(300),
  content: z.string().min(1),
  fromName: z.string().min(1).max(100),
  fromEmail: z.string().email(),
  replyTo: z.string().email().optional(),
  emailServiceId: z.string()
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

    const campaigns = await prisma.outreachCampaign.findMany({
      where: { userId: user.id },
      include: {
        emailService: {
          select: {
            displayName: true,
            serviceName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Get outreach campaigns error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch outreach campaigns' },
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
    const validated = OutreachCampaignSchema.parse(body);

    // Verify that the email service belongs to the user
    const emailService = await prisma.emailService.findFirst({
      where: {
        id: validated.emailServiceId,
        userId: user.id,
        isActive: true
      }
    });

    if (!emailService) {
      return NextResponse.json(
        { error: 'Email service not found or inactive' },
        { status: 404 }
      );
    }

    const campaign = await prisma.outreachCampaign.create({
      data: {
        userId: user.id,
        emailServiceId: validated.emailServiceId,
        name: validated.name,
        subject: validated.subject,
        content: validated.content,
        fromName: validated.fromName,
        fromEmail: validated.fromEmail,
        replyTo: validated.replyTo || null
      },
      include: {
        emailService: {
          select: {
            displayName: true,
            serviceName: true
          }
        }
      }
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create outreach campaign error:', error);
    return NextResponse.json(
      { error: 'Failed to create outreach campaign' },
      { status: 500 }
    );
  }
}