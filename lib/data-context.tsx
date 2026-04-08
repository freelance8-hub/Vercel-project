"use client"

// Freelancer data context provider for Arabic RTL dashboard
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Freelancer, FreelancerData, DepartmentSummary, ManagerSummary } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

const departmentColors: Record<string, string> = {
  "التصميم": "#a855f7",
  "التقنية": "#3b82f6",
  "التسويق": "#f97316",
  "الإنتاج": "#22c55e",
  "الثقافة": "#06b6d4",
  "الأعمال": "#eab308",
  "البث": "#ec4899",
  "المالية": "#14b8a6",
}

function getDepartmentColor(name: string): string {
  return departmentColors[name] || "#6b7280"
}

const managerColors = [
  "#f97316", "#a855f7", "#06b6d4", "#22c55e", "#ec4899",
  "#eab308", "#3b82f6", "#14b8a6", "#f43f5e", "#8b5cf6"
]

function getManagerColor(index: number): string {
  return managerColors[index % managerColors.length]
}

const sampleFreelancers: Freelancer[] = [
  { id: "1", name: "أحمد محمد", jobTitle: "مصمم جرافيك", directManager: "سارة أحمد", costCenter: "مشروع التطبيق", department: "التصميم", amount: 5500 },
  { id: "2", name: "فاطمة علي", jobTitle: "مطور ويب", directManager: "خالد العمري", costCenter: "مشروع الموقع", department: "التقنية", amount: 8000 },
  { id: "3", name: "محمد سعيد", jobTitle: "كاتب محتوى", directManager: "نورة السالم", costCenter: "حملة رمضان", department: "التسويق", amount: 4500 },
  { id: "4", name: "سارة خالد", jobTitle: "مصور فيديو", directManager: "أحمد الراشد", costCenter: "مشروع الوثائقي", department: "الإنتاج", amount: 12000 },
  { id: "5", name: "عبدالله ناصر", jobTitle: "مطور تطبيقات", directManager: "خالد العمري", costCenter: "مشروع التطبيق", department: "التقنية", amount: 9500 },
  { id: "6", name: "ريم أحمد", jobTitle: "مصمم UI/UX", directManager: "سارة أحمد", costCenter: "مشروع الموقع", department: "التصميم", amount: 7000 },
  { id: "7", name: "خالد محمود", jobTitle: "مدير حملات", directManager: "نورة السالم", costCenter: "حملة رمضان", department: "التسويق", amount: 6500 },
  { id: "8", name: "نوف سالم", jobTitle: "منتج صوتي", directManager: "أحمد الراشد", costCenter: "البودكاست", department: "الإنتاج", amount: 5000 },
]

// Group freelancers with same name and role, summing their amounts
function groupFreelancers(freelancers: Freelancer[]): Freelancer[] {
  const grouped = new Map<string, Freelancer>()
  
  freelancers.forEach((f) => {
    // Create a unique key based on name and role
    const key = `${f.name}|${f.jobTitle}`
    
    if (grouped.has(key)) {
      const existing = grouped.get(key)!
      // Sum the amounts
      existing.amount += f.amount
      // Keep other fields from first occurrence (or could merge costCenters etc.)
    } else {
      // Clone the freelancer to avoid mutating original
      grouped.set(key, { ...f })
    }
  })
  
  // Re-assign IDs after grouping
  return Array.from(grouped.values()).map((f, idx) => ({
    ...f,
    id: String(idx),
  }))
}

function processFreelancerData(freelancers: Freelancer[]): FreelancerData {
  // First, group duplicates by name and role
  const groupedFreelancers = groupFreelancers(freelancers)
  
  const departmentMap = new Map<string, { count: number; total: number }>()
  const managerMap = new Map<string, { count: number; total: number; department: string; freelancers: Freelancer[] }>()
  let totalSpending = 0

  groupedFreelancers.forEach((f) => {
    totalSpending += f.amount
    
    const dept = departmentMap.get(f.department) || { count: 0, total: 0 }
    dept.count++
    dept.total += f.amount
    departmentMap.set(f.department, dept)
    
    const manager = managerMap.get(f.directManager) || { count: 0, total: 0, department: f.department, freelancers: [] }
    manager.count++
    manager.total += f.amount
    manager.freelancers.push(f)
    managerMap.set(f.directManager, manager)
  })

  const departments: DepartmentSummary[] = Array.from(departmentMap.entries()).map(
    ([name, data]) => ({
      name,
      freelancerCount: data.count,
      totalAmount: data.total,
      percentage: totalSpending > 0 ? (data.total / totalSpending) * 100 : 0,
      color: getDepartmentColor(name),
    })
  )

  const managers: ManagerSummary[] = Array.from(managerMap.entries()).map(
    ([name, data], index) => ({
      name,
      freelancerCount: data.count,
      totalAmount: data.total,
      percentage: totalSpending > 0 ? (data.total / totalSpending) * 100 : 0,
      color: getManagerColor(index),
      department: data.department,
      freelancers: data.freelancers,
    })
  )

  return {
    freelancers: groupedFreelancers,
    departments: departments.sort((a, b) => b.totalAmount - a.totalAmount),
    managers: managers.sort((a, b) => b.totalAmount - a.totalAmount),
    totalSpending,
    totalFreelancers: groupedFreelancers.length,
  }
}

