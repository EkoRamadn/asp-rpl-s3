"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
    return (
        <div className="relative w-full overflow-hidden rounded-xl border border-[#3F3F3F]">
            <table
                className={cn("w-full border-collapse text-[14px]", className)}
                {...props}
            />
        </div>
    )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
    return (
        <thead
            className={cn("[&_tr]:border-b border-[#3F3F3F]", className)}
            {...props}
        />
    )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
    return (
        <tbody
            className={cn("[&_tr:last-child]:border-b-0", className)}
            {...props}
        />
    )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
    return (
        <tr
            className={cn(
                "border-b border-[#3F3F3F] transition-colors hover:bg-muted/50",
                className
            )}
            {...props}
        />
    )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
    return (
        <th
            className={cn(
                "bg-[#27272A] p-[15px] text-center font-semibold",
                className
            )}
            {...props}
        />
    )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
    return (
        <td
            className={cn(
                "bg-[#151419] p-[15px] text-center align-middle",
                className
            )}
            {...props}
        />
    )
}


export {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
}
