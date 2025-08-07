import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { decryptCredentials } from '@/lib/crypto';

const prisma = new PrismaClient();

const SyncRequestSchema = z.object({
  dataSourceId: z.string(),
  campaignId: z.string()
});

// Placeholder CRM integrations removed; require real provider configuration

const validateDatabaseUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    // Only allow HTTPS for external databases
    if (!parsed.protocol.startsWith('https')) {
      return false;
    }
    
    // Basic whitelist of allowed domains (you'd expand this)
    const allowedDomains = [
      'api.airtable.com',
      'sheets.googleapis.com',
      'graph.microsoft.com'
    ];
    
    return allowedDomains.some(domain => parsed.hostname.includes(domain));
  } catch {
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        businessProfile: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = SyncRequestSchema.parse(body);

    // Verify campaign ownership
    const campaign = await prisma.outreachCampaign.findFirst({
      where: { id: validated.campaignId, userId: user.id }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get data source
    const dataSources = user.businessProfile?.websiteData?.dataSources || [];
    const dataSource = dataSources.find((ds: any) => ds.id === validated.dataSourceId);

    if (!dataSource) {
      return NextResponse.json({ error: 'Data source not found' }, { status: 404 });
    }

    if (!dataSource.isActive) {
      return NextResponse.json({ error: 'Data source is inactive' }, { status: 400 });
    }

    let recipients: any[] = [];

    try {
      if (dataSource.type === 'crm') {
        // Require real provider implementation
        return NextResponse.json({ 
          error: 'CRM sync not configured. Please connect a supported provider with an implementation.' 
        }, { status: 501 });
        
      } else if (dataSource.type === 'database') {
        const { url, query } = dataSource.config || {};
        
        if (!url || !query) {
          return NextResponse.json({ 
            error: 'Database URL and query are required' 
          }, { status: 400 });
        }

        if (!validateDatabaseUrl(url)) {
          return NextResponse.json({ 
            error: 'Invalid or unauthorized database URL' 
          }, { status: 400 });
        }

        // In production, implement actual database connections with proper security
        return NextResponse.json({ 
          error: 'Database sync not implemented yet' 
        }, { status: 501 });
        
      } else if (dataSource.type === 'api') {
        const { url, headers, method = 'GET' } = dataSource.config || {};
        
        if (!url) {
          return NextResponse.json({ 
            error: 'API URL is required' 
          }, { status: 400 });
        }

        if (!validateDatabaseUrl(url)) {
          return NextResponse.json({ 
            error: 'Invalid or unauthorized API URL' 
          }, { status: 400 });
        }

        // Fetch data from API
        const response = await fetch(url, {
          method,
          headers: {
            'User-Agent': 'LaunchKit-Outreach/1.0',
            ...headers
          }
        });

        if (!response.ok) {
          return NextResponse.json({ 
            error: 'Failed to fetch data from API' 
          }, { status: 502 });
        }

        const apiData = await response.json();
        
        // Transform API data to recipient format
        recipients = Array.isArray(apiData) ? apiData : apiData.data || [];
      }

      if (recipients.length === 0) {
        return NextResponse.json({ 
          success: true, 
          imported: 0, 
          message: 'No recipients found in data source' 
        });
      }

      // Normalize recipient data
      const normalizedRecipients = recipients.map((r: any) => ({
        email: r.email || r.Email || r.EMAIL,
        firstName: r.firstName || r.first_name || r.FirstName || r['First Name'] || null,
        lastName: r.lastName || r.last_name || r.LastName || r['Last Name'] || null,
        company: r.company || r.Company || r.COMPANY || null,
        title: r.title || r.Title || r.TITLE || r.position || r.Position || null,
        customFields: Object.fromEntries(
          Object.entries(r).filter(([key]) => 
            !['email', 'firstName', 'lastName', 'company', 'title', 'first_name', 'last_name', 'Email', 'FirstName', 'LastName', 'Company', 'Title'].includes(key)
          )
        )
      })).filter((r: any) => r.email);

      // Batch insert recipients
      await prisma.outreachRecipient.createMany({
        data: normalizedRecipients.map((r: any) => ({
          campaignId: validated.campaignId,
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
        where: { campaignId: validated.campaignId }
      });

      await prisma.outreachCampaign.update({
        where: { id: validated.campaignId },
        data: { totalRecipients }
      });

      return NextResponse.json({ 
        success: true, 
        imported: normalizedRecipients.length,
        total: totalRecipients 
      });

    } catch (syncError) {
      console.error('Sync error:', syncError);
      return NextResponse.json({ 
        error: 'Failed to sync data from source' 
      }, { status: 502 });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Data source sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync data source' },
      { status: 500 }
    );
  }
}