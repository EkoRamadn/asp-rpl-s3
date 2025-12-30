"use client"

import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import QRCode from "react-qr-code";
import { isSameDay, parseISO, format } from "date-fns";

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

const attendanceColumns: ColumnDef<any>[] = [
    {
        accessorKey: "no",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="p-0 hover:bg-transparent h-auto font-medium text-sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                No. <Icon icon="lucide:arrow-up-down" className="ml-2 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-sm font-medium pl-1">{row.getValue("no")}</div>,
    },
    {
        accessorKey: "ket",
        header: "Description",
        cell: ({ row }) => <div className="font-medium text-sm">{row.getValue("ket")}</div>,
    },
    {
        accessorKey: "awal",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="p-0 hover:bg-transparent h-auto font-medium text-sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Start Date <Icon icon="lucide:arrow-up-down" className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("awal")}</div>,
    },
    {
        accessorKey: "akhir",
        header: "End Date",
        cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("akhir") || "-"}</div>,
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center text-sm w-full">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            return (
                <div className="flex justify-center w-full">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 font-medium shadow-sm">
                        {status}
                    </Badge>
                </div>
            );
        },
    },
];

export function ClassDetailView({
    classId,
    onBack,
    classesData,
    studentsData,
    attendanceHistory
}: any) {
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [showQR, setShowQR] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const qrRef = useRef<HTMLDivElement>(null);

    const currentClass = classesData.find((c: any) => c.id === classId);

    useEffect(() => { setShowQR(false); }, [selectedStudent]);

    const filteredStudents = studentsData.filter((student: any) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nis.includes(searchQuery)
    );

    const studentSpecificHistory = attendanceHistory.filter((item: any) =>
        selectedStudent && String(item.student_id) === String(selectedStudent.id)
    );

    const fullHistory = [...studentSpecificHistory]
        .sort((a: any, b: any) => new Date(b.awal).getTime() - new Date(a.awal).getTime());

    const downloadQR = () => {
        if (!qrRef.current) return;
        const svg = qrRef.current.querySelector("svg");
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            img.onload = () => {
                const size = 2000;
                canvas.width = size;
                canvas.height = size;
                const padding = 150;
                if (ctx) {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, padding, padding, size - (padding * 2), size - (padding * 2));
                    const link = document.createElement("a");
                    link.download = `QR-${selectedStudent.name}.png`;
                    link.href = canvas.toDataURL("image/png");
                    link.click();
                }
            };
            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        }
    };

    const renderDayContent = (props: any) => {
        const dayDate = props.date || props;
        if (!(dayDate instanceof Date) || isNaN(dayDate.getTime())) {
            return <span>{dayDate?.getDate ? dayDate.getDate() : "?"}</span>;
        }
        const log = fullHistory.find((h: any) => {
            const recordDate = new Date(h.awal.replace(" ", "T"));
            return isSameDay(recordDate, dayDate);
        });

        if (!log) {
            return <span>{dayDate.getDate()}</span>;
        }

        const dotColor = log.status === "Hadir" ? "bg-green-500" : log.status === "Sakit" ? "bg-yellow-500" : "bg-red-500";

        return (
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer relative p-1">
                        <span className="font-semibold">{dayDate.getDate()}</span>
                        <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />
                    </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-auto p-3 shadow-lg z-50 bg-popover" align="center" side="top">
                    <div className="flex flex-col gap-1 min-w-[120px]">
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                            <span className="text-xs font-bold text-foreground">{log.status}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">{log.ket}</span>
                        <div className="text-[10px] text-muted-foreground mt-1 pt-1 border-t border-border">
                            {format(new Date(log.awal.replace(" ", "T")), "HH:mm")} - {log.akhir !== "-" ? format(new Date(log.akhir.replace(" ", "T")), "HH:mm") : "-"}
                        </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
        );
    };

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">

            <aside className="w-[320px] flex flex-col border-r bg-background/50 h-full shrink-0">
                <div className="flex h-16 shrink-0 items-center gap-3 border-b px-4 bg-background">
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Icon icon="lucide:arrow-left" className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-col overflow-hidden">
                        <h2 className="text-sm font-bold truncate">{currentClass?.name}</h2>
                        <p className="text-[11px] text-muted-foreground truncate">{currentClass?.wali}</p>
                    </div>
                </div>

                <div className="p-3 border-b bg-background/30">
                    <div className="relative">
                        <Icon icon="lucide:search" className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Find student..."
                            className="pl-9 h-9 text-sm bg-muted/40 border-transparent focus:bg-background focus:border-input transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="h-full w-full overflow-y-auto p-2 space-y-1">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student: any) => {
                                const isActive = selectedStudent?.id === student.id;
                                return (
                                    <div
                                        key={student.id}
                                        onClick={() => setSelectedStudent(student)}
                                        className={`group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 border border-transparent ${isActive ? "bg-accent/80 text-accent-foreground shadow-sm ring-1 ring-border" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"}`}
                                    >
                                        <Avatar className={`h-9 w-9 border transition-all ${isActive ? 'border-primary/20' : 'border-transparent group-hover:border-border'}`}>
                                            <AvatarFallback className={`text-xs font-semibold ${isActive ? 'bg-primary/10 text-primary' : ''}`}>
                                                {student.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className={`text-sm font-medium truncate ${isActive ? 'text-foreground' : ''}`}>{student.name}</span>
                                            <span className="text-[11px] opacity-70 truncate font-mono">{student.nis}</span>
                                        </div>
                                        {isActive && <Icon icon="lucide:chevron-right" className="ml-auto h-4 w-4 text-primary animate-in slide-in-from-left-1 duration-300" />}
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground animate-in fade-in">
                                <Icon icon="hugeicons:user-search-01" className="h-8 w-8 mb-2 opacity-50" />
                                <p className="text-xs">Student not found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {selectedStudent ? (
                    <div className="flex-1 flex flex-col p-8 gap-6 h-full overflow-hidden">

                        <div className="flex flex-col xl:flex-row gap-4 items-stretch shrink-0">

                            <Card className="border shadow-sm flex-1 min-w-[300px]">
                                <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[300px]">

                                    {showQR ? (

                                        <div className="flex flex-col items-center animate-in zoom-in-95 duration-300 gap-4 w-full h-full justify-between">

                                            <div ref={qrRef} className="bg-white p-2 rounded-lg border shadow-sm mt-2">
                                                <QRCode
                                                    value={selectedStudent.nis}
                                                    size={256}
                                                    style={{ height: "130px", maxWidth: "100%", width: "130px" }}
                                                    viewBox={`0 0 256 256`}
                                                />
                                            </div>

                                            <div className="text-center w-full space-y-3">
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-bold leading-tight">{selectedStudent.name}</h3>
                                                    <p className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-full w-fit mx-auto">
                                                        {currentClass?.name} ({selectedStudent.nis})
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={downloadQR}
                                                    className="h-9 text-xs gap-2 w-full max-w-[200px]"
                                                >
                                                    <Icon icon="lucide:download" className="h-3.5 w-3.5" /> Download QR Image
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (

                                        <div className="flex flex-col items-center justify-center gap-5 w-full h-full animate-in fade-in duration-300">
                                            <div className="h-[130px] w-[130px] bg-muted/30 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2">
                                                <Icon icon="lucide:qr-code" className="text-muted-foreground/50" width={36} height={36} />
                                            </div>

                                            <div className="text-center space-y-1">
                                                <p className="text-sm font-semibold">Student QR Code</p>
                                                <p className="text-[11px] text-muted-foreground">Click below to generate & download</p>
                                            </div>

                                            <Button
                                                variant="outline"
                                                onClick={() => setShowQR(true)}
                                                className="w-full max-w-[200px] h-9 text-xs gap-2"
                                            >
                                                <Icon icon="lucide:eye" className="h-3.5 w-3.5" /> Show QR Code
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border shadow-sm bg-card flex-1">
                                <CardContent className="p-2 flex items-center justify-center h-full">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="rounded-md border shadow-none p-2"
                                        components={{
                                            DayContent: renderDayContent
                                        } as any}
                                    />
                                </CardContent>
                            </Card>

                        </div>

                        <div className="flex-1 rounded-md border bg-background relative overflow-hidden min-h-0">
                            <div className="absolute inset-0 overflow-y-auto [&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:bg-muted/95 [&_thead_th]:z-20 [&_thead_th]:backdrop-blur-sm [&_thead_th]:shadow-sm">
                                <DataTable
                                    columns={attendanceColumns}
                                    data={fullHistory}
                                    filterValue=""
                                    disablePagination={true}
                                />
                            </div>
                        </div>

                    </div>
                ) : (

                    <div className="flex h-full flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
                        <Icon icon="hugeicons:user-search-01" width={48} height={48} className="text-muted-foreground/40 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground/80">No student selected</h3>
                        <p className="text-sm text-muted-foreground max-w-[300px]">
                            Select a student from the directory sidebar to view their detailed attendance records.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}