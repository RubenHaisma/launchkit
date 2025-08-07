import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { decryptCredentials } from '@/lib/crypto';
import { Resend } from 'resend';

const prisma = new PrismaClient();

export async function POST(
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

    const campaign = await prisma.outreachCampaign.findFirst({
      where: { id: params.id, userId: user.id },
      include: { emailService: true }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Fetch recipients to send to
    const recipients = await prisma.outreachRecipient.findMany({
      where: { campaignId: campaign.id },
      orderBy: { createdAt: 'asc' }
    });

    if (recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients to send to' }, { status: 400 });
    }

    // Decrypt credentials
    const credentials = await decryptCredentials(campaign.emailService.credentials);

    let sentCount = 0;
    if (campaign.emailService.serviceName === 'resend') {
      const apiKey = credentials.apiKey;
      if (!apiKey) {
        return NextResponse.json({ error: 'Missing Resend API key' }, { status: 400 });
      }
      const resend = new Resend(apiKey);

      const subject = campaign.subject;
      const from = `${campaign.fromName} <${campaign.fromEmail}>`;

      // Very simple template replacement for {{variable}}
      const renderContent = (template: string, recipient: any) => {
        return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => {
          const value = (recipient as any)[key] ?? (recipient.customFields as any)?.[key] ?? (key === 'fromName' ? campaign.fromName : '');
          return value ?? '';
        });
      };

      for (const recipient of recipients) {
        const html = renderContent(campaign.content, recipient);
        try {
          const res = await resend.emails.send({
            from,
            to: [recipient.email],
            subject,
            html
          });
          if (res?.id) {
            sentCount += 1;
            await prisma.outreachRecipient.update({
              where: { id: recipient.id },
              data: { status: 'sent', sentAt: new Date() }
            });
          }
        } catch {
          // mark as bounced on error
          await prisma.outreachRecipient.update({
            where: { id: recipient.id },
            data: { status: 'bounced', bouncedAt: new Date() }
          });
        }
      }
    } else {
      return NextResponse.json({ error: 'Provider not implemented' }, { status: 501 });
    }

    await prisma.outreachCampaign.update({
      where: { id: campaign.id },
      data: {
        status: 'sent',
        sentAt: new Date(),
        sentCount
      }
    });

    return NextResponse.json({ success: true, sent: sentCount });
  } catch (error) {
    console.error('Send campaign error:', error);
    return NextResponse.json({ error: 'Failed to send campaign' }, { status: 500 });
  }
}


