import { prisma } from '@/lib/prisma'

export async function deductCredits(userId: string, amount: number = 1): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, plan: true }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Growth plan has unlimited credits
    if (user.plan === 'growth') {
      return true
    }

    // Check if user has enough credits
    if (user.credits < amount) {
      return false
    }

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: amount
        }
      }
    })

    return true
  } catch (error) {
    console.error('Error deducting credits:', error)
    return false
  }
}

export async function getUserCredits(userId: string): Promise<{ credits: number; plan: string } | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, plan: true }
    })

    return user
  } catch (error) {
    console.error('Error getting user credits:', error)
    return null
  }
}

export async function resetMonthlyCredits(): Promise<void> {
  try {
    // Reset credits for free users (50 credits)
    await prisma.user.updateMany({
      where: { plan: 'free' },
      data: { credits: 50 }
    })

    // Reset credits for pro users (500 credits)
    await prisma.user.updateMany({
      where: { plan: 'pro' },
      data: { credits: 500 }
    })

    console.log('Monthly credits reset successfully')
  } catch (error) {
    console.error('Error resetting monthly credits:', error)
  }
}