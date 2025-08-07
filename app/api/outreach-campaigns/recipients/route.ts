import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import Papa from 'papaparse';

const prisma = new PrismaClient();

const ImportRecipientsSchema = z.object({
  campaignId: z.string(),
  recipients: z.array(z.object({
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    customFields: z.record(z.any()).optional()
  }))
});

const DatabaseConnectionSchema = z.object({
  url: z.string().url(),
  query: z.string(),
  type: z.enum(['postgresql', 'mysql', 'sqlite'])
});

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

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle CSV file upload
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const campaignId = formData.get('campaignId') as string;

      if (!file || !campaignId) {
        return NextResponse.json({ error: 'Missing file or campaign ID' }, { status: 400 });
      }

      // Verify campaign ownership
      const campaign = await prisma.outreachCampaign.findFirst({
        where: { id: campaignId, userId: user.id }
      });

      if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      }

      const text = await file.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });

      if (parsed.errors.length > 0) {
        return NextResponse.json({ 
          error: 'CSV parsing failed', 
          details: parsed.errors 
        }, { status: 400 });
      }

      const recipients = parsed.data.map((row: any) => ({
        email: row.email || row.Email || row.EMAIL,
        firstName: row.firstName || row.first_name || row.FirstName || row['First Name'] || null,
        lastName: row.lastName || row.last_name || row.LastName || row['Last Name'] || null,
        company: row.company || row.Company || row.COMPANY || null,
        title: row.title || row.Title || row.TITLE || row.position || row.Position || null,
        customFields: Object.fromEntries(
          Object.entries(row).filter(([key]) => 
            !['email', 'firstName', 'lastName', 'company', 'title', 'first_name', 'last_name', 'Email', 'FirstName', 'LastName', 'Company', 'Title'].includes(key)
          )
        )
      })).filter((r: any) => r.email);

      // Batch insert recipients
      await prisma.outreachRecipient.createMany({
        data: recipients.map((r: any) => ({
          campaignId,
          email: r.email,
          firstName: r.firstName,
          lastName: r.lastName,
          company: r.company,
          title: r.title,
          customFields: r.customFields
        })),
        skipDuplicates: true
      });

      // Update campaign recipient count
      const totalRecipients = await prisma.outreachRecipient.count({
        where: { campaignId }
      });

      await prisma.outreachCampaign.update({
        where: { id: campaignId },
        data: { totalRecipients }
      });

      return NextResponse.json({ 
        success: true, 
        imported: recipients.length,
        total: totalRecipients 
      });

    } else {
      // Handle JSON data import
      const body = await request.json();
      
      if (body.type === 'database') {
        // Handle database connection
        const validated = DatabaseConnectionSchema.parse(body);
        
        // Note: In production, you'd want to implement proper database connection validation
        // and security measures. This is a basic implementation.
        return NextResponse.json({ 
          error: 'Database connections require additional security setup' 
        }, { status: 501 });
        
      } else {
        // Handle direct JSON import
        const validated = ImportRecipientsSchema.parse(body);
        
        // Verify campaign ownership
        const campaign = await prisma.outreachCampaign.findFirst({
          where: { id: validated.campaignId, userId: user.id }
        });

        if (!campaign) {
          return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
        }

        // Batch insert recipients
        await prisma.outreachRecipient.createMany({
          data: validated.recipients.map(r => ({
            campaignId: validated.campaignId,
            email: r.email,
            firstName: r.firstName || null,
            lastName: r.lastName || null,
            company: r.company || null,
            title: r.title || null,
            customFields: r.customFields || null
          })),
          skipDuplicates: true
        });

        // Update campaign recipient count
        const totalRecipients = await prisma.outreachRecipient.count({
          where: { campaignId: validated.campaignId }
        });

        await prisma.outreachCampaign.update({
          where: { id: validated.campaignId },
          data: { totalRecipients }
        });

        return NextResponse.json({ 
          success: true, 
          imported: validated.recipients.length,
          total: totalRecipients 
        });
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Import recipients error:', error);
    return NextResponse.json(
      { error: 'Failed to import recipients' },
      { status: 500 }
    );
  }
}

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

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID required' }, { status: 400 });
    }

    // Verify campaign ownership
    const campaign = await prisma.outreachCampaign.findFirst({
      where: { id: campaignId, userId: user.id }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const recipients = await prisma.outreachRecipient.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ recipients });
  } catch (error) {
    console.error('Get recipients error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipients' },
      { status: 500 }
    );
  }
}