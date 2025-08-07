import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessData = await request.json();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create or update business profile
    const businessProfile = await prisma.businessProfile.upsert({
      where: { userId: user.id },
      update: {
        businessName: businessData.businessName,
        website: businessData.website,
        industry: businessData.industry,
        description: businessData.description,
        targetAudience: businessData.targetAudience,
        businessModel: businessData.businessModel,
        monthlyRevenue: businessData.monthlyRevenue,
        teamSize: businessData.teamSize,
        founded: businessData.founded,
        location: businessData.location,
        uniqueValueProp: businessData.uniqueValueProp,
        mainChallenges: businessData.mainChallenges || [],
        goals: businessData.goals || [],
        competitors: businessData.competitors || [],
        isSetupComplete: true,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        businessName: businessData.businessName,
        website: businessData.website,
        industry: businessData.industry,
        description: businessData.description,
        targetAudience: businessData.targetAudience,
        businessModel: businessData.businessModel,
        monthlyRevenue: businessData.monthlyRevenue,
        teamSize: businessData.teamSize,
        founded: businessData.founded,
        location: businessData.location,
        uniqueValueProp: businessData.uniqueValueProp,
        mainChallenges: businessData.mainChallenges || [],
        goals: businessData.goals || [],
        competitors: businessData.competitors || [],
        isSetupComplete: true,
      },
    });

    return NextResponse.json({
      success: true,
      businessProfile,
    });

  } catch (error) {
    console.error('Error saving business profile:', error);
    return NextResponse.json(
      { error: 'Failed to save business profile' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the user and their business profile
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businessProfile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      businessProfile: user.businessProfile,
    });

  } catch (error) {
    console.error('Error fetching business profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business profile' },
      { status: 500 }
    );
  }
}
