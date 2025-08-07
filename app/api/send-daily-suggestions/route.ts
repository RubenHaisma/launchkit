import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateContent } from '@/lib/ai'

// This would typically be called by a cron job or scheduled task
export async function POST(request: NextRequest) {
  try {
    // In production, you'd want to secure this endpoint with an API key
    const { userId, testMode } = await request.json();
    
    if (!testMode && !userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get user preferences and active platforms
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        // Add user preferences if you have them
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate daily content suggestions
    const suggestions = await generateDailySuggestions(userId);
    
    // In production, integrate with your email service (SendGrid, Resend, etc.)
    const emailContent = await createDailyEmailContent(user, suggestions);
    
    if (testMode) {
      return NextResponse.json({
        success: true,
        preview: emailContent,
        message: 'Test email generated successfully'
      });
    }

    // Send actual email (implement with your email service)
    const emailSent = await sendDailyEmail(user.email, emailContent);
    
    if (emailSent) {
      // Log the email send using the Email model
      await prisma.email.create({
        data: {
          campaignId: 'daily-suggestions', // Use a default campaign ID
          subject: emailContent.subject,
          body: emailContent.text,
          status: 'sent',
          sentAt: new Date()
        }
      }).catch(() => {}); // Handle if table doesn't exist
    }

    return NextResponse.json({
      success: true,
      message: 'Daily suggestions email sent successfully'
    });
  } catch (error) {
    console.error('Send daily suggestions error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send daily suggestions' },
      { status: 500 }
    );
  }
}

async function generateDailySuggestions(userId: string) {
  // Generate content suggestions for different platforms
  const [twitterSuggestions, linkedinSuggestions, instagramSuggestions] = await Promise.all([
    generateContent({
      prompt: 'Generate 3 engaging Twitter post ideas for a SaaS founder',
      contentType: 'tweet',
      tone: 'conversational',
      audience: 'general',
      platform: 'twitter'
    }),
    generateContent({
      prompt: 'Generate 2 professional LinkedIn post ideas about entrepreneurship',
      contentType: 'linkedin-post',
      tone: 'professional',
      audience: 'general',
      platform: 'linkedin'
    }),
    generateContent({
      prompt: 'Generate an Instagram caption idea for behind-the-scenes content',
      contentType: 'instagram-caption',
      tone: 'casual',
      audience: 'general',
      platform: 'instagram'
    })
  ]);

  return {
    twitter: Array.isArray(twitterSuggestions.content) ? twitterSuggestions.content : [twitterSuggestions.content],
    linkedin: Array.isArray(linkedinSuggestions.content) ? linkedinSuggestions.content : [linkedinSuggestions.content],
    instagram: Array.isArray(instagramSuggestions.content) ? instagramSuggestions.content : [instagramSuggestions.content],
    dailyTip: "Post consistently at optimal times - your audience is most active on weekdays between 10-11 AM!"
  };
}

async function createDailyEmailContent(user: any, suggestions: any) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return {
    subject: `🚀 Your Daily Content Boost - ${today}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your Daily Content Suggestions</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; border-radius: 10px; margin-bottom: 30px;">
    <h1 style="margin: 0; font-size: 28px;">🚀 LaunchPilot</h1>
    <p style="margin: 10px 0 0 0; font-size: 18px;">Your Daily Content Boost</p>
  </div>
  
  <div style="margin-bottom: 30px;">
    <p style="font-size: 16px;">Hi ${user.name || 'there'},</p>
    <p>Ready to dominate your content game today? Here are your AI-powered suggestions for ${today}:</p>
  </div>

  <!-- Twitter Section -->
  <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #1da1f2;">
    <h3 style="color: #1da1f2; margin-top: 0; display: flex; align-items: center;">
      <span style="margin-right: 10px;">🐦</span> Twitter Post Ideas
    </h3>
    ${suggestions.twitter.map((tweet: string, index: number) => `
      <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 14px;">${tweet}</p>
      </div>
    `).join('')}
  </div>

  <!-- LinkedIn Section -->
  <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #0077b5;">
    <h3 style="color: #0077b5; margin-top: 0; display: flex; align-items: center;">
      <span style="margin-right: 10px;">💼</span> LinkedIn Content
    </h3>
    ${suggestions.linkedin.map((post: string, index: number) => `
      <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 14px;">${post}</p>
      </div>
    `).join('')}
  </div>

  <!-- Instagram Section -->
  <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #e4405f;">
    <h3 style="color: #e4405f; margin-top: 0; display: flex; align-items: center;">
      <span style="margin-right: 10px;">📸</span> Instagram Caption
    </h3>
    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <p style="margin: 0; font-size: 14px;">${suggestions.instagram[0]}</p>
    </div>
  </div>

  <!-- Daily Tip -->
  <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
    <h3 style="color: #8b4513; margin-top: 0;">🎯 Today's Engagement Tip</h3>
    <p style="margin: 0; color: #8b4513; font-weight: 500;">${suggestions.dailyTip}</p>
  </div>

  <!-- CTA -->
  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      🚀 Generate More Content
    </a>
  </div>

  <!-- Footer -->
  <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; color: #64748b; font-size: 12px;">
    <p>Keep crushing it with LaunchPilot!</p>
    <p>Don't want daily suggestions? <a href="#" style="color: #667eea;">Update preferences</a></p>
  </div>
</body>
</html>
    `,
    text: `
Hi ${user.name || 'there'},

Ready to dominate your content game today? Here are your AI-powered suggestions:

🐦 TWITTER POST IDEAS:
${suggestions.twitter.map((tweet: string, index: number) => `${index + 1}. ${tweet}`).join('\n')}

💼 LINKEDIN CONTENT:
${suggestions.linkedin.map((post: string, index: number) => `${index + 1}. ${post}`).join('\n')}

📸 INSTAGRAM CAPTION:
${suggestions.instagram[0]}

🎯 TODAY'S ENGAGEMENT TIP:
${suggestions.dailyTip}

Click to generate more content: ${process.env.NEXTAUTH_URL}/dashboard

Keep crushing it!
The LaunchPilot Team
    `
  };
}

async function sendDailyEmail(email: string, content: any): Promise<boolean> {
  // Implement with your email service (SendGrid, Resend, etc.)
  // For now, just return true to simulate success
  console.log(`Would send email to ${email} with subject: ${content.subject}`);
  
  // Example with Resend:
  /*
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'LaunchPilot <noreply@launchpilot.ai>',
      to: email,
      subject: content.subject,
      html: content.html,
      text: content.text,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
  */
  
  return true; // Simulate success for now
}