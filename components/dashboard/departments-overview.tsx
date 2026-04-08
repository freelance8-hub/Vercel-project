"use client"

import { useData } from "@/lib/data-context"
import { DepartmentCard } from "./department-card"

interface DepartmentsOverviewProps {
  onSelectDepartment: (department: string) => void
}

export function DepartmentsOverview({ onSelectDepartment }: DepartmentsOverviewProps) {
  const { data } = useData()
  
  const departments = data?.departments ?? []

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">جميع الأقسام</h2>
        <span className="text-sm text-muted-foreground">
          {departments.length.toLocaleString("en-US")} أقسام
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((department) => (
          <DepartmentCard
            key={department.name}
            department={department}
            onClick={() => onSelectDepartment(department.name)}
          />
        ))}
      </div>
    </div>
  )
}
