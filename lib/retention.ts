import { db } from '@/lib/db'

export const STREAK_MILESTONES = {
  FIRST_WIN: { days: 1, label: '1-Day Warrior', emoji: '⚡', reward: 'First win!' },
  THREE_DAYS: { days: 3, label: '3-Day Champion', emoji: '🔥', reward: 'On fire!' },
  SEVEN_DAYS: { days: 7, label: '7-Day Legend', emoji: '👑', reward: 'Week warrior!' },
  FOURTEEN_DAYS: { days: 14, label: '14-Day Master', emoji: '⭐', reward: 'Two weeks strong!' },
  THIRTY_DAYS: { days: 30, label: '30-Day Elite', emoji: '🏆', reward: 'One month champion!' },
}

/**
 * Calculate current streak for a workspace (consecutive days with at least 1 win)
 */
export async function calculateStreak(workspaceId: string): Promise<number> {
  const analytics = await db.workspaceAnalytics.findMany({
    where: { workspaceId },
    orderBy: { date: 'desc' },
    take: 60, // Last 2 months
  })

  let streak = 0
  for (const record of analytics) {
    if (record.leadsWon > 0) {
      streak++
    } else {
      break
    }
  }
  return streak
}

/**
 * Check if streak milestone is reached and create notification
 */
export async function checkStreakMilestone(workspaceId: string, userId: string): Promise<string | null> {
  const streak = await calculateStreak(workspaceId)

  // Check which milestone was just reached
  let milestoneKey: string | null = null
  for (const [key, milestone] of Object.entries(STREAK_MILESTONES)) {
    if (streak === milestone.days) {
      milestoneKey = key
      break
    }
  }

  if (!milestoneKey) return null

  const milestone = STREAK_MILESTONES[milestoneKey as keyof typeof STREAK_MILESTONES]

  // Create celebration notification
  await db.notification.create({
    data: {
      workspaceId,
      userId,
      type: 'MILESTONE',
      title: `🎉 ${milestone.emoji} ${milestone.label}!`,
      message: `Amazing! You've maintained a ${streak}-day winning streak. ${milestone.reward}`,
      read: false,
    },
  })

  return milestoneKey
}

/**
 * Track AI improvement over time
 */
export async function generateAIFeedback(workspaceId: string): Promise<string | null> {
  const analytics = await db.workspaceAnalytics.findMany({
    where: { workspaceId },
    orderBy: { date: 'desc' },
    take: 7,
  })

  if (analytics.length < 2) return null

  const recent = analytics[0]
  const previous = analytics[1]

  const conversionImprovement = recent.conversionRate - previous.conversionRate
  const winsImprovement = recent.leadsWon - previous.leadsWon

  if (conversionImprovement >= 5) {
    return `🚀 Your AI improved conversion by ${conversionImprovement.toFixed(1)}% - it's learning from your sales patterns!`
  } else if (winsImprovement >= 2) {
    return `📈 You're closing more deals! AI helped you win ${winsImprovement} more leads this period.`
  } else if (false) { // aiRepliesCount field doesn't exist
    return `💡 Your AI is working harder. It's getting smarter with each conversation!`
  }

  return null
}

/**
 * Calculate achievement badges earned
 */
export async function calculateAchievements(workspaceId: string): Promise<Array<{
  id: string
  label: string
  emoji: string
  description: string
  progress: number // 0-100
}>> {
  const analytics = await db.workspaceAnalytics.findMany({
    where: { workspaceId },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const totalWins = analytics.reduce((sum, a) => sum + a.leadsWon, 0)
  const totalReplies = 0 // analytics.reduce((sum, a) => sum + a.aiRepliesCount || 0, 0)
  const avgConversion = analytics.length > 0
    ? analytics.reduce((sum, a) => sum + a.conversionRate, 0) / analytics.length
    : 0

  const todayAnalytics = analytics.find(a => a.date.toDateString() === today.toDateString())
  const todayReplies = 0 // todayAnalytics?.aiRepliesCount || 0

  // Define badges
  const badges = [
    {
      id: 'first_win',
      label: 'First Victory',
      emoji: '🎯',
      description: 'Won your first deal',
      progress: totalWins >= 1 ? 100 : 0,
    },
    {
      id: 'hot_starter',
      label: 'Hot Starter',
      emoji: '🔥',
      description: 'Generated 10+ hot leads',
      progress: Math.min(100, totalWins >= 10 ? 100 : (totalWins / 10) * 100),
    },
    {
      id: 'ai_master',
      label: 'AI Master',
      emoji: '🤖',
      description: 'Generated 100+ AI replies',
      progress: Math.min(100, (totalReplies / 100) * 100),
    },
    {
      id: 'conversion_expert',
      label: 'Conversion Expert',
      emoji: '📈',
      description: '50%+ conversion rate',
      progress: avgConversion,
    },
    {
      id: 'daily_driver',
      label: 'Daily Driver',
      emoji: '💪',
      description: 'Used AI replies today',
      progress: todayReplies > 0 ? 100 : 0,
    },
  ]

  return badges
}

/**
 * Calculate time saved (in hours)
 */
export async function calculateTimeSaved(workspaceId: string): Promise<number> {
  const analytics = await db.workspaceAnalytics.findMany({
    where: { workspaceId },
  })

  const totalReplies = 0 // analytics.reduce((sum, a) => sum + (a.aiRepliesCount || 0), 0)
  // Assume 15 minutes per manual reply saved
  return 0 // Math.round((totalReplies * 15) / 60)
}

/**
 * Get celebration message for user
 */
export function getCelebrationMessage(streak: number, wins: number, conversion: number): string {
  if (streak >= 30 && wins >= 50) {
    return '🏆 You\'re unstoppable! You\'re a sales machine!'
  } else if (streak >= 14) {
    return '👑 Two weeks strong! Keep crushing it!'
  } else if (conversion >= 50) {
    return '📈 50%+ conversion rate? Incredible!'
  } else if (wins >= 10) {
    return '🎉 10+ deals closed! You\'re on fire!'
  } else if (streak >= 7) {
    return '🔥 Week warrior! Keep up the momentum!'
  } else if (streak >= 3) {
    return '⚡ 3 days in a row! You\'re building momentum!'
  } else if (wins >= 1) {
    return '🎯 First win! This is just the beginning!'
  }
  return '💪 Keep pushing! Your next win is coming!'
}
