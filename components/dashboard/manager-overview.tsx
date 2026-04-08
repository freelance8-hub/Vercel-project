"use client"

import { Check, Circle, LogOut } from "lucide-react"
import { useData } from "@/lib/data-context"

interface ManagerOverviewProps {
  department?: string
}

export function ManagerOverview({ department }: ManagerOverviewProps) {
  const { data, getFreelancersByDepartment } = useData()

  const freelancers = department
    ? getFreelancersByDepartment(department)
    : data.freelancers

  // Group by manager
  const managerMap = new Map<string, { freelancers: number; spend: number }>()
  freelancers.forEach((f) => {
    const current = managerMap.get(f.directManager) || { freelancers: 0, spend: 0 }
    current.freelancers++
    current.spend += f.amount
    managerMap.set(f.directManager, current)
  })

  const managers = Array.from(managerMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 5)

  const totalFreelancers = freelancers.length
  const avgSpend = totalFreelancers > 0
    ? freelancers.reduce((sum, f) => sum + f.amount, 0) / totalFreelancers
    : 0

  const checklistItems = [
    { label: "مستقلين نشطين", completed: totalFreelancers > 0 },
    { label: "مراكز تكلفة محددة", completed: new Set(freelancers.map(f => f.costCenter)).size > 0 },
    { label: "مدراء مسؤولين", completed: managers.length > 0 },
    { label: "متوسط تكلفة معقول", completed: avgSpend < 10000 },
    { label: "توزيع متوازن", completed: managers.length > 2 },
    { label: "بيانات كاملة", completed: freelancers.every(f => f.name && f.department) },
  ]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
      <div className="mb-6">
        <h4 className="mb-4 text-sm font-medium text-muted-foreground">المدير المباشر</h4>
        <div className="space-y-2">
          {managers.length > 0 ? (
            managers.map((manager, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2"
              >
                <span className="text-sm text-foreground">{manager.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground" dir="ltr">
                    {manager.freelancers.toLocaleString("en-US")} مستقل
                  </span>
                  <span className="text-sm font-medium text-foreground" dir="ltr">
                    ر.س {manager.spend.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-20 items-center justify-center text-muted-foreground">
              لا توجد بيانات
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">ملخص الكفاءة</h4>
        <div className="space-y-2">
          {checklistItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {item.completed ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                  <Check className="h-3 w-3 text-background" />
                </div>
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span
                className={`text-sm ${
                  item.completed ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <LogOut className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <h3 className="text-lg font-semibold text-foreground">
          {department ? `تقارير المديرين - ${department}` : "تقارير المديرين"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          إدارة إجراءات المستقلين والتحقق من الاستحقاقات
        </p>
      </div>
    </div>
  )
}
