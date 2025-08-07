import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { encryptCredentials, decryptCredentials } from '@/lib/crypto';

const prisma = new PrismaClient();

const DataSourceSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['csv', 'crm', 'database', 'api']),
  provider: z.string().optional(), // e.g., 'salesforce', 'hubspot', 'pipedrive'
  credentials: z.record(z.string(), z.any()).optional(),
  config: z.record(z.string(), z.any()).optional(),
  isActive: z.boolean().default(true)
});

const CRMProviders = {
  salesforce: {
    name: 'Salesforce',
    authType: 'oauth2',
    fields: [
      { key: 'clientId', label: 'Client ID', type: 'text' },
      { key: 'clientSecret', label: 'Client Secret', type: 'password' },
      { key: 'instanceUrl', label: 'Instance URL', type: 'url' }
    ]
  },
  hubspot: {
    name: 'HubSpot',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password' }
    ]
  },
  pipedrive: {
    name: 'Pipedrive',
    authType: 'api_key',
    fields: [
      { key: 'apiToken', label: 'API Token', type: 'password' },
      { key: 'companyDomain', label: 'Company Domain', type: 'text' }
    ]
  },
  airtable: {
    name: 'Airtable',
    authType: 'api_key',
    fields: [
      { key: 'apiKey', label: 'API Key', type: 'password' },
      { key: 'baseId', label: 'Base ID', type: 'text' }
    ]
  }
};

// Since we can't extend the Prisma schema in this context, 
// we'll store data sources as a JSON configuration in the user's profile
// In a real implementation, you'd want a dedicated DataSource model

export async function GET(request: NextRequest) {
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

    // Get data sources from business profile or return empty array
    const dataSources = user.businessProfile?.websiteData?.dataSources || [];

    return NextResponse.json({ 
      dataSources,
      providers: CRMProviders 
    });
  } catch (error) {
    console.error('Get data sources error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data sources' },
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
      where: { email: session.user.email },
      include: {
        businessProfile: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const validated = DataSourceSchema.parse(body);

    // Encrypt credentials if provided
    let encryptedCredentials = null;
    if (validated.credentials) {
      encryptedCredentials = await encryptCredentials(validated.credentials);
    }

    const newDataSource = {
      id: `ds_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: validated.name,
      type: validated.type,
      provider: validated.provider,
      credentials: encryptedCredentials,
      config: validated.config,
      isActive: validated.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Get existing data sources
    const existingWebsiteData = user.businessProfile?.websiteData || {};
    const existingDataSources = existingWebsiteData.dataSources || [];

    // Add new data source
    const updatedDataSources = [...existingDataSources, newDataSource];

    // Update business profile
    if (user.businessProfile) {
      await prisma.businessProfile.update({
        where: { userId: user.id },
        data: {
          websiteData: {
            ...existingWebsiteData,
            dataSources: updatedDataSources
          }
        }
      });
    } else {
      await prisma.businessProfile.create({
        data: {
          userId: user.id,
          websiteData: {
            dataSources: updatedDataSources
          }
        }
      });
    }

    // Return the data source without credentials for security
    const { credentials, ...safeDataSource } = newDataSource;
    return NextResponse.json({ dataSource: safeDataSource });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: (error as any).errors },
        { status: 400 }
      );
    }

    console.error('Create data source error:', error);
    return NextResponse.json(
      { error: 'Failed to create data source' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Data source ID required' }, { status: 400 });
    }

    // Get existing data sources
    const existingWebsiteData = user.businessProfile?.websiteData || {};
    const existingDataSources = existingWebsiteData.dataSources || [];

    // Find and update the data source
    const updatedDataSources = existingDataSources.map((ds: any) => {
      if (ds.id === id) {
        return {
          ...ds,
          ...updateData,
          updatedAt: new Date().toISOString()
        };
      }
      return ds;
    });

    // Update business profile
    await prisma.businessProfile.update({
      where: { userId: user.id },
      data: {
        websiteData: {
          ...existingWebsiteData,
          dataSources: updatedDataSources
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update data source error:', error);
    return NextResponse.json(
      { error: 'Failed to update data source' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Data source ID required' }, { status: 400 });
    }

    // Get existing data sources
    const existingWebsiteData = user.businessProfile?.websiteData || {};
    const existingDataSources = existingWebsiteData.dataSources || [];

    // Filter out the data source to delete
    const updatedDataSources = existingDataSources.filter((ds: any) => ds.id !== id);

    // Update business profile
    await prisma.businessProfile.update({
      where: { userId: user.id },
      data: {
        websiteData: {
          ...existingWebsiteData,
          dataSources: updatedDataSources
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete data source error:', error);
    return NextResponse.json(
      { error: 'Failed to delete data source' },
      { status: 500 }
    );
  }
}