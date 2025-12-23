"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Student = {
    id: string
    nis: string
    name: string
    class: string
    status: string
}

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "nis",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="hover:bg-transparent p-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    NIS
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="hover:bg-transparent p-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "class",
        header: "Class",
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <span className="px-2 py-1 bg-muted rounded-md text-[11px] font-medium uppercase tracking-wider">
                    {row.getValue("status")}
                </span>
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const student = row.original
            const meta = table.options.meta
            return (
                <div className="text-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] border-[#3F3F3F] text-white/80">
                            <DropdownMenuItem onClick={() => meta?.onEdit(student)}>
                                <Edit className="mr-2 h-4 w-4 text-white/80" /> Edit Student
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-white/80 focus:text-red-600"
                                onClick={() => meta?.onDelete(student.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4 text-white/80" /> Delete Student
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]