import type {
  HumanResourcesEmployeeDepartmentHistory,
  HumanResourcesEmployeeDepartmentHistorySearch,
} from '@/lib/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getEmployeeDepartmentHistory(pageNumber: number, pageSize: number): Promise<HumanResourcesEmployeeDepartmentHistory[]> {
  const res = await fetch(`${API_URL}/api/employee-department-history?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  if (!res.ok) throw new Error('Error al obtener historial')
  return res.json()
}

export async function searchEmployeeDepartmentHistory(filters: HumanResourcesEmployeeDepartmentHistorySearch, pageNumber: number, pageSize: number): Promise<HumanResourcesEmployeeDepartmentHistory[]> {
  const params = new URLSearchParams()
  if (filters.FirstName) params.set('firstName', filters.FirstName)
  if (filters.DepartmentName) params.set('departmentName', filters.DepartmentName)
  if (filters.GroupName) params.set('groupName', filters.GroupName)
  params.set('pageNumber', String(pageNumber))
  params.set('pageSize', String(pageSize))
  const res = await fetch(`${API_URL}/api/employee-department-history/search?${params}`)
  if (!res.ok) throw new Error('Error al buscar en el historial')
  return res.json()
}
