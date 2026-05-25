"use server"

import { db } from '@/lib/db'
import { getSession, getUserWorkspaceId } from '@/lib/auth-utils'
import { 
  checkStreakMilestone, 
  calculateStreak, 
  generateAIFeedback, 
  calculateAchievements,
  calculateTimeSaved,
  getCelebrationMessage
} from '@/lib/retention'

export async function checkAndCelebrate() {
  try {
    const session = await getSession()
    if (!session?.user) throw new Error('Unauthorized')

    const workspaceId = await getUserWorkspaceId(session.user.id as string)
    if (!workspaceId) throw new Error('No workspace found')

    // Check for streak milestone
    const milestone = await checkStreakMilestone(workspaceId, session.user.id as string)

    // Get current streak
    const streak = await calculateStreak(workspaceId)

    // Get AI feedback
    const aiFeedback = await generateAIFeedback(workspaceId)

    return {
      success: true,
      milestone,
      streak,
      aiFeedback,
    }
  } catch (error: any) {
    console.error('Error checking streak:', error)
    return { success: false, error: error.message }
  }
}

export async function getStreakInfo() {
  try {
    const session = await getSession()
    if (!session?.user) throw new Error('Unauthorized')

    const workspaceId = await getUserWorkspaceId(session.user.id as string)
    if (!workspaceId) throw new Error('No workspace found')

    const [streak, achievements, timeSaved] = await Promise.all([
      calculateStreak(workspaceId),
      calculateAchievements(workspaceId),
      calculateTimeSaved(workspaceId),
    ])

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        analytics: {
          orderBy: { date: 'desc' },
          take: 1,
        },
      },
    })

    const latestAnalytics = workspace?.analytics[0]
    const wins = latestAnalytics?.leadsWon || 0
    const conversion = latestAnalytics?.conversionRate || 0

    const celebration = getCelebrationMessage(streak, wins, conversion)

    return {
      success: true,
      streak,
      achievements,
      timeSaved,
      celebration,
      wins,
      conversion,
    }
  } catch (error: any) {
    console.error('Error getting streak info:', error)
    return { success: false, error: error.message }
  }
}

export async function getUnreadCelebrations() {
  try {
    const session = await getSession()
    if (!session?.user) throw new Error('Unauthorized')

    const workspaceId = await getUserWorkspaceId(session.user.id as string)
    if (!workspaceId) throw new Error('No workspace found')

    const celebrations = await db.notification.findMany({
      where: {
        workspaceId,
        userId: session.user.id as string,
        type: 'MILESTONE',
        read: false,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    return {
      success: true,
      celebrations,
    }
  } catch (error: any) {
    console.error('Error getting celebrations:', error)
    return { success: false, error: error.message }
  }
}

export async function markCelebrationRead(notificationId: string) {
  try {
    const session = await getSession()
    if (!session?.user) throw new Error('Unauthorized')

    await db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error marking celebration read:', error)
    return { success: false, error: error.message }
  }
}
