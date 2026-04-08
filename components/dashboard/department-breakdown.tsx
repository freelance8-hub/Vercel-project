"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { Link2 } from "lucide-react"

const data = [
  { name: "التسويق", amount: 45000, color: "#f97316" },
  { name: "التقنية", amount: 68000, color: "#ea580c" },
  { name: "المحتوى", amount: 35000, color: "#c2410c" },
  { name: "التصميم", amount: 42000, color: "#3b82f6" },
  { name: "المبيعات", amount: 28000, color: "#2563eb" },
  { name: "الموارد البشرية", amount: 15500, color: "#1d4ed8" },
  { name: "المالية", amount: 12000, color: "#1e40af" },
]

export function DepartmentBreakdown() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6">
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" hide />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#a1a1a1', fontSize: 12 }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f1f1f',
                border: '1px solid #262626',
                borderRadius: '8px',
                color: '#fafafa'
              }}
              formatter={(value: number) => [`${value.toLocaleString()} ر.س`, 'الإنفاق']}
            />
            <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute bottom-6 left-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
          <Link2 className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <h3 className="text-lg font-semibold text-foreground">توزيع الإنفاق بالإدارات</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          أداء الإدارات والأقسام بالأرقام والرسوم البيانية
        </p>
      </div>
    </div>
  )
}
