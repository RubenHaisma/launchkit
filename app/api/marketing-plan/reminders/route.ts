import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Sends email reminders for today's tasks. Intended to be triggered by a daily cron (e.g. Vercel cron).
export async function POST(request: NextRequest) {
  try {
    const { userId, dryRun } = await request.json().catch(() => ({ }))

    // If userId is supplied, we run for that user only; otherwise iterate all users.
    const users = userId
      ? await prisma.user.findMany({ where: { id: userId } })
      : await prisma.user.findMany({ where: { status: 'active' } })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().slice(0, 10)

    const summaries: any[] = []

    for (const user of users) {
      const plans = await prisma.marketingPlan.findMany({
        where: { userId: user.id, isActive: true }
      })

      const todaysTasks: Array<{ title: string; type: string; time?: string }> = []

      for (const plan of plans) {
        const data = plan.planData as any
        if (!data?.days) continue
        const day = data.days.find((d: any) => d.date === todayStr)
        if (day) {
          for (const task of day.tasks || []) {
            todaysTasks.push({ title: task.title, type: task.type, time: task.time })
          }
        }
      }

      if (todaysTasks.length === 0) {
        summaries.push({ userId: user.id, email: user.email, tasks: 0 })
        continue
      }

      const subject = `Your ${todayStr} launch tasks`
      const html = `
        <div style="font-family:Inter,system-ui,Arial,sans-serif;">
          <h2 style="margin:0 0 12px 0;">Today's Focus</h2>
          <p style="margin:0 0 12px 0;">Stay on track. Complete these tasks to move ${user.name || 'your product'} forward.</p>
          <ol>
            ${todaysTasks
              .map(t => `<li><strong>${t.title}</strong> <span style="color:#64748b">(${t.type}${t.time ? ` · ${t.time}` : ''})</span></li>`)
              .join('')}
          </ol>
          <p><a href="${process.env.NEXTAUTH_URL}/dashboard/calendar" style="display:inline-block;padding:10px 16px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;text-decoration:none;font-weight:600;">Open calendar</a></p>
        </div>
      `

      if (!dryRun) {
        await fetch(`${process.env.NEXTAUTH_URL}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: user.email, subject, content: html })
        }).catch(() => {})
      }

      summaries.push({ userId: user.id, email: user.email, tasks: todaysTasks.length })
    }

    return NextResponse.json({ success: true, summaries })
  } catch (error) {
    console.error('Reminder send error', error)
    return NextResponse.json({ error: 'Failed to send reminders' }, { status: 500 })
  }
}


