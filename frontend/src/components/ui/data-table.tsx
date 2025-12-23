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
}

export function DataTable<TData, TValue>({ columns, data, filterValue = "", meta }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { sorting, globalFilter: filterValue },
        initialState: { pagination: { pageSize: 10 } },
        meta: meta,
    })

    const currentPage = table.getState().pagination.pageIndex + 1
    const totalPages = table.getPageCount()

    const hasData = table.getRowModel().rows?.length > 0;

    return (
        <div className="space-y-4 shadcn-default">
            {hasData ? (
                <div className="rounded-md border bg-card">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="font-bold text-foreground">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
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
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
                    <Icon icon="hugeicons:file-search" width={48} height={48} className="text-muted-foreground/40 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground/80">No results found</h3>
                    <p className="text-sm text-muted-foreground max-w-[300px]">
                        We couldn't find any matches for "{filterValue}".
                    </p>
                    <Button
                        variant="link"
                        onClick={() => meta?.onClearSearch()}
                        className="mt-2 text-primary"
                    >
                        Clear search
                    </Button>
                </div>
            )}

            {hasData && totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    table.previousPage()
                                }}
                                className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1
                            if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === pageNum}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                table.setPageIndex(i)
                                            }}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            }
                            if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )
                            }
                            return null
                        })}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    table.nextPage()
                                }}
                                className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}