"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate, isOverdue, isDueToday } from "@/lib/utils"
import { Clock, AlertCircle } from "lucide-react"

interface FollowUpCardProps {
  id: string
  leadId: string
  leadName: string
  company?: string
  phone?: string
  dueDate: Date
  status: string
  isCompleted?: boolean
}

export function FollowUpCard({
  id,
  leadId,
  leadName,
  company,
  dueDate,
  isCompleted,
}: FollowUpCardProps) {
  const overdue = isOverdue(dueDate)
  const today = isDueToday(dueDate)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link
              href={`/dashboard/leads/${leadId}`}
              className="font-medium text-gray-900 hover:text-blue-600"
            >
              {leadName}
            </Link>
            {company && <p className="text-sm text-gray-600">{company}</p>}

            <div className="flex items-center gap-2 mt-3">
              <Clock className={`w-4 h-4 ${overdue ? "text-red-600" : today ? "text-orange-600" : "text-gray-400"}`} />
              <span className={`text-sm font-medium ${overdue ? "text-red-600" : today ? "text-orange-600" : "text-gray-600"}`}>
                {formatDate(dueDate)}
              </span>
              {overdue && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Overdue
                </span>
              )}
              {today && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  Today
                </span>
              )}
            </div>
          </div>

          {!isCompleted && (
            <Link href={`/dashboard/follow-ups#${id}`}>
              <Button size="sm" variant="outline">
                Complete
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
