// Freelancer dashboard types for Arabic RTL dashboard
export interface Freelancer {
  id: string
  name: string
  jobTitle: string
  directManager: string
  costCenter: string
  department: string
  amount: number
}

export interface DepartmentSummary {
  name: string
  freelancerCount: number
  totalAmount: number
  percentage: number
  color: string
}

export interface ManagerSummary {
  name: string
  freelancerCount: number
  totalAmount: number
  percentage: number
  color: string
  department: string
  freelancers: Freelancer[]
}

export interface FreelancerData {
  freelancers: Freelancer[]
  departments: DepartmentSummary[]
  managers: ManagerSummary[]
  totalSpending: number
  totalFreelancers: number
}
