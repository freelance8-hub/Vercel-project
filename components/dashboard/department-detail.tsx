"use client"

import { useState } from "react"
import { StatsCards } from "./stats-cards"
import { SpendingChart } from "./spending-chart"
import { ProjectBreakdown } from "./project-breakdown"
import { RolesDistribution } from "./roles-distribution"
import { TopFreelancers } from "./top-freelancers"
import { useData } from "@/lib/data-context"
import { Users, Wallet, ChevronDown, ChevronUp, User } from "lucide-react"
import type { ManagerSummary, Freelancer } from "@/lib/types"

interface DepartmentDetailProps {
  department: string
}

function ManagerRow({ manager, onToggle, isExpanded }: { manager: ManagerSummary; onToggle: () => void; isExpanded: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card/50" dir="rtl">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-right transition-colors hover:bg-secondary/30"
      >
        <div className="flex flex-1 items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${manager.color}20` }}
            >
              <User className="h-4 w-4" style={{ color: manager.color }} />
            </div>
            <span className="font-medium text-foreground">{manager.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold" style={{ color: manager.color }}>
              {manager.freelancerCount.toLocaleString("en-US")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{manager.totalAmount.toLocaleString("en-US")}</span>
            <span className="text-sm text-muted-foreground">ر.س</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isExpanded && manager.freelancers.length > 0 && (
        <div className="border-t border-border bg-secondary/20 p-4">
          <div className="space-y-2">
            {manager.freelancers.map((freelancer: Freelancer) => (
              <div
                key={freelancer.id}
                className="flex items-center justify-between rounded-lg bg-card/50 px-4 py-3"
                dir="rtl"
              >
                <div className="text-right">
                  <p className="font-medium text-foreground">{freelancer.name}</p>
                  <p className="text-sm text-muted-foreground">{freelancer.jobTitle}</p>
                </div>
                <div className="text-left">
                  <span className="font-medium text-foreground">{freelancer.amount.toLocaleString("en-US")}</span>
                  <span className="text-sm text-muted-foreground"> ر.س</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ManagersSection({ department }: { department: string }) {
  const { getManagersByDepartment } = useData()
  const [expandedManager, setExpandedManager] = useState<string | null>(null)
  
  const managers = getManagersByDepartment(department)
  
  if (managers.length === 0) return null
  
  return (
    <div className="rounded-2xl border border-border bg-card p-6" dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">المدراء المباشرين</h3>
        <span className="text-sm text-muted-foreground">
          {managers.length.toLocaleString("en-US")} مدير
        </span>
      </div>
      
      <div className="space-y-3">
        {managers.map((manager) => (
          <ManagerRow
            key={manager.name}
            manager={manager}
            isExpanded={expandedManager === manager.name}
            onToggle={() => setExpandedManager(expandedManager === manager.name ? null : manager.name)}
          />
        ))}
      </div>
    </div>
  )
}

export function DepartmentDetail({ department }: DepartmentDetailProps) {
  return (
    <div className="space-y-6">
      <StatsCards department={department} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingChart department={department} />
        <ProjectBreakdown department={department} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RolesDistribution department={department} />
        <TopFreelancers department={department} />
      </div>

      <ManagersSection department={department} />
    </div>
  )
}
