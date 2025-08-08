import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateContent } from '@/lib/ai'

type PlanTask = {
  id: string
  title: string
  type: 'launch' | 'email' | 'tweet' | 'linkedin' | 'blog' | 'reddit' | 'instagram'
  content?: string
  time?: string
  subject?: string
}

type PlanDay = {
  date: string
  tasks: PlanTask[]
}

type PlanData = {
  startDate: string
  endDate: string
  days: PlanDay[]
}

function startOfWeek(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  const s = new Date(d.setDate(diff))
  s.setHours(0, 0, 0, 0)
  return s
}

function formatDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function buildThirtyDayPlan(startDate: Date, businessName?: string): PlanData {
  const days: PlanDay[] = []
  const planTitles: Array<{ title: string; type: PlanTask['type']; content?: string }> = [
    { title: 'Define positioning and ICP', type: 'launch' },
    { title: 'Draft landing page outline', type: 'blog' },
    { title: 'Collect social proofs and testimonials', type: 'launch' },
    { title: 'Write value prop Twitter post', type: 'tweet' },
    { title: 'Outline LinkedIn announcement', type: 'linkedin' },
    { title: 'Set up email capture on landing page', type: 'launch' },
    { title: 'Publish landing page MVP', type: 'blog' },
    { title: 'Create 3 Twitter posts for the week', type: 'tweet' },
    { title: 'Create 1 LinkedIn post for the week', type: 'linkedin' },
    { title: 'Build 25-target outreach list', type: 'email' },
    { title: 'Write cold email v1', type: 'email' },
    { title: 'Send 10 cold emails', type: 'email' },
    { title: 'Engage on Twitter for 30 minutes', type: 'tweet' },
    { title: 'Engage on LinkedIn for 30 minutes', type: 'linkedin' },
    { title: 'Draft Product Hunt assets', type: 'launch' },
    { title: 'Draft PH maker comment and FAQ', type: 'launch' },
    { title: 'Post behind-the-scenes on Instagram', type: 'instagram' },
    { title: 'Write a short problem-solution blog', type: 'blog' },
    { title: 'Send 10 more cold emails + follow-ups', type: 'email' },
    { title: 'Schedule Twitter thread', type: 'tweet' },
    { title: 'Schedule LinkedIn announcement', type: 'linkedin' },
    { title: 'Invite 5 friends to early access', type: 'email' },
    { title: 'Soft launch to waitlist', type: 'email' },
    { title: 'Tighten onboarding and pricing page', type: 'launch' },
    { title: 'Finalize Product Hunt listing', type: 'launch' },
    { title: 'LAUNCH DAY: Product Hunt + Twitter', type: 'launch' },
    { title: 'Post-launch support and DMs', type: 'launch' },
    { title: 'Share early traction recap', type: 'linkedin' },
    { title: 'Ship 1 quick win feature', type: 'launch' },
    { title: 'Publish case study from first users', type: 'blog' }
  ]

  for (let i = 0; i < 30; i++) {
    const date = addDays(startDate, i)
    const base = planTitles[i % planTitles.length]
    const day: PlanDay = {
      date: formatDate(date),
      tasks: [
        {
          id: `task_${formatDate(date)}_1`,
          title: base.title + (businessName ? ` — ${businessName}` : ''),
          type: base.type,
          content: base.content
        }
      ]
    }
    days.push(day)
  }

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(addDays(startDate, 29)),
    days
  }
}

