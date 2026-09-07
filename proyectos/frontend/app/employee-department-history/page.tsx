'use client'

import { SubmitEvent, useEffect, useState } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'
import { getEmployeeDepartmentHistory, searchEmployeeDepartmentHistory } from '@/app/api/employeeDepartmentHistory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { HumanResourcesEmployeeDepartmentHistory } from '@/lib/types'

const PAGE_SIZE = 10
const MAX_VISIBLE_PAGES = 5

function formatDate(date: string | null) {
  if (!date) return 'Actualidad'
  return new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

export default function EmployeeDepartmentHistoryPage() {
  const [history, setHistory] = useState<HumanResourcesEmployeeDepartmentHistory[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [firstName, setFirstName] = useState('')
  const [departmentName, setDepartmentName] = useState('')
  const [groupName, setGroupName] = useState('')
  const [filters, setFilters] = useState({ firstName: '', departmentName: '', groupName: '' })
  const firstVisiblePage = Math.max(1, Math.min(page - Math.floor(MAX_VISIBLE_PAGES / 2), totalPages - MAX_VISIBLE_PAGES + 1))
  const visiblePages = Array.from(
    { length: Math.min(MAX_VISIBLE_PAGES, totalPages) },
    (_, index) => firstVisiblePage + index,
  )

  useEffect(() => {
    let cancelled = false

    async function loadHistory() {
      setLoading(true)
      setError('')
      try {
        const hasFilters = filters.firstName || filters.departmentName || filters.groupName
        const result = hasFilters
          ? await searchEmployeeDepartmentHistory({
            FirstName: filters.firstName || undefined,
            DepartmentName: filters.departmentName || undefined,
            GroupName: filters.groupName || undefined,
          }, page, PAGE_SIZE)
          : await getEmployeeDepartmentHistory(page, PAGE_SIZE)

        if (cancelled) return
        setHistory(result)
        setTotalPages(Math.max(1, Math.ceil((result[0]?.TotalCount ?? result.length) / PAGE_SIZE)))
      } catch (requestError) {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el historial.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadHistory()
    return () => { cancelled = true }
  }, [page, filters])

  function goToPage(value: string) {
    const requestedPage = Number(value)
    const nextPage = Number.isInteger(requestedPage)
      ? Math.min(Math.max(requestedPage, 1), totalPages)
      : page

    setPage(nextPage)
  }

  function applyFilters(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setFilters({ firstName: firstName.trim(), departmentName: departmentName.trim(), groupName: groupName.trim() })
    setPage(1)
  }

  function clearFilters() {
    setFirstName('')
    setDepartmentName('')
    setGroupName('')
    setFilters({ firstName: '', departmentName: '', groupName: '' })
    setPage(1)
  }

  return (
    <main className="flex-1 bg-muted/30 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Historial de empleados por departamento</h1>
          <p className="mt-1 text-sm text-muted-foreground">Consulta los movimientos de cada empleado entre departamentos.</p>
        </header>

        <form onSubmit={applyFilters} className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
          <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Filtrar por nombre" aria-label="Nombre del empleado" />
          <Input value={departmentName} onChange={(event) => setDepartmentName(event.target.value)} placeholder="Filtrar por departamento" aria-label="Nombre del departamento" />
          <Input value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="Filtrar por grupo" aria-label="Nombre del grupo" />
          <Button type="submit"><SearchIcon />Buscar</Button>
          <Button type="button" variant="outline" onClick={clearFilters}><XIcon />Limpiar</Button>
        </form>

        <section className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Modificado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">Cargando historial...</TableCell></TableRow>}
              {!loading && error && <TableRow><TableCell colSpan={7} className="py-10 text-center text-destructive">{error}</TableCell></TableRow>}
              {!loading && !error && history.length === 0 && <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No hay registros para mostrar.</TableCell></TableRow>}
              {!loading && !error && history.map((record, index) => (
                <TableRow key={`${record.EmployeeName}-${record.StartDate}-${index}`}>
                  <TableCell className="font-medium">{record.EmployeeName}</TableCell>
                  <TableCell>{record.DepartmentName}</TableCell>
                  <TableCell>{record.GroupName}</TableCell>
                  <TableCell>{record.Turno}</TableCell>
                  <TableCell>{formatDate(record.StartDate)}</TableCell>
                  <TableCell>{formatDate(record.EndDate)}</TableCell>
                  <TableCell>{formatDate(record.ModifiedDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" onClick={(event) => { event.preventDefault(); if (page > 1) setPage(page - 1) }} className={page === 1 ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
                {visiblePages.map((pageNumber) => (
                  <PaginationItem key={pageNumber}><PaginationLink href="#" isActive={pageNumber === page} onClick={(event) => { event.preventDefault(); setPage(pageNumber) }}>{pageNumber}</PaginationLink></PaginationItem>
                ))}
                <PaginationItem><PaginationNext href="#" onClick={(event) => { event.preventDefault(); if (page < totalPages) setPage(page + 1) }} className={page === totalPages ? 'pointer-events-none opacity-50' : ''} /></PaginationItem>
              </PaginationContent>
            </Pagination>
            <Input
              type="number"
              key={page}
              min={1}
              max={totalPages}
              defaultValue={page}
              onBlur={(event) => goToPage(event.currentTarget.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); goToPage(event.currentTarget.value) } }}
              className="w-20"
              aria-label="Ir a la página"
            />
          </div>
        </section>
      </div>
    </main>
  )
}
