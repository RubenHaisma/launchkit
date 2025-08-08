import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().slice(0, 10)

    // Check if reminder already sent today
    const alreadySent = await prisma.userActivity.findFirst({
      where: {
        userId: user.id,
        activity: 'reminder_sent',
      },
      orderBy: { timestamp: 'desc' }
    })

    if (alreadySent) {
      const ts = new Date(alreadySent.timestamp)
      ts.setHours(0, 0, 0, 0)
      if (ts.getTime() === today.getTime()) {
        return NextResponse.json({ success: true, skipped: true })
      }
    }

    // Send reminders for only this user via internal route
    await fetch(`${process.env.NEXTAUTH_URL}/api/marketing-plan/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id })
    }).catch(() => {})

    // Log activity to avoid duplicates
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        activity: 'reminder_sent',
        description: `Daily reminder sent for ${todayStr}`,
        metadata: { date: todayStr }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auto reminder error', error)
    return NextResponse.json({ error: 'Failed to auto-send reminder' }, { status: 500 })
  }
}


