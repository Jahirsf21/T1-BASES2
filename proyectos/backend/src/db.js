import { getPool } from "./config/config.js"
import sql from "mssql"

export async function getDepartments(pageNumber, pageSize) {
  const connection = (await getPool()).request()
  connection.input('PageNumber', sql.Int, pageNumber);
  connection.input('PageSize', sql.Int, pageSize);
  const result = await connection.execute('HumanResources.GetDepartments')
  return result.recordset
}

export async function getSelectDepartmentRegister(name, groupName, pageNumber, pageSize) {
  const connection = (await getPool()).request()
  connection.input('Name',sql.NVarChar(50), name || null)
  connection.input('GroupName', sql.NVarChar(50), groupName || null)
  connection.input('PageNumber', sql.Int, pageNumber);
  connection.input('PageSize', sql.Int, pageSize);
  const result = await connection.execute('HumanResources.SelectDepartmentRegister')
  return result.recordset
}

export async function addDepartmentRegister(name, groupName) {
  const connection = (await getPool()).request()
  connection.input('Name',sql.NVarChar(50), name)
  connection.input('GroupName', sql.NVarChar(50), groupName)
  const result = await connection.execute('HumanResources.AddDepartmentRegister')
  return result.recordset
}

export async function updateDepartmentRegister(departmentID, name, groupName) {
  const connection = (await getPool()).request()
  connection.input('DepartmentID', sql.SmallInt, departmentID)
  connection.input('Name', sql.NVarChar, name)
  connection.input('GroupName', sql.NVarChar, groupName)
  const result = await connection.execute('HumanResources.UpdateDepartmentRegister')
  return result.recordset
}

export async function deleteDepartmentRegister(departmentID) {
  const connection = (await getPool()).request()
  connection.input('DepartmentID', sql.SmallInt, departmentID)
  const result = await connection.execute('HumanResources.DeleteDepartmentRegister')
  return result.recordset
}

export async function getEmployeeDepartmentHistory(pageNumber, pageSize) {
  const connection = (await getPool()).request()
  connection.input('PageNumber', sql.Int, pageNumber);
  connection.input('PageSize', sql.Int, pageSize);
  const result = await connection.execute('HumanResources.GetEmployeeDepartmentHistory')
  return result.recordset
}

export async function getEmployeeDepartmentHistoryFiltered(firstName, departmentName, groupName, pageNumber, pageSize) {
  const connection = (await getPool()).request()
  connection.input('FirstName', sql.NVarChar, firstName || null)
  connection.input('DepartmentName', sql.NVarChar, departmentName || null)
  connection.input('GroupName', sql.NVarChar, groupName || null)
  connection.input('PageNumber', sql.Int, pageNumber);
  connection.input('PageSize', sql.Int, pageSize);
  const result = await connection.execute('HumanResources.GetEmployeeDepartmentHistoryFiltered')
  return result.recordset
}
