"use client"

import { useState, useEffect } from "react"
import { Users, Banknote, Briefcase, Building2 } from "lucide-react"
import { useData } from "@/lib/data-context"

const roleColors = [
  "#22c55e", "#f97316", "#3b82f6", "#eab308",
  "#a855f7", "#ec4899", "#64748b", "#06b6d4", "#ef4444", "#84cc16",
]

export function GlobalOverview() {
  const { data } = useData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const freelancers = data?.freelancers ?? []
  const departments = data?.departments ?? []
  const totalSpending = data?.totalSpending ?? 0
  const totalFreelancers = data?.totalFreelancers ?? 0

  const roleMap = new Map<string, number>()
  freelancers.forEach((f) => {
    roleMap.set(f.jobTitle, (roleMap.get(f.jobTitle) || 0) + 1)
  })

  const allRoles = Array.from(roleMap.entries())
    .map(([name, count], i) => ({
      name,
      count,
      color: roleColors[i % roleColors.length],
      percentage: totalFreelancers > 0 ? Math.round((count / totalFreelancers) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)

  const topRoles = allRoles.slice(0, 5)
  const otherRoles = allRoles.slice(5)
  const otherCount = otherRoles.reduce((s, r) => s + r.count, 0)
  const otherPct = totalFreelancers > 0 ? Math.round((otherCount / totalFreelancers) * 100) : 0
  const avg = totalFreelancers > 0 ? Math.round(totalSpending / totalFreelancers) : 0

  const summaryCards = [
    { label: "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u0633\u062a\u0642\u0644\u064a\u0646", value: totalFreelancers.toLocaleString("en-US"), icon: Users, color: "#3b82f6" },
    { label: "\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062a", value: totalSpending.toLocaleString("en-US"), suffix: "\u0631.\u0633", icon: Banknote, color: "#22c55e" },
    { label: "\u0639\u062f\u062f \u0627\u0644\u0623\u0642\u0633\u0627\u0645", value: departments.length.toLocaleString("en-US"), icon: Building2, color: "#f97316" },
    { label: "\u0645\u062a\u0648\u0633\u0637 \u062a\u0643\u0644\u0641\u0629 \u0627\u0644\u0645\u0633\u062a\u0642\u0644", value: avg.toLocaleString("en-US"), suffix: "\u0631.\u0633", icon: Briefcase, color: "#a855f7" },
  ]

  if (!mounted) {
    return <div className="space-y-6" dir="rtl" suppressHydrationWarning />
  }

  if (totalFreelancers === 0) return null

  return (
    <div className="space-y-6" dir="rtl">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">{card.value}</span>
                  {card.suffix && (
                    <span className="text-sm text-muted-foreground">{card.suffix}</span>
                  )}
                </div>
              </div>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${card.color}18` }}
              >
                <card.icon className="h-5 w-5" style={{ color: card.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Department spending breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="mb-6 text-base font-semibold text-foreground">
            {"\u062a\u0648\u0632\u064a\u0639 \u0627\u0644\u0625\u0646\u0641\u0627\u0642 \u0628\u0627\u0644\u0623\u0642\u0633\u0627\u0645"}
          </h3>
          <div className="space-y-5">
            {departments.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <div className="flex w-40 shrink-0 flex-col items-end gap-0.5">
                  <span className="text-sm font-medium text-foreground">{dept.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {dept.totalAmount.toLocaleString("en-US")}
                    {" \u0631.\u0633"}
                  </span>
                </div>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="absolute right-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${dept.percentage}%`, backgroundColor: dept.color }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-sm font-semibold text-foreground">
                  {dept.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Role types breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {allRoles.length}
              {" \u0646\u0648\u0639 \u062f\u0648\u0631"}
            </span>
            <h3 className="text-base font-semibold text-foreground">
              {"\u062a\u0648\u0632\u064a\u0639 \u0627\u0644\u0623\u062f\u0648\u0627\u0631 \u0627\u0644\u0648\u0638\u064a\u0641\u064a\u0629"}
            </h3>
          </div>
          <div className="space-y-5">
            {topRoles.map((role) => (
              <div key={role.name} className="flex items-center gap-3">
                <div className="flex w-40 shrink-0 flex-col items-end gap-0.5">
                  <span className="truncate text-sm font-medium text-foreground">{role.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {role.count}
                    {" \u0645\u0633\u062a\u0642\u0644"}
                  </span>
                </div>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="absolute right-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${role.percentage}%`, backgroundColor: role.color }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-sm font-semibold text-foreground">
                  {role.percentage}%
                </span>
              </div>
            ))}
            {otherCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex w-40 shrink-0 flex-col items-end gap-0.5">
                  <span className="text-sm font-medium text-foreground">
                    {"\u0623\u062f\u0648\u0627\u0631 \u0623\u062e\u0631\u0649 ("}
                    {otherRoles.length}
                    {")"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {otherCount}
                    {" \u0645\u0633\u062a\u0642\u0644"}
                  </span>
                </div>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="absolute right-0 h-full rounded-full transition-all duration-500"
                    style={{ width: `${otherPct}%`, backgroundColor: "#64748b" }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-sm font-semibold text-foreground">
                  {otherPct}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
