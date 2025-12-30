"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"

declare module "@tanstack/react-table" {
    interface TableMeta<TData> {
        onEdit: (data: TData) => void
        onDelete: (id: string) => void
        onClearSearch: () => void
    }
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Icon } from "@iconify/react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filterValue?: string
    meta?: any
    disablePagination?: boolean
}

export function DataTable<TData, TValue>({ columns, data, filterValue = "", meta, disablePagination = false }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: !disablePagination ? getPaginationRowModel() : undefined,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, globalFilter: filterValue },
        initialState: { pagination: { pageSize: disablePagination ? data.length : 10 } },
        meta: meta,
    })

    const rows = table.getRowModel().rows;
    const hasData = rows.length > 0;

    const currentPage = !disablePagination ? table.getState().pagination.pageIndex + 1 : 1;
    const totalPages = !disablePagination ? table.getPageCount() : 1;

    return (
        <div className="flex flex-col h-full w-full overflow-hidden gap-4 shadcn-default">

            {hasData ? (
                <div className="flex-1 rounded-md border bg-card overflow-auto relative">
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-card shadow-sm">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="whitespace-nowrap">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                    <Icon icon="hugeicons:file-search" width={48} height={48} className="text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground/80">
                        {filterValue ? "No results found" : "No data available"}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-[300px]">
                        {filterValue
                            ? `We couldn't find any matches for "${filterValue}".`
                            : "There is no data to display at the moment."}
                    </p>
                    {filterValue && (
                        <Button variant="link" onClick={() => meta?.onClearSearch()} className="mt-2 text-primary">
                            Clear search
                        </Button>
                    )}
                </div>
            )}

            {hasData && !disablePagination && (
                <div className="shrink-0 py-4 z-10 mt-auto border-t border-transparent">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); table.previousPage() }}
                                    className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                    return (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                href="#" isActive={currentPage === pageNum}
                                                onClick={(e) => { e.preventDefault(); table.setPageIndex(i) }}
                                            >
                                                {pageNum}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )
                                }
                                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <PaginationItem key={i}><PaginationEllipsis /></PaginationItem>
                                return null;
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); table.nextPage() }}
                                    className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}