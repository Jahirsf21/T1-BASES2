import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import {
  addDepartmentRegister,
  deleteDepartmentRegister,
  getDepartments,
  getEmployeeDepartmentHistory,
  getEmployeeDepartmentHistoryFiltered,
  getSelectDepartmentRegister,
  updateDepartmentRegister,
} from './db.js'

const app = express()
app.use(cors({origin:`http://localhost:${env.APP_PORT}`}), express.json())

app.get('/api/departments', async (req, res, next) => {
  try {
    const departments = await getDepartments(Number(req.query.pageNumber), Number(req.query.pageSize))
    res.json(departments)
  } catch (error) {
    next(error)
  }
})

app.get('/api/departments/search', async (req, res, next) => {
  try {
    const { name, groupName } = req.query
    const departments = await getSelectDepartmentRegister(name, groupName, Number(req.query.pageNumber), Number(req.query.pageSize))
    res.json(departments)
  } catch (error) {
    next(error)
  }
})

app.post('/api/departments', async (req, res, next) => {
  try {
    const { name, groupName } = req.body
    const result = await addDepartmentRegister(name, groupName)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

app.put('/api/departments/:departmentID', async (req, res, next) => {
  try {
    const { name, groupName } = req.body
    const result = await updateDepartmentRegister(Number(req.params.departmentID), name, groupName)
    res.json(result)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/departments/:departmentID', async (req, res, next) => {
  try {
    const result = await deleteDepartmentRegister(Number(req.params.departmentID))
    res.json(result)
  } catch (error) {
    next(error)
  }
})

app.get('/api/employee-department-history', async (req, res, next) => {
  try {
    const history = await getEmployeeDepartmentHistory(Number(req.query.pageNumber), Number(req.query.pageSize))
    res.json(history)
  } catch (error) {
    next(error)
  }
})

app.get('/api/employee-department-history/search', async (req, res, next) => {
  try {
    const { firstName, departmentName, groupName } = req.query
    const history = await getEmployeeDepartmentHistoryFiltered(
      firstName, departmentName, groupName,
      Number(req.query.pageNumber), Number(req.query.pageSize)
    )
    res.json(history)
  } catch (error) {
    next(error)
  }
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).json({ message: 'Error interno del servidor.' })
})

app.listen(env.API_PORT, () => {
  console.log(`app listening at http://localhost:${env.API_PORT}`)
})
