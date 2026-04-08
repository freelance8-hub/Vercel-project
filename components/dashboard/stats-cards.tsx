"use client"

import { Users, Banknote, Building2, TrendingUp } from "lucide-react"
import { useData } from "@/lib/data-context"
import type { Freelancer } from "@/lib/types"

interface StatsCardsProps {
  department?: string
}

export function StatsCards({ department }: StatsCardsProps) {
  const { data, getFreelancersByDepartment, getDepartmentData } = useData()

  const freelancers: Freelancer[] = department
    ? getFreelancersByDepartment(department)
    : (data?.freelancers ?? [])

  const deptData = department ? getDepartmentData(department) : null

  const totalAmount = freelancers.reduce((sum, f) => sum + f.amount, 0)
  const avgAmount = freelancers.length > 0 ? totalAmount / freelancers.length : 0

  const costCenters = new Set(freelancers.map((f) => f.costCenter)).size
  const managers = new Set(freelancers.map((f) => f.directManager)).size

  const stats = [
    {
      label: department ? "عدد المستقلين" : "إجمالي المستقلين",
      value: freelancers.length.toLocaleString("en-US"),
      change: department ? `${deptData?.percentage.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}% من الإجمالي` : "+12%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      label: "إجمالي المبالغ",
      value: totalAmount.toLocaleString("en-US"),
      suffix: "ر.س",
      change: department ? `${costCenters.toLocaleString("en-US")} مركز تكلفة` : "+22%",
      changeType: "positive" as const,
      icon: Banknote,
    },
    {
      label: department ? "مراكز التكلفة" : "عدد الإدارات",
      value: department ? costCenters.toLocaleString("en-US") : (data?.departments?.length ?? 0).toLocaleString("en-US"),
      change: department ? "مشاريع نشطة" : "أقسام",
      changeType: "neutral" as const,
      icon: Building2,
    },
    {
      label: department ? "المدراء المباشرين" : "متوسط التكلفة",
      value: department ? managers.toLocaleString("en-US") : Math.round(avgAmount).toLocaleString("en-US"),
      suffix: department ? "" : "ر.س",
      change: department ? "مدير" : "-3%",
      changeType: department ? "neutral" : ("negative" as const),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" dir="rtl">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-muted-foreground/20"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3 text-right">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-sm text-muted-foreground">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  stat.changeType === "positive"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : stat.changeType === "negative"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {stat.change}
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <stat.icon className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
