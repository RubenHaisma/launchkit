import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type HistoryType = 'tweet' | 'email' | 'blog' | 'launch'

interface HistoryItem {
  id: string
  source: 'generation' | 'tweet' | 'outreach' | 'post'
  type: HistoryType
  content: string
  prompt?: string | null
  tone?: string | null
  audience?: string | null
  subject?: string | null
  title?: string | null
  url?: string | null
  published?: boolean | null
  createdAt: string
}

const generationTypeToHistoryType = (genType: string): HistoryType | null => {
  const map: Record<string, HistoryType> = {
    'tweet': 'tweet',
    'twitter-thread': 'tweet',
    'email-body': 'email',
    'newsletter': 'email',
    'cold-email': 'email',
    'blog-post': 'blog',
    'product-hunt-launch': 'launch',
  }
  return map[genType] || null
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch in parallel
    const [generations, tweets, outreachCampaigns, posts] = await Promise.all([
      prisma.generation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
      prisma.tweet.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
      prisma.outreachCampaign.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
      prisma.post.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 500,
      }),
    ])

    const items: HistoryItem[] = []

    // Tweets from tweets table (authoritative for tweets)
    for (const t of tweets) {
      items.push({
        id: `tweet_${t.id}`,
        source: 'tweet',
        type: 'tweet',
        content: t.content,
        prompt: t.prompt || null,
        tone: null,
        audience: null,
        subject: null,
        title: null,
        url: t.tweetUrl || null,
        published: t.published,
        createdAt: t.createdAt.toISOString(),
      })
    }

    // Generations excluding simple tweet (to avoid duplicate), keep twitter-thread as tweet
    for (const g of generations) {
      const mapped = generationTypeToHistoryType(g.type)
      if (!mapped) continue
      if (g.type === 'tweet') continue // skip duplicates with tweets table
      items.push({
        id: `gen_${g.id}`,
        source: 'generation',
        type: mapped,
        content: g.content,
        prompt: g.prompt,
        tone: g.tone,
        audience: g.audience,
        subject: null,
        title: null,
        url: null,
        published: null,
        createdAt: g.createdAt.toISOString(),
      })
    }

    // Outreach campaigns as emails
    for (const c of outreachCampaigns) {
      items.push({
        id: `outreach_${c.id}`,
        source: 'outreach',
        type: 'email',
        content: c.content,
        prompt: null,
        tone: null,
        audience: null,
        subject: c.subject,
        title: null,
        url: null,
        published: c.status === 'sent',
        createdAt: c.createdAt.toISOString(),
      })
    }

    // Posts (treat blog platform as blog)
    for (const p of posts) {
      const normalizedType: HistoryType = p.platform?.toLowerCase() === 'blog' ? 'blog' : p.platform?.toLowerCase() === 'linkedin' ? 'blog' : 'tweet'
      items.push({
        id: `post_${p.id}`,
        source: 'post',
        type: normalizedType,
        content: p.content,
        prompt: null,
        tone: null,
        audience: null,
        subject: null,
        title: p.title || null,
        url: null,
        published: p.published,
        createdAt: p.createdAt.toISOString(),
      })
    }

    // Sort newest first
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const counts = items.reduce(
      (acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1
        return acc
      },
      { tweet: 0, email: 0, blog: 0, launch: 0 } as Record<HistoryType, number>
    )

    return NextResponse.json({ success: true, items, counts })
  } catch (error) {
    console.error('History API error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch content history' }, { status: 500 })
  }
}


