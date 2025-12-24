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

export type User = {
    id: string
    nama_lengkap: string
    username: string
    role: string
    last_login: string
}

export const columnsUsers: ColumnDef<User>[] = [
    {
        accessorKey: "nama_lengkap",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="hover:bg-transparent p-0"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Nama Lengkap
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    { accessorKey: "username", header: "Username" },
    {
        accessorKey: "role",
        header: () => <div className="text-center">Role</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <span className="px-2 py-1 bg-muted rounded-md text-[11px] font-bold uppercase tracking-wider">
                    {row.getValue("role")}
                </span>
            </div>
        )
    },
    {
        accessorKey: "last_login",
        header: () => <div className="text-center">Login Terakhir</div>,
        cell: ({ row }) => <div className="text-center text-muted-foreground">{row.getValue("last_login")}</div>
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const user = row.original
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
                            <DropdownMenuItem onClick={() => meta?.onEdit(user)}>
                                <Edit className="mr-2 h-4 w-4 text-white/80" /> Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-white/80 focus:text-red-600"
                                onClick={() => meta?.onDelete(user.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4 text-white/80" /> Delete User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    }
]