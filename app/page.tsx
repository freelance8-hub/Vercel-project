"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { DataProvider, useData } from "@/lib/data-context"
import { DashboardHeader } from "@/components/dashboard/header"
import { FileUpload } from "@/components/dashboard/file-upload"
import { GlobalOverview } from "@/components/dashboard/global-overview"
import { DepartmentsOverview } from "@/components/dashboard/departments-overview"
import { DepartmentDetail } from "@/components/dashboard/department-detail"

function DashboardContent() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const { getDepartmentData } = useData()

  const deptData = selectedDepartment ? getDepartmentData(selectedDepartment) : null

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        {/* File Upload Section */}
        <div className="mb-8">
          <FileUpload />
        </div>

        {/* Back Button when viewing department */}
        {selectedDepartment && (
          <div className="mb-6">
            <button
              onClick={() => setSelectedDepartment(null)}
              className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              <ArrowRight className="h-4 w-4" />
              <span>العودة للأقسام</span>
            </button>
            <div className="mt-4 flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: deptData?.color }}
              />
              <h1 className="text-2xl font-bold text-foreground">
                {selectedDepartment}
              </h1>
            </div>
          </div>
        )}

        {/* Content */}
        {selectedDepartment ? (
          <DepartmentDetail department={selectedDepartment} />
        ) : (
          <div className="space-y-10">
            <GlobalOverview />
            <DepartmentsOverview onSelectDepartment={setSelectedDepartment} />
          </div>
        )}
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  )
}
