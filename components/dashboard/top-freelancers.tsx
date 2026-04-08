"use client"

import { useData } from "@/lib/data-context"

const avatarColors = ["#22c55e", "#f97316", "#3b82f6", "#a855f7", "#ec4899", "#eab308", "#06b6d4"]

interface TopFreelancersProps {
  department?: string
}

export function TopFreelancers({ department }: TopFreelancersProps) {
  const { data, getFreelancersByDepartment } = useData()

  const freelancers = department
    ? getFreelancersByDepartment(department)
    : data.freelancers

  const topFreelancers = [...freelancers]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
    .map((f, i) => ({
      name: f.name,
      role: f.jobTitle,
      amount: f.amount,
      status: "نشط",
      statusColor: "#22c55e",
      avatar: f.name.charAt(0),
      avatarColor: avatarColors[i % avatarColors.length],
    }))

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6" dir="rtl">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {department ? `أعلى المستقلين تكلفة` : "إدارة المستقلين"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {department
            ? `أعلى 5 مستقلين في ${department}`
            : "عقود المستقلين وجدول مدفوعاتهم في مكان واحد"}
        </p>
      </div>

      <div className="space-y-3">
        {topFreelancers.length > 0 ? (
          topFreelancers.map((freelancer, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl bg-secondary/50 p-3 transition-colors hover:bg-secondary"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-background"
                  style={{ backgroundColor: freelancer.avatarColor }}
                >
                  {freelancer.avatar}
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{freelancer.name}</p>
                  <p className="text-sm text-muted-foreground">{freelancer.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className="rounded-full px-2 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${freelancer.statusColor}15`,
                    color: freelancer.statusColor,
                  }}
                >
                  {freelancer.status}
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">
                    {freelancer.amount.toLocaleString("en-US")} <span className="text-sm text-muted-foreground">ر.س</span>
                  </p>
                  <p className="text-xs text-muted-foreground">المبلغ المستحق</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            لا توجد بيانات
          </div>
        )}
      </div>
    </div>
  )
}
