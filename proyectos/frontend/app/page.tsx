'use client'

import { SubmitEvent, useEffect, useState } from 'react'
import { PencilIcon, PlusIcon, SearchIcon, Trash2Icon, XIcon } from 'lucide-react'
import { addDepartment, deleteDeparment, getDepartments, searchDepartments, updateDepartment } from '@/app/api/departments'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { HumanResourcesDepartment } from '@/lib/types'

const PAGE_SIZE = 10
const MAX_VISIBLE_PAGES = 5

type Action = 'create' | 'update' | 'delete' | null

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
}

export default function Home() {
  const [departments, setDepartments] = useState<HumanResourcesDepartment[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<HumanResourcesDepartment | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [nameFilter, setNameFilter] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [filters, setFilters] = useState({ name: '', groupName: '' })
  const [action, setAction] = useState<Action>(null)
  const [formName, setFormName] = useState('')
  const [formGroup, setFormGroup] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const firstVisiblePage = Math.max(1, Math.min(page - Math.floor(MAX_VISIBLE_PAGES / 2), totalPages - MAX_VISIBLE_PAGES + 1))
  const visiblePages = Array.from(
    { length: Math.min(MAX_VISIBLE_PAGES, totalPages) },
    (_, index) => firstVisiblePage + index,
  )

  useEffect(() => {
    let cancelled = false

    async function loadDepartments() {
      setLoading(true)
      const result = filters.name || filters.groupName
        ? await searchDepartments(filters.name || undefined, filters.groupName || undefined, page, PAGE_SIZE)
        : await getDepartments(page, PAGE_SIZE)

      if (cancelled) return

      setDepartments(result)
      setTotalPages(Math.max(1, Math.ceil((result[0]?.TotalCount ?? result.length) / PAGE_SIZE)))
      setSelectedDepartment(null)
      setLoading(false)
    }

    loadDepartments()
    return () => { cancelled = true }
  }, [page, filters, refreshKey])

  function goToPage(value: string) {
    const requestedPage = Number(value)
    const nextPage = Number.isInteger(requestedPage)
      ? Math.min(Math.max(requestedPage, 1), totalPages)
      : page

    setPage(nextPage)
  }

  function applyFilters(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setFilters({ name: nameFilter, groupName: groupFilter })
    setPage(1)
  }

  function clearFilters() {
    setNameFilter('')
    setGroupFilter('')
    setFilters({ name: '', groupName: '' })
    setPage(1)
  }

  function openAction(nextAction: Action) {
    setAction(nextAction)
    if (nextAction === 'update' && selectedDepartment) {
      setFormName(selectedDepartment.Name)
      setFormGroup(selectedDepartment.GroupName)
    } else if (nextAction === 'create') {
      setFormName('')
      setFormGroup('')
    }
  }

  async function submitDepartment(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (action === 'create') {
      await addDepartment({ name: formName, groupName: formGroup })
    }
    if (action === 'update' && selectedDepartment) {
      await updateDepartment({
        DepartmentID: selectedDepartment.DepartmentID,
        Name: formName,
        GroupName: formGroup,
      })
    }
    setAction(null)
    setRefreshKey((key) => key + 1)
  }

  async function confirmDelete() {
    if (!selectedDepartment) return

    await deleteDeparment(selectedDepartment.DepartmentID)
    setSelectedDepartment(null)
    setAction(null)
    setRefreshKey((key) => key + 1)
  }

  return (
    <main className="flex-1 bg-muted/30 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Departamentos</h1>
        </header>

        <form onSubmit={applyFilters} className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-[1fr_1fr_auto_auto]">
          <Input value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} placeholder="Filtrar por departamento" aria-label="Nombre de departamento" />
          <Input value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)} placeholder="Filtrar por grupo" aria-label="Nombre de grupo" />
          <Button type="submit"><SearchIcon />Buscar</Button>
          <Button type="button" variant="outline" onClick={clearFilters}><XIcon />Limpiar</Button>
        </form>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section className="overflow-hidden rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"><span className="sr-only">Seleccionar</span></TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre Departamento</TableHead>
                  <TableHead>Nombre Grupo</TableHead>
                  <TableHead>Fecha Modificación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">Cargando departamentos...</TableCell></TableRow>}
                {!loading && departments.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No hay departamentos para mostrar.</TableCell></TableRow>}
                {!loading && departments.map((department) => (
                  <TableRow
                    key={department.DepartmentID}
                    data-state={selectedDepartment?.DepartmentID === department.DepartmentID ? 'selected' : undefined}
                    className="cursor-pointer"
                    onClick={() => setSelectedDepartment(department)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedDepartment?.DepartmentID === department.DepartmentID}
                        onClick={(event) => event.stopPropagation()}
                        onCheckedChange={(checked) => setSelectedDepartment(checked ? department : null)}
                        aria-label={`Seleccionar ${department.Name}`}
                      />
                    </TableCell>
                    <TableCell>{department.DepartmentID}</TableCell>
                    <TableCell className="font-medium">{department.Name}</TableCell>
                    <TableCell>{department.GroupName}</TableCell>
                    <TableCell>{formatDate(department.ModifiedDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-muted-foreground">Página {page} de {totalPages}</span>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => { event.preventDefault(); if (page > 1) setPage(page - 1) }}
                      className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {visiblePages.map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === page}
                        onClick={(event) => { event.preventDefault(); setPage(pageNumber) }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => { event.preventDefault(); if (page < totalPages) setPage(page + 1) }}
                      className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
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

          <aside className="rounded-xl border bg-card p-4">
            <h2 className="font-semibold">Acciones</h2>
            <p className="mt-1 text-sm text-muted-foreground">{selectedDepartment ? `Seleccionado: ${selectedDepartment.Name}` : 'Selecciona una fila para actualizar o eliminar.'}</p>

            {!action && <div className="mt-4 grid gap-2">
              <Button onClick={() => openAction('create')}><PlusIcon />Agregar departamento</Button>
              <Button variant="outline" disabled={!selectedDepartment} onClick={() => openAction('update')}><PencilIcon />Actualizar departamento</Button>
              <Button variant="destructive" disabled={!selectedDepartment} onClick={() => openAction('delete')}><Trash2Icon />Eliminar departamento</Button>
            </div>}

            {(action === 'create' || action === 'update') && <form onSubmit={submitDepartment} className="mt-5 space-y-4">
              <h3 className="font-medium">{action === 'create' ? 'Agregar departamento' : 'Actualizar departamento'}</h3>
              <div className="space-y-2"><Label htmlFor="department-name">Nombre</Label><Input id="department-name" value={formName} onChange={(event) => setFormName(event.target.value)} required maxLength={50} /></div>
              <div className="space-y-2"><Label htmlFor="group-name">Grupo</Label><Input id="group-name" value={formGroup} onChange={(event) => setFormGroup(event.target.value)} required maxLength={50} /></div>
              <div className="flex gap-2"><Button type="submit">Guardar</Button><Button type="button" variant="outline" onClick={() => setAction(null)}>Cancelar</Button></div>
            </form>}

            {action === 'delete' && selectedDepartment && <div className="mt-5 space-y-4">
              <h3 className="font-medium">Eliminar departamento</h3>
              <p className="text-sm text-muted-foreground">Eliminarás <span className="font-medium text-foreground">{selectedDepartment.Name}</span>. Esta acción no se puede deshacer.</p>
              <div className="flex gap-2"><Button variant="destructive" onClick={confirmDelete}>Eliminar</Button><Button variant="outline" onClick={() => setAction(null)}>Cancelar</Button></div>
            </div>}
          </aside>
        </div>
      </div>
    </main>
  )
}
