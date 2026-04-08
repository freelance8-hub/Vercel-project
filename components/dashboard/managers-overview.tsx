"use client"

import { useData } from "@/lib/data-context"
import { ManagerCard } from "@/components/dashboard/manager-card"

export function ManagersOverview() {
  const { data } = useData()
  
  const managers = data.managers || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">المدراء المباشرين</h2>
        <span className="text-sm text-muted-foreground">
          {managers.length.toLocaleString("en-US")} مدير
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {managers.map((manager) => (
          <ManagerCard key={manager.name} manager={manager} />
        ))}
      </div>
    </div>
  )
}
