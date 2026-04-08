"use client"

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { useData } from "@/lib/data-context"
import { useMemo } from "react"

interface SpendingChartProps {
  department?: string
}

export function SpendingChart({ department }: SpendingChartProps) {
  const { data, getFreelancersByDepartment, getDepartmentData } = useData()

  const freelancers = department
    ? getFreelancersByDepartment(department)
    : data.freelancers

  const deptData = department ? getDepartmentData(department) : null
  const chartColor = deptData?.color || "#f97316"

  // Group spending by month (using dueDate)
  const chartData = useMemo(() => {
    const monthMap = new Map<string, number>()
    const months = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ]

    freelancers.forEach((f) => {
      if (f.dueDate) {
        const date = new Date(f.dueDate)
        const monthIndex = date.getMonth()
        const monthName = months[monthIndex]
        monthMap.set(monthName, (monthMap.get(monthName) || 0) + f.amount)
      }
    })

    // Return data for months that have data
    return months
      .filter((month) => monthMap.has(month))
      .map((month) => ({
        month,
        amount: monthMap.get(month) || 0,
      }))
  }, [freelancers])

  const totalAmount = freelancers.reduce((sum, f) => sum + f.amount, 0)
  
  // Calculate real growth from monthly data
  const growth = useMemo(() => {
    if (chartData.length < 2) return 0
    const lastMonth = chartData[chartData.length - 1]?.amount || 0
    const prevMonth = chartData[chartData.length - 2]?.amount || 0
    if (prevMonth === 0) return 0
    return Math.round(((lastMonth - prevMonth) / prevMonth) * 100)
  }, [chartData])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6" dir="rtl">
      <div className="mb-6 flex items-start justify-start">
        <div className="flex gap-4">
          <div className="rounded-lg bg-secondary px-3 py-1.5 text-right">
            <span className="text-xs text-muted-foreground">إجمالي</span>
            <p className="text-lg font-bold text-emerald-500" dir="ltr">
              {totalAmount.toLocaleString("en-US")}
            </p>
          </div>
          <div className="rounded-lg bg-secondary px-3 py-1.5 text-right">
            <span className="text-xs text-muted-foreground">النمو</span>
            <p className={`text-lg font-bold ${growth >= 0 ? "text-emerald-500" : "text-red-500"}`} dir="ltr">
              {growth >= 0 ? "+" : ""}{growth}%
            </p>
          </div>
          <div className="rounded-lg bg-secondary px-3 py-1.5 text-right">
            <span className="text-xs text-muted-foreground">المستقلين</span>
            <p className="text-lg font-bold text-foreground" dir="ltr">{freelancers.length.toLocaleString("en-US")}</p>
          </div>
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`colorAmount-${department || "all"}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1a1", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--foreground)",
              }}
              formatter={(value: number) => [`ر.س ${value.toLocaleString("en-US")}`, "المبلغ"]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={chartColor}
              strokeWidth={2}
              fill={`url(#colorAmount-${department || "all"})`}
              dot={{ fill: chartColor, strokeWidth: 0, r: 4 }}
              activeDot={{ fill: chartColor, strokeWidth: 2, stroke: "#fff", r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <h3 className="text-lg font-semibold text-foreground">
          {department ? `التقارير المالية - ${department}` : "التقارير المالية"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          تحليلات مالية وأداء تفصيلية لكل فترة زمنية
        </p>
      </div>
    </div>
  )
}
