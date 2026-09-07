import type {
  HumanResourcesDepartment,
  HumanResourcesDepartmentInsert,
  HumanResourcesDepartmentUpdate,
} from '@/lib/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getDepartments(pageNumber: number, pageSize: number): Promise<HumanResourcesDepartment[]> {
  const res = await fetch(`${API_URL}/api/departments?pageNumber=${pageNumber}&pageSize=${pageSize}`)
  if (!res.ok) throw new Error('Error al obtener deparmentos')
  return res.json()
}

export async function searchDepartments(name: string | undefined, groupName: string | undefined, pageNumber: number, pageSize: number): Promise<HumanResourcesDepartment[]> {
  const params = new URLSearchParams()
  if(name) params.set('name', name)
  if(groupName) params.set('groupName', groupName)
  params.set('pageNumber', String(pageNumber))
  params.set('pageSize', String(pageSize))
  const res = await fetch(`${API_URL}/api/departments/search?${params}`)
  if (!res.ok) throw new Error('Error al buscar deparmentos')
  return res.json()
}

export async function addDepartment(data: HumanResourcesDepartmentInsert):  Promise<{ NewDeparmentID: number }> {
  const res = await fetch(`${API_URL}/api/departments`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al crear deparmento')
  return res.json()
}

export async function updateDepartment(data: HumanResourcesDepartmentUpdate): Promise<{ Message: string }> {
  const res = await fetch(`${API_URL}/api/departments/${data.DepartmentID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({name:data.Name, groupName: data.GroupName})
  })
  if (!res.ok) throw new Error('Error al actualizar departamento')
  return res.json()
}

export async function deleteDeparment(departmentID: number): Promise<{ Message: string }> {
  const res = await fetch(`${API_URL}/api/departments/${departmentID}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Error al eliminar departamento')
  return res.json()
}