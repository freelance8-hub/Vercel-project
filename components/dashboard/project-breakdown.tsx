"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useData } from "@/lib/data-context"

const colors = ["#f97316", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ec4899", "#06b6d4"]

interface ProjectBreakdownProps {
  department?: string
}

export function ProjectBreakdown({ department }: ProjectBreakdownProps) {
  const { data, getFreelancersByDepartment } = useData()

  const freelancers = department
    ? getFreelancersByDepartment(department)
    : data.freelancers

  // Group by cost center
  const costCenterMap = new Map<string, number>()
  freelancers.forEach((f) => {
    costCenterMap.set(f.costCenter, (costCenterMap.get(f.costCenter) || 0) + f.amount)
  })

  const chartData = Array.from(costCenterMap.entries())
    .map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const total = chartData.reduce((acc, item) => acc + item.value, 0)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6" dir="rtl">
      <div className="flex items-center gap-6">
        <div className="flex-1 space-y-3">
          {chartData.length > 0 ? (
            chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {total > 0 ? Math.round((item.value / total) * 100).toLocaleString("en-US") : 0}%
                </span>
              </div>
            ))
          ) : (
            <div className="flex h-20 items-center justify-center text-muted-foreground">
              لا توجد بيانات
            </div>
          )}
        </div>

        <div className="h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
                formatter={(value: number) => [`ر.س ${value.toLocaleString("en-US")}`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <h3 className="text-lg font-semibold text-foreground">توزيع مراكز التكلفة</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {department
            ? `المشاريع في ${department}`
            : "الإنفاق حسب المشاريع ومراكز التكلفة"}
        </p>
      </div>
    </div>
  )
}
