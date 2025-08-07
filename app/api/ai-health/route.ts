import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { 
  getAllProvidersHealth, 
  resetProviderErrors, 
  getProviderStats 
} from '@/lib/ai-provider';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow authenticated users to check health
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'health') {
      const healthStatuses = await getAllProvidersHealth();
      return NextResponse.json({
        success: true,
        providers: healthStatuses,
        timestamp: new Date().toISOString()
      });
    } 

    if (action === 'stats') {
      const stats = getProviderStats();
      return NextResponse.json({
        success: true,
        stats,
        timestamp: new Date().toISOString()
      });
    }

    // Default: return both health and stats
    const [healthStatuses, stats] = await Promise.all([
      getAllProvidersHealth(),
      getProviderStats()
    ]);

    return NextResponse.json({
      success: true,
      providers: healthStatuses,
      stats,
      timestamp: new Date().toISOString(),
      summary: {
        totalProviders: stats.length,
        healthyProviders: healthStatuses.filter(p => p.isHealthy).length,
        availableProviders: stats.filter(s => s.isAvailable && s.hasApiKey).length,
        configuredApiKeys: stats.filter(s => s.hasApiKey).length
      }
    });

  } catch (error) {
    console.error('AI Health API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get AI provider health' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow authenticated users to reset errors
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'reset') {
      resetProviderErrors();
      return NextResponse.json({
        success: true,
        message: 'Provider error counts reset successfully',
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "reset" to reset provider errors.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('AI Health API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
