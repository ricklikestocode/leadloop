"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LEAD_SOURCES, LEAD_STATUSES } from "@/lib/constants"
import { X } from "lucide-react"

export function LeadFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || ""
  const source = searchParams.get("source") || ""

  const updateFilters = useCallback(
    (newParams: Record<string, string>) => {
      const params = new URLSearchParams(searchParams)
      
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  const clearFilters = () => {
    router.push("")
  }

  const hasFilters = search || status || source

  return (
    <div className="flex gap-3 flex-wrap">
      <Input
        placeholder="Search leads..."
        value={search}
        onChange={(e) => updateFilters({ search: e.target.value })}
        className="w-64"
      />

      <Select
        value={status}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilters({ status: e.target.value })}
      >
        <option value="">All Statuses</option>
        {Object.entries(LEAD_STATUSES).map(([key, value]) => (
          <option key={key} value={value}>
            {value.charAt(0) + value.slice(1).toLowerCase()}
          </option>
        ))}
      </Select>

      <Select
        value={source}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilters({ source: e.target.value })}
      >
        <option value="">All Sources</option>
        {Object.entries(LEAD_SOURCES).map(([key, value]) => (
          <option key={key} value={value}>
            {value.charAt(0) + value.slice(1).toLowerCase()}
          </option>
        ))}
      </Select>

      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
