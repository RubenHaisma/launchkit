import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateContent } from '@/lib/ai'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function generateTrackingId(): string {
  // Short unique, URL-safe
  return `trk_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const posts = await prisma.post.findMany({
      where: { userId: user.id, platform: 'blog' },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('Blog GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businessProfile: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await request.json()
    const {
      title,
      content,
      prompt,
      tone = 'professional',
      audience = 'business-owners',
      additionalContext = '',
      keywords = [],
      callToAction,
      generate = false,
    }: {
      title?: string
      content?: string
      prompt?: string
      tone?: any
      audience?: any
      additionalContext?: string
      keywords?: string[]
      callToAction?: string
      generate?: boolean
    } = body

    let finalTitle = title?.trim()
    let finalContent = content?.trim()

    if (generate) {
      const bp = user.businessProfile
      const businessContext = bp
        ? `Business Name: ${bp.businessName || ''}\nIndustry: ${bp.industry || ''}\nDescription: ${bp.description || ''}\nTarget Audience: ${bp.targetAudience || ''}\nUnique Value Prop: ${bp.uniqueValueProp || ''}`
        : ''

      const result = await generateContent({
        prompt: prompt || `Create a high-quality blog post for ${bp?.businessName || 'our business'}`,
        contentType: 'blog-post',
        tone,
        audience,
        additionalContext,
        keywords,
        callToAction,
        businessContext,
      })

      finalContent = result.content

      if (!finalTitle) {
        // Generate a title if not provided
        const titleResult = await generateContent({
          prompt: `Create a concise SEO-friendly title for this blog content: ${result.content.slice(0, 1200)}`,
          contentType: 'blog-title',
          tone,
          audience,
          businessContext,
        })
        finalTitle = titleResult.content.replace(/\n/g, ' ').slice(0, 100)
      }
    }

    if (!finalTitle || !finalContent) {
      return NextResponse.json({ error: 'Title and content are required (or set generate: true with a prompt)' }, { status: 400 })
    }

    const trackingId = generateTrackingId()
    const slug = slugify(finalTitle)

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        platform: 'blog',
        title: finalTitle,
        content: finalContent,
        slug,
        trackingId,
        published: false,
      },
    })

    // Activity log
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        activity: 'post_created',
        description: `Created blog post: ${finalTitle}`,
        metadata: { postId: post.id, slug, trackingId },
      },
    })

    // Return embed snippet for tracking
    const baseUrl = new URL(request.url).origin
    const embedSnippet = `<!-- LaunchPilot Blog Tracking -->\n<script>(function(){try{var i=new Image();var q='tid=${trackingId}&pid=${post.id}&url='+encodeURIComponent(window.location.href)+'&ref='+encodeURIComponent(document.referrer);i.referrerPolicy='no-referrer-when-downgrade';i.src='${baseUrl}/api/blog/track?'+q;}catch(e){}})();</script>`

    return NextResponse.json({ success: true, post, embedSnippet })
  } catch (error) {
    console.error('Blog POST error:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}


