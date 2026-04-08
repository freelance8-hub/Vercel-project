"use client"

import { Building2, Users, Wallet } from "lucide-react"
import type { DepartmentSummary } from "@/lib/types"

interface DepartmentCardProps {
  department: DepartmentSummary
  onClick: () => void
}

export function DepartmentCard({ department, onClick }: DepartmentCardProps) {
  return (
    <button
      onClick={onClick}
      dir="rtl"
      className="group relative w-full overflow-hidden rounded-2xl border border-border bg-card p-6 text-right transition-all hover:border-border/80 hover:bg-card/80"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${department.color}20` }}
        >
          <Building2 className="h-5 w-5" style={{ color: department.color }} />
        </div>
        <h3 className="text-lg font-semibold text-foreground">{department.name}</h3>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary/50 px-4 py-3 text-right">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs">عقود نشطة</span>
          </div>
          <p
            className="mt-1 text-2xl font-bold"
            style={{ color: department.color }}
          >
            {department.freelancerCount.toLocaleString("en-US")}
          </p>
          <p className="text-xs text-muted-foreground">كل الفترات</p>
        </div>
        <div className="rounded-xl bg-secondary/50 px-4 py-3 text-right">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span className="text-xs">إجمالي التكاليف</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {department.totalAmount.toLocaleString("en-US")} <span className="text-sm">ر.س</span>
          </p>
          <p className="text-xs text-muted-foreground">كل الفترات</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">نسبة التكلفة</span>
          <span
            className="text-sm font-semibold"
            style={{ color: department.color }}
          >
            {department.percentage.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${department.percentage}%`,
              backgroundColor: department.color,
            }}
          />
        </div>
      </div>
    </button>
  )
}
