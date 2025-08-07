import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskDay } = await request.json();

    if (!taskDay) {
      return NextResponse.json({ error: 'Task day is required' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get current week's marketing plan
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const marketingPlan = await prisma.marketingPlan.findFirst({
      where: {
        userId: user.id,
        weekStarting: startOfWeek,
        isActive: true
      }
    });

    if (!marketingPlan) {
      return NextResponse.json({ error: 'No active marketing plan found' }, { status: 404 });
    }

    // Add the completed task if not already completed
    const completedTasks = marketingPlan.completedTasks || [];
    if (!completedTasks.includes(taskDay)) {
      completedTasks.push(taskDay);
      
      await prisma.marketingPlan.update({
        where: { id: marketingPlan.id },
        data: {
          completedTasks: completedTasks
        }
      });

      // Log the activity
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          activity: 'task_completed',
          description: `Completed marketing task: ${taskDay}`,
          metadata: {
            taskDay: taskDay,
            planId: marketingPlan.id
          }
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      completedTasks: completedTasks
    });

  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    );
  }
}