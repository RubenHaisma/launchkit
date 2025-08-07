import { NextRequest, NextResponse } from 'next/server'
import { generateDemoContent } from '@/lib/ai'

interface DemoRequest {
  prompt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DemoRequest = await request.json();
    const { prompt } = body;

    if (!prompt || prompt.length < 5) {
      return NextResponse.json({ 
        error: 'Please provide a meaningful prompt (at least 5 characters)' 
      }, { status: 400 });
    }

    // Generate demo content for multiple platforms
    const result = await generateDemoContent(prompt);

    return NextResponse.json({
      success: true,
      results: result,
    });
  } catch (error) {
    console.error('Demo API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate demo content' },
      { status: 500 }
    );
  }
}