export type HumanResourcesDepartment = {
  DepartmentID: number
  Name: string
  GroupName: string
  ModifiedDate: string
  TotalCount?: number
}

export type HumanResourcesDepartmentInsert = {
  name: string
  groupName: string
}

export type HumanResourcesDepartmentUpdate = {
  DepartmentID: number
  Name: string
  GroupName: string
}

export type HumanResourcesDepartmentDelete = {
  DepartmentID: number
}


export type HumanResourcesEmployeeDepartmentHistory = {
  EmployeeName: string
  DepartmentName: string
  GroupName: string
  Turno: string
  StartDate: string
  EndDate: string
  ModifiedDate: string
  TotalCount?: number
}

export type HumanResourcesEmployeeDepartmentHistorySearch = {
  FirstName?: string
  DepartmentName?: string
  GroupName?: string
}
