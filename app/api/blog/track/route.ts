import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackingId = searchParams.get('tid') || ''
    const postId = searchParams.get('pid') || ''
    const pageUrl = searchParams.get('url') || ''
    const referrer = searchParams.get('ref') || ''

    if (!trackingId || !postId) {
      return new Response('', {
        status: 204,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
    }

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post || post.trackingId !== trackingId) {
      return new Response('', {
        status: 204,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      })
    }

    // Basic IP / UA capture
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    const userAgent = request.headers.get('user-agent') || ''
    const websiteHost = (() => {
      try {
        return pageUrl ? new URL(pageUrl).host : ''
      } catch {
        return ''
      }
    })()

    // UTM params if present in pageUrl
    let utmSource: string | null = null
    let utmMedium: string | null = null
    let utmCampaign: string | null = null
    try {
      const u = new URL(pageUrl)
      utmSource = u.searchParams.get('utm_source')
      utmMedium = u.searchParams.get('utm_medium')
      utmCampaign = u.searchParams.get('utm_campaign')
    } catch {}

    await prisma.postView.create({
      data: {
        postId: post.id,
        userId: post.userId,
        trackingId,
        ipAddress,
        userAgent,
        referrer,
        pageUrl,
        websiteHost,
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
      },
    })

    // 1x1 transparent gif
    const pixel = Buffer.from(
      'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    )
    return new Response(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  } catch (error) {
    // Never throw for tracking pixel; always return a pixel to avoid breaking site
    const pixel = Buffer.from(
      'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
      'base64'
    )
    return new Response(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/gif',
        'Content-Length': pixel.length.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
  }
}


