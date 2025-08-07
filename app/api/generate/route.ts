import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  prompt: string;
  type: 'tweet' | 'email' | 'blog' | 'launch';
  tone: string;
  audience: string;
}

const contentTemplates = {
  tweet: {
    professional: [
      "🚀 Just discovered something that's changing how {audience} work:\n\n{prompt}\n\nHere's why this matters:\n\n• Saves 20+ hours/week\n• Increases productivity by 3x\n• Works with existing tools\n\nWhat's your biggest time-waster? 👇",
      "Unpopular opinion for {audience}:\n\n{prompt}\n\nMost people get this wrong because they focus on features instead of outcomes.\n\nThe real game-changer? Understanding your users' actual pain points.\n\nWhat do you think? 🤔",
    ],
    casual: [
      "yo {audience} 👋\n\njust tried {prompt} and it's actually insane\n\nwent from spending 20 hours on marketing to like 2 hours\n\nthe AI literally handles everything:\n→ content creation\n→ social posts\n→ email campaigns\n\nanyone else using AI for their startup?",
      "real talk {audience}...\n\n{prompt} just saved me from another all-nighter\n\nused to spend forever writing copy\nnow it takes 5 minutes\n\nfeels like cheating but in a good way 😅\n\nwhat tools are you using to stay sane?",
    ],
  },
  email: {
    professional: [
      "Subject: Quick question about {{company}}\n\nHi {{firstName}},\n\nI noticed you're working in the {audience} space and thought you might find this interesting.\n\n{prompt}\n\nMost {audience} I talk to struggle with this exact challenge. We've helped similar companies:\n\n• Reduce manual work by 70%\n• Increase conversion rates by 2.5x\n• Save 15+ hours per week\n\nWould you be interested in a quick 15-minute demo to see how this could help {{company}}?\n\nBest regards,\n[Your name]",
      "Subject: How {{company}} can save 20 hours/week\n\nHi {{firstName}},\n\nSaw your recent work at {{company}} - impressive growth in the {audience} market!\n\n{prompt}\n\nI'm reaching out because we've helped similar companies automate their most time-consuming processes.\n\nResults our clients typically see:\n→ 3x faster content creation\n→ 50% higher engagement rates\n→ 80% reduction in manual tasks\n\nInterested in learning how this could work for {{company}}?\n\nCheers,\n[Your name]",
    ],
    casual: [
      "Subject: loved your recent post about {audience}\n\nHey {{firstName}}!\n\nJust saw your post about challenges in the {audience} space - totally resonated with me.\n\n{prompt}\n\nI've been working on something that might help with exactly what you mentioned. It's helped me go from 20 hours/week on marketing to just 2 hours.\n\nWant to check it out? No pressure, just thought it might be useful for {{company}}.\n\nTalk soon!\n[Your name]",
    ],
  },
  blog: {
    professional: [
      "# How {prompt} is Revolutionizing the {audience} Industry\n\n## The Challenge\n\nIn today's competitive landscape, {audience} face unprecedented challenges. The traditional approaches that worked five years ago are no longer sufficient.\n\n## The Solution\n\n{prompt} represents a fundamental shift in how we approach this problem.\n\n### Key Benefits:\n- Increased efficiency by 300%\n- Reduced operational costs\n- Improved user satisfaction\n- Scalable growth potential\n\n## Implementation Strategy\n\n1. **Assessment Phase**: Evaluate current processes\n2. **Planning Phase**: Develop implementation roadmap\n3. **Execution Phase**: Deploy solution systematically\n4. **Optimization Phase**: Continuous improvement\n\n## Results\n\nEarly adopters have seen remarkable results:\n- 70% reduction in manual work\n- 2.5x increase in productivity\n- 90% user satisfaction rate\n\n## Conclusion\n\nThe future belongs to {audience} who embrace innovation. {prompt} isn't just a tool—it's a competitive advantage.\n\nReady to transform your workflow? Get started today.",
    ],
    casual: [
      "# Why Every {audience} Needs to Know About {prompt}\n\nHey there! 👋\n\nSo I've been diving deep into {prompt} lately, and honestly? It's kind of a game-changer for {audience}.\n\n## Here's the deal\n\nMost of us are stuck doing the same repetitive tasks over and over. Sound familiar?\n\n{prompt} changes that completely.\n\n## What makes it special?\n\n**The good stuff:**\n- Actually saves time (not just claims to)\n- Works with tools you already use\n- Doesn't require a PhD to figure out\n- Real results, not just hype\n\n## My experience\n\nI was skeptical at first (aren't we all?), but after using it for a month:\n\n- Cut my weekly admin time from 20 hours to 5\n- 3x more productive on actual work\n- Way less stressed about deadlines\n\n## Should you try it?\n\nIf you're a {audience} who's tired of busy work eating up your day, then yeah, definitely worth checking out.\n\nQuestions? Drop them in the comments! Always happy to chat about productivity hacks.\n\nCheers! ✨",
    ],
  },
  launch: {
    professional: [
      "🚀 **Launching Today: {prompt}**\n\n**Tagline:** The AI-powered solution that transforms how {audience} work\n\n**The Problem:**\nMost {audience} spend 60% of their time on repetitive tasks instead of strategic work.\n\n**Our Solution:**\n{prompt} uses advanced AI to automate workflows, generate content, and optimize processes.\n\n**Key Features:**\n✅ Intelligent automation\n✅ Seamless integrations\n✅ Real-time analytics\n✅ 24/7 AI assistance\n\n**Early Results:**\n• 300% productivity increase\n• 70% reduction in manual work\n• 95% user satisfaction\n• $2M+ in time savings for users\n\n**Special Launch Offer:**\n🎁 50% off first 3 months\n🎁 Free onboarding & setup\n🎁 Priority support\n\n**Why Now?**\nThe future of work is here. Join 10,000+ {audience} who've already transformed their productivity.\n\n**Get Started:** [Launch Link]\n\n#ProductHunt #AI #Productivity #{audience}",
    ],
  },
};

// Simulate AI processing delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, type, tone, audience } = body;

    // Simulate processing time
    await delay(2000 + Math.random() * 2000);

    // Get templates for the content type and tone
    const templates = contentTemplates[type]?.[tone as keyof typeof contentTemplates[typeof type]] || 
                     contentTemplates[type]?.professional || 
                     ["Generated content for {prompt}"];

    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Replace placeholders
    const content = template
      .replace(/{prompt}/g, prompt)
      .replace(/{audience}/g, audience);

    return NextResponse.json({
      success: true,
      content,
      metadata: {
        type,
        tone,
        audience,
        wordCount: content.split(' ').length,
        estimatedReadTime: Math.ceil(content.split(' ').length / 200),
      },
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}