interface DataContextType {
  data: FreelancerData
  isLoaded: boolean
  uploadData: (freelancers: Freelancer[]) => Promise<string | null>
  loadDataset: (datasetId: string) => Promise<void>
  getFreelancersByDepartment: (department: string) => Freelancer[]
  getDepartmentData: (department: string) => DepartmentSummary | undefined
  getManagersByDepartment: (department: string) => ManagerSummary[]
  currentDatasetId: string | null
}

const initialData = processFreelancerData(sampleFreelancers)

const DataContext = createContext<DataContextType>({
  data: initialData,
  isLoaded: false,
  uploadData: async () => null,
  loadDataset: async () => {},
  getFreelancersByDepartment: () => [],
  getDepartmentData: () => undefined,
  getManagersByDepartment: () => [],
  currentDatasetId: null,
})

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<FreelancerData>(initialData)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentDatasetId, setCurrentDatasetId] = useState<string | null>(null)
  const supabase = createClient()

  const uploadData = useCallback(async (freelancers: Freelancer[]) => {
    try {
      const processed = processFreelancerData(freelancers)
      setData(processed)
      setIsLoaded(true)

      // Save to Supabase
      const datasetName = "Freelancer Data " + Date.now().toString()
      const { data: dataset, error: datasetError } = await supabase
        .from("datasets")
        .insert({ name: datasetName })
        .select()
        .single()

      if (datasetError || !dataset) {
        console.error("Error creating dataset:", datasetError)
        return null
      }

      // Save freelancers
      const freelancersToInsert = freelancers.map((f) => ({
        dataset_id: dataset.id,
        name: f.name,
        role: f.jobTitle,
        approver: f.directManager,
        cost_center: f.costCenter,
        department: f.department,
        amount: f.amount,
      }))

      const { error: freelancersError } = await supabase
        .from("freelancers")
        .insert(freelancersToInsert)

      if (freelancersError) {
        console.error("Error saving freelancers:", freelancersError)
        return null
      }

      setCurrentDatasetId(dataset.id)
      return dataset.id
    } catch (error) {
      console.error("Error uploading data:", error)
      return null
    }
  }, [supabase])

  const loadDataset = useCallback(async (datasetId: string) => {
    try {
      const { data: freelancersData, error } = await supabase
        .from("freelancers")
        .select("*")
        .eq("dataset_id", datasetId)

      if (error || !freelancersData) {
        console.error("Error loading dataset:", error)
        return
      }

      const freelancers: Freelancer[] = freelancersData.map((f, idx) => ({
        id: String(idx),
        name: f.name,
        jobTitle: f.role || "",
        directManager: f.approver || "",
        costCenter: f.cost_center || "",
        department: f.department,
        amount: f.amount,
      }))

      const processed = processFreelancerData(freelancers)
      setData(processed)
      setIsLoaded(true)
      setCurrentDatasetId(datasetId)
    } catch (error) {
      console.error("Error loading dataset:", error)
    }
  }, [supabase])

  const getFreelancersByDepartment = useCallback(
    (department: string) => data.freelancers.filter((f) => f.department === department),
    [data.freelancers]
  )

  const getDepartmentData = useCallback(
    (department: string) => data.departments.find((d) => d.name === department),
    [data.departments]
  )

  const getManagersByDepartment = useCallback(
    (department: string) => data.managers.filter((m) => m.department === department),
    [data.managers]
  )

  return (
    <DataContext.Provider
      value={{ 
        data, 
        isLoaded, 
        uploadData, 
        loadDataset,
        getFreelancersByDepartment, 
        getDepartmentData, 
        getManagersByDepartment,
        currentDatasetId,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData(): DataContextType {
  return useContext(DataContext)
}
