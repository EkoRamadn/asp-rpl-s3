"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, QrCode, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Class = {
    id: string
    name: string
    wali: string
    total_siswi: number
    total_berhalangan: string
    total_suci: string
    attendance: string
    angkatan: string
}

export const columnsClasses: ColumnDef<Class>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Nama Kelas <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    { accessorKey: "wali", header: "Wali Kelas" },
    {
        accessorKey: "total_siswi",
        header: () => <div className="text-center">Total</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("total_siswi")}</div>,
    },
    {
        accessorKey: "total_berhalangan",
        header: () => <div className="text-center">Berhalangan</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("total_berhalangan")}</div>,
    },
    {
        accessorKey: "total_suci",
        header: () => <div className="text-center">Suci</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("total_suci")}</div>,
    },
    {
        accessorKey: "attendance",
        header: () => <div className="text-center">Kehadiran</div>,
        cell: ({ row }) => (
            <div className="text-center">
                {row.getValue("attendance")}
            </div>
        ),
    },
    {
        accessorKey: "angkatan",
        header: () => <div className="text-center">Angkatan</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("angkatan")}</div>,
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const kelas = row.original
            const meta = table.options.meta
            return (
                <div className="text-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] border-[#3F3F3F] text-white/80">
                            <DropdownMenuItem onClick={() => meta?.onEdit(kelas)}>
                                <Edit className="mr-2 h-4 w-4 text-white/80" /> Edit Class
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-white/80 focus:text-red-600"
                                onClick={() => meta?.onDelete(kelas.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4 text-white/80" /> Delete Class
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]