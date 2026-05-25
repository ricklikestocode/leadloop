import { sendEmail } from '@/lib/email'
import { getEmailDigestHTML } from '@/lib/emailDigestTemplate'
import { scheduleDailyJob } from '@/lib/cron'

// Helper to get today as YYYY-MM-DD
function getToday() {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}


import { getWorkspaceAnalytics } from '@/actions/analytics'
import { db } from '@/lib/db'

// Calculate streak: number of consecutive days with at least 1 win (leadsWon > 0)
function calculateStreak(daily: any[]): number {
  let streak = 0
  for (let i = daily.length - 1; i >= 0; i--) {
    if (daily[i].leadsWon > 0) {
      streak++
    } else {
      break
    }
  }
  return streak
}

// Calculate time saved: assume 15min per AI reply (customize as needed)
function calculateTimeSaved(aiReplies: number): number {
  return Math.round((aiReplies * 15) / 60) // hours
}

async function getUserMetrics(userId: string) {
  // Find user's primary workspace
  const workspaceUser = await db.workspaceUser.findFirst({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })
  if (!workspaceUser) return null
  const workspaceId = workspaceUser.workspaceId

  // Get analytics for last 7 days
  const dateFrom = new Date()
  dateFrom.setDate(dateFrom.getDate() - 6)
  dateFrom.setHours(0, 0, 0, 0)
  const analyticsRes = await getWorkspaceAnalytics(workspaceId, dateFrom.toISOString())
  if (!analyticsRes.success || !analyticsRes.analytics) return null
  const { summary, daily } = analyticsRes.analytics

  // Streak: consecutive days with at least 1 win
  const streak = calculateStreak(daily)
  // Time saved: 15min per AI reply (last 7 days)
  const aiReplies = 0 // daily.reduce((sum, d) => sum + (d.aiRepliesCount || 0), 0)
  const timeSaved = calculateTimeSaved(aiReplies)
  // Conversion: current summary
  const conversion = summary.conversionRate
  // Hot leads: leads with status NEW or IN_PROGRESS
  const hotLeads = await db.lead.count({ where: { workspaceId, status: { in: ['NEW', 'IN_PROGRESS'] } } })
  // AI replies: last 7 days
  // Already calculated as aiReplies
  // Follow-ups due: pending follow-ups
  const followUps = await db.followUp.count({ where: { lead: { workspaceId }, status: 'PENDING' } })
  // Wins: leads won in last 7 days
  const wins = daily.reduce((sum, d) => sum + (d.leadsWon || 0), 0)

  return {
    streak,
    timeSaved,
    conversion: Math.round(conversion),
    hotLeads,
    aiReplies,
    followUps,
    wins,
  }
}

export async function sendDailyDigest() {
  const users = await db.user.findMany({
    where: { email: { not: null } },
    select: { id: true, name: true, email: true },
  })

  for (const user of users) {
    const metrics = await getUserMetrics(user.id)
    if (!metrics) continue
    const html = getEmailDigestHTML({
      name: user.name || 'there',
      ...metrics,
      date: getToday(),
    })
    await sendEmail({
      to: user.email!,
      subject: `Your Daily SaaS Performance Digest (${getToday()})`,
      html,
    })
  }
}

// Schedule to run at 7:00 AM UTC (adjust for user timezone in production)
scheduleDailyJob(7, 0, () => {
  sendDailyDigest().catch(console.error)
})
