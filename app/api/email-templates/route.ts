import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const EmailTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  subject: z.string().min(1).max(300),
  content: z.string().min(1),
  category: z.string().default('general'),
  isPublic: z.boolean().default(false),
  variables: z.array(z.string()).default([])
});

// Store templates in business profile for now
// In production, you'd want a dedicated EmailTemplate model

const defaultTemplates = [
  {
    id: 'cold_outreach_1',
    name: 'Cold Outreach - Introduction',
    subject: 'Quick intro - {{companyName}} x {{firstName}}',
    content: `Hi {{firstName}},

I hope this email finds you well! I came across {{company}} and was impressed by your work in {{industry}}.

I'm {{fromName}} from {{companyName}}, and I thought there might be an opportunity for us to collaborate.

{{valueProposition}}

Would you be open to a brief 15-minute chat next week to explore this further?

Best regards,
{{fromName}}
{{companyName}}`,
    category: 'cold_outreach',
    isPublic: true,
    variables: ['firstName', 'company', 'industry', 'companyName', 'fromName', 'valueProposition']
  },
  {
    id: 'follow_up_1',
    name: 'Follow Up - Gentle Reminder',
    subject: 'Following up on my previous email - {{firstName}}',
    content: `Hi {{firstName}},

I wanted to follow up on my previous email about {{subject}}.

I understand you're probably busy, but I believe there's genuine value in connecting our companies.

{{additionalContext}}

Would you be available for a quick 10-minute call this week?

Best regards,
{{fromName}}`,
    category: 'follow_up',
    isPublic: true,
    variables: ['firstName', 'subject', 'additionalContext', 'fromName']
  },
  {
    id: 'product_launch_1',
    name: 'Product Launch Announcement',
    subject: 'Exciting news from {{companyName}} - {{productName}} is here!',
    content: `Hi {{firstName}},

I'm excited to share that we've just launched {{productName}}!

{{productDescription}}

As someone in {{industry}}, I thought you'd be particularly interested in:
• {{feature1}}
• {{feature2}}
• {{feature3}}

We're offering early access to a select group of professionals. Would you like to be one of the first to try {{productName}}?

{{callToAction}}

Best regards,
{{fromName}}
{{companyName}}`,
    category: 'product_launch',
    isPublic: true,
    variables: ['firstName', 'companyName', 'productName', 'productDescription', 'industry', 'feature1', 'feature2', 'feature3', 'callToAction', 'fromName']
  },
  {
    id: 'partnership_1',
    name: 'Partnership Proposal',
    subject: 'Partnership opportunity between {{companyName}} and {{company}}',
    content: `Hello {{firstName}},

I hope you're doing well!

I've been following {{company}}'s work in {{industry}} and I'm impressed by your {{specificAchievement}}.

I believe there's a strong synergy between our companies. {{companyName}} specializes in {{ourExpertise}}, and I see potential for a mutually beneficial partnership.

{{partnershipBenefits}}

I'd love to set up a brief call to discuss this opportunity in more detail. Are you available sometime next week?

Looking forward to hearing from you,
{{fromName}}
{{title}}
{{companyName}}`,
    category: 'partnership',
    isPublic: true,
    variables: ['firstName', 'company', 'industry', 'specificAchievement', 'companyName', 'ourExpertise', 'partnershipBenefits', 'fromName', 'title']
  }
];

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

    // Get user's custom templates
    const userTemplates = user.businessProfile?.websiteData?.emailTemplates || [];
    
    // Combine with default templates
    const allTemplates = [...defaultTemplates, ...userTemplates];

    return NextResponse.json({ templates: allTemplates });
  } catch (error) {
    console.error('Get email templates error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
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
    const validated = EmailTemplateSchema.parse(body);

    // Extract variables from content
    const variableRegex = /\{\{(\w+)\}\}/g;
    const extractedVariables = [...validated.content.matchAll(variableRegex)]
      .map(match => match[1]);
    const subjectVariables = [...validated.subject.matchAll(variableRegex)]
      .map(match => match[1]);
    
    const allVariables = [...new Set([...extractedVariables, ...subjectVariables])];

    const newTemplate = {
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: validated.name,
      subject: validated.subject,
      content: validated.content,
      category: validated.category,
      isPublic: validated.isPublic,
      variables: allVariables,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Get existing templates
    const existingWebsiteData = user.businessProfile?.websiteData || {};
    const existingTemplates = existingWebsiteData.emailTemplates || [];

    // Add new template
    const updatedTemplates = [...existingTemplates, newTemplate];

    // Update business profile
    if (user.businessProfile) {
      await prisma.businessProfile.update({
        where: { userId: user.id },
        data: {
          websiteData: {
            ...existingWebsiteData,
            emailTemplates: updatedTemplates
          }
        }
      });
    } else {
      await prisma.businessProfile.create({
        data: {
          userId: user.id,
          websiteData: {
            emailTemplates: updatedTemplates
          }
        }
      });
    }

    return NextResponse.json({ template: newTemplate });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Create email template error:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
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
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    // Check if it's a default template (read-only)
    if (defaultTemplates.some(template => template.id === id)) {
      return NextResponse.json({ error: 'Cannot modify default templates' }, { status: 403 });
    }

    // Get existing templates
    const existingWebsiteData = user.businessProfile?.websiteData || {};
    const existingTemplates = existingWebsiteData.emailTemplates || [];

    // Find and update the template
    const updatedTemplates = existingTemplates.map((template: any) => {
      if (template.id === id) {
        // Re-extract variables if content was updated
        if (updateData.content || updateData.subject) {
          const content = updateData.content || template.content;
          const subject = updateData.subject || template.subject;
          const variableRegex = /\{\{(\w+)\}\}/g;
          const extractedVariables = [...content.matchAll(variableRegex)]
            .map((match: any) => match[1]);
          const subjectVariables = [...subject.matchAll(variableRegex)]
            .map((match: any) => match[1]);
          
          updateData.variables = [...new Set([...extractedVariables, ...subjectVariables])];
        }

        return {
          ...template,
          ...updateData,
          updatedAt: new Date().toISOString()
        };
      }
      return template;
    });

    // Update business profile
    await prisma.businessProfile.update({
      where: { userId: user.id },
      data: {
        websiteData: {
          ...existingWebsiteData,
          emailTemplates: updatedTemplates
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update email template error:', error);
    return NextResponse.json(
      { error: 'Failed to update email template' },
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
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    // Check if it's a default template (read-only)
    if (defaultTemplates.some(template => template.id === id)) {
      return NextResponse.json({ error: 'Cannot delete default templates' }, { status: 403 });
    }

    // Get existing templates
    const existingWebsiteData = user.businessProfile?.websiteData || {};
    const existingTemplates = existingWebsiteData.emailTemplates || [];

    // Filter out the template to delete
    const updatedTemplates = existingTemplates.filter((template: any) => template.id !== id);

    // Update business profile
    await prisma.businessProfile.update({
      where: { userId: user.id },
      data: {
        websiteData: {
          ...existingWebsiteData,
          emailTemplates: updatedTemplates
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete email template error:', error);
    return NextResponse.json(
      { error: 'Failed to delete email template' },
      { status: 500 }
    );
  }
}