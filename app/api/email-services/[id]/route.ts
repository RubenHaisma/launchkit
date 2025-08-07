import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { decryptCredentials } from '@/lib/crypto';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const service = await prisma.emailService.findFirst({
      where: { id: params.id, userId: user.id }
    });

    if (!service) {
      return NextResponse.json({ error: 'Email service not found' }, { status: 404 });
    }

    let credentials: any = null;
    try {
      credentials = await decryptCredentials(service.credentials);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to decrypt credentials' }, { status: 500 });
    }

    return NextResponse.json({
      id: service.id,
      serviceName: service.serviceName,
      displayName: service.displayName,
      isActive: service.isActive,
      isDefault: service.isDefault,
      config: service.config,
      credentials
    });
  } catch (error) {
    console.error('Get email service error:', error);
    return NextResponse.json({ error: 'Failed to fetch email service' }, { status: 500 });
  }
}


