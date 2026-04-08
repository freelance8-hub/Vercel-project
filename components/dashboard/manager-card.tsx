"use client"

import { UserCircle, Users, Wallet } from "lucide-react"
import type { ManagerSummary } from "@/lib/types"

interface ManagerCardProps {
  manager: ManagerSummary
}

export function ManagerCard({ manager }: ManagerCardProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card p-6 text-left">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${manager.color}20` }}
        >
          <UserCircle className="h-5 w-5" style={{ color: manager.color }} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{manager.name}</h3>
          {manager.department && (
            <p className="text-sm text-muted-foreground">{manager.department}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-xs">عدد المستقلين</span>
          </div>
          <p
            className="mt-1 text-2xl font-bold"
            style={{ color: manager.color }}
          >
            {manager.freelancerCount.toLocaleString("en-US")}
          </p>
          <p className="text-xs text-muted-foreground">تحت إشرافه</p>
        </div>
        <div className="rounded-xl bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span className="text-xs">إجمالي التكاليف</span>
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {manager.totalAmount.toLocaleString("en-US")} <span className="text-sm">ر.س</span>
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
            style={{ color: manager.color }}
          >
            {manager.percentage.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${manager.percentage}%`,
              backgroundColor: manager.color,
            }}
          />
        </div>
      </div>
    </div>
  )
}
