"use client"

import { formatDateTime } from "@/lib/utils"
import { ActivityLogType } from "@/types"
import { Activity } from "lucide-react"

interface ActivityFeedProps {
  activities: ActivityLogType[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3 border-l-2 border-gray-200 pl-4 py-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {activity.description}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {activity.user.name} • {formatDateTime(activity.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
