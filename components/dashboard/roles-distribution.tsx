"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useData } from "@/lib/data-context"

const roleColors = ["#22c55e", "#f97316", "#3b82f6", "#eab308", "#a855f7", "#ec4899", "#64748b", "#06b6d4", "#ef4444", "#84cc16"]

interface RolesDistributionProps {
  department?: string
}

export function RolesDistribution({ department }: RolesDistributionProps) {
  const { data, getFreelancersByDepartment } = useData()
  const [showAll, setShowAll] = useState(false)

  const freelancers = department
    ? getFreelancersByDepartment(department)
    : data.freelancers

  const roleMap = new Map<string, number>()
  freelancers.forEach((f) => {
    roleMap.set(f.jobTitle, (roleMap.get(f.jobTitle) || 0) + 1)
  })

  const allRoles = Array.from(roleMap.entries())
    .map(([name, count], i) => ({
      name,
      count,
      color: roleColors[i % roleColors.length],
    }))
    .sort((a, b) => b.count - a.count)

  const roles = showAll ? allRoles : allRoles.slice(0, 7)
  const maxCount = Math.max(...allRoles.map((r) => r.count), 1)
  const total = allRoles.reduce((sum, r) => sum + r.count, 0)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card p-6" dir="rtl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">توزيع الأدوار الوظيفية</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {department
            ? `المسميات الوظيفية في ${department}`
            : "تتبع المسميات الوظيفية والتخصصات المطلوبة"}
        </p>
      </div>

      {/* Bar Chart with Percentages */}
      <div className="space-y-3">
        {roles.length > 0 ? (
          roles.map((role) => (
            <div key={role.name} className="flex items-center gap-3">
              <span className="w-8 text-right text-sm font-medium text-foreground">
                {role.count.toLocaleString("en-US")}
              </span>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="absolute right-0 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(role.count / maxCount) * 100}%`,
                    backgroundColor: role.color,
                  }}
                />
              </div>
              <span className="text-sm text-foreground">
                {total > 0 ? Math.round((role.count / total) * 100) : 0}%
              </span>
              <span className="w-32 truncate text-right text-sm text-muted-foreground">
                {role.name}
              </span>
            </div>
          ))
        ) : (
          <div className="flex h-20 items-center justify-center text-muted-foreground">
            لا توجد بيانات
          </div>
        )}
      </div>

      {/* Show All Button */}
      {allRoles.length > 7 && (
        <div className="mt-4 border-t border-border pt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            {showAll ? (
              <>
                <span>عرض أقل</span>
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                <span>عرض الكل ({allRoles.length})</span>
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