async function generateTaskContent(
  task: PlanTask,
  businessContext?: { businessName?: string | null; description?: string | null; industry?: string | null }
): Promise<PlanTask> {
  const context = [
    businessContext?.businessName ? `Business: ${businessContext.businessName}` : '',
    businessContext?.industry ? `Industry: ${businessContext.industry}` : '',
    businessContext?.description ? `About: ${businessContext.description}` : ''
  ]
    .filter(Boolean)
    .join('\n')

  try {
    switch (task.type) {
      case 'tweet': {
        const res = await generateContent({
          prompt: `${task.title}. Create a single, authentic tweet.`,
          contentType: 'tweet',
          tone: 'conversational',
          audience: 'entrepreneurs',
          businessContext: context
        })
        return { ...task, content: res.content }
      }
      case 'linkedin': {
        const res = await generateContent({
          prompt: `${task.title}. Create a high-signal LinkedIn post with a strong hook and a soft CTA.`,
          contentType: 'linkedin-post',
          tone: 'professional',
          audience: 'business-owners',
          businessContext: context
        })
        return { ...task, content: res.content }
      }
      case 'instagram': {
        const res = await generateContent({
          prompt: `${task.title}. Create a concise, engaging caption with 5-7 relevant hashtags.`,
          contentType: 'instagram-caption',
          tone: 'casual',
          audience: 'creatives',
          businessContext: context
        })
        return { ...task, content: res.content }
      }
      case 'reddit': {
        const res = await generateContent({
          prompt: `${task.title}. Create an authentic Reddit text post suitable for r/startups.`,
          contentType: 'reddit-post',
          tone: 'friendly',
          audience: 'entrepreneurs',
          businessContext: context
        })
        return { ...task, content: res.content }
      }
      case 'blog': {
        const res = await generateContent({
          prompt: `${task.title}. Draft a concise 4-6 paragraph blog post outline and summary.`,
          contentType: 'blog-post',
          tone: 'educational',
          audience: 'entrepreneurs',
          businessContext: context,
          maxLength: 600
        })
        return { ...task, content: res.content }
      }
      case 'email': {
        const subj = await generateContent({
          prompt: `${task.title}. Create a high-open-rate subject line.`,
          contentType: 'email-subject',
          tone: 'professional',
          audience: 'entrepreneurs',
          businessContext: context,
          maxLength: 60
        })
        const body = await generateContent({
          prompt: `${task.title}. Write a short, personal email body with one clear CTA.`,
          contentType: 'email-body',
          tone: 'professional',
          audience: 'entrepreneurs',
          businessContext: context,
          maxLength: 180
        })
        const html = `<p>${body.content.replace(/\n/g, '<br/>')}</p>`
        return { ...task, subject: subj.content, content: html }
      }
      case 'launch': {
        const res = await generateContent({
          prompt: `${task.title}. Provide a short 5-item checklist with crisp steps.`,
          contentType: 'newsletter',
          tone: 'authoritative',
          audience: 'entrepreneurs',
          businessContext: context,
        })
        return { ...task, content: res.content }
      }
      default:
        return task
    }
  } catch {
    return task
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const plans = await prisma.marketingPlan.findMany({
      where: { userId: user.id, isActive: true }
    })

    const rangeStart = start ? new Date(start) : undefined
    const rangeEnd = end ? new Date(end) : undefined

    const allDays: Array<PlanDay & { completed: boolean }> = []
    for (const plan of plans) {
      const data = plan.planData as PlanData
      const completed = new Set(plan.completedTasks || [])
      for (const day of data.days) {
        const d = new Date(day.date)
        if (rangeStart && d < rangeStart) continue
        if (rangeEnd && d > rangeEnd) continue
        allDays.push({ ...day, completed: completed.has(day.date) })
      }
    }

    return NextResponse.json({ days: allDays })
  } catch (error) {
    console.error('Fetch plan error', error)
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { startDate } = await request.json()
    const start = startDate ? new Date(startDate) : new Date()
    start.setHours(0, 0, 0, 0)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { businessProfile: true }
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const plan = buildThirtyDayPlan(start, user.businessProfile?.businessName || undefined)

    // Auto-generate content for each day's tasks
    const businessContext = {
      businessName: user.businessProfile?.businessName || null,
      description: user.businessProfile?.description || null,
      industry: user.businessProfile?.industry || null
    }
    for (const day of plan.days) {
      const generated: PlanTask[] = []
      for (const t of day.tasks) {
        const withContent = await generateTaskContent(t, businessContext)
        generated.push(withContent)
      }
      day.tasks = generated
    }

    const weeks: Record<string, PlanDay[]> = {}
    for (const day of plan.days) {
      const w = startOfWeek(new Date(day.date)).toISOString()
      if (!weeks[w]) weeks[w] = []
      weeks[w].push(day)
    }

    for (const [weekIso, weekDays] of Object.entries(weeks)) {
      const weekStart = new Date(weekIso)
      const existing = await prisma.marketingPlan.findFirst({
        where: { userId: user.id, weekStarting: weekStart }
      })
      const data: PlanData = {
        startDate: plan.startDate,
        endDate: plan.endDate,
        days: weekDays
      }
      if (existing) {
        await prisma.marketingPlan.update({
          where: { id: existing.id },
          data: { planData: data, isActive: true }
        })
      } else {
        await prisma.marketingPlan.create({
          data: {
            userId: user.id,
            planData: data,
            weekStarting: weekStart,
            isActive: true,
            completedTasks: []
          }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create plan error', error)
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
  }
}


