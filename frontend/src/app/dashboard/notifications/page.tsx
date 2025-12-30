"use client"

import { useState, useEffect, useRef } from "react"
import { Icon } from "@iconify/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { notificationsData, reportActions } from "@/lib/dummyData"

interface ChatLog {
    content: string;
    isBot: boolean;
    time: string;
}

const botReplies: Record<string, string> = {
    "Hubungi Wali Murid (WhatsApp)": "Sistem mengirim pesan template ke Ortu: 'Putri Bapak/Ibu tercatat haid >7 hari (Melebihi Batas Normal), mohon konfirmasi kondisi'.",
    "Paksa Selesai (Set Suci)": "Status dipaksa menjadi 'SUCI'. Tanggal selesai diset ke hari ini.",
    "Tandai Sebagai Istihadhah (Penyakit)": "Status diubah menjadi 'Istihadhah'. Data dicatat di rekam medis sekolah.",
    "Batalkan Input Terakhir (Salah Pencet)": "Input terakhir dihapus. Status dikembalikan.",
    "Konfirmasi via Wali Kelas": "Notifikasi dikirim ke Dashboard Wali Kelas.",
    "Biarkan (Validasi Medis)": "Sistem mencatat sebagai variasi siklus.",
    "Hapus Log Spam": "Log spam dibersihkan.",
    "Buka Blokir Kartu": "Kartu di-unblock.",
    "Panggil Siswi (BK)": "Surat panggilan BK dicetak.",
    "Reset Siklus (Hapus Data)": "Data siklus di-reset.",
    "Set Selesai Otomatis (Estimasi)": "Siklus ditutup otomatis.",
    "Selesaikan Laporan": "Kasus ditutup."
};

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState("needs-action")
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [reports, setReports] = useState(notificationsData)

    const [localLogs, setLocalLogs] = useState<Record<number, ChatLog[]>>({})

    const [isOpen, setIsOpen] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const filteredReports = reports.filter(r =>
        activeTab === "needs-action" ? r.status === 'pending' : r.status === 'completed'
    )

    const currentReport = reports.find(r => r.id === selectedId)

    useEffect(() => {
        if (filteredReports.length > 0) {
            setSelectedId(filteredReports[0].id)
        } else {
            setSelectedId(null)
        }
    }, [activeTab])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [localLogs, selectedId]);

    const getInitials = (name: string) => {
        const p = name.split(' ')
        return (p.length > 1 ? p[0][0] + p[1][0] : p[0].substring(0, 2)).toUpperCase()
    }

    const handleAction = (action: string) => {
        if (!selectedId) return;

        const adminMessage: ChatLog = { content: action, isBot: false, time: "Now" };
        setLocalLogs(prev => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] || []), adminMessage]
        }));

        if (action === "Selesaikan Laporan") {
            setTimeout(() => {
                setReports(prev => prev.map(r =>
                    r.id === selectedId ? { ...r, status: 'completed', unread: false } : r
                ));
            }, 1500);
        }

        setTimeout(() => {
            const replyText = botReplies[action] || "Sistem: Perintah diterima dan sedang diproses.";
            const botReply: ChatLog = {
                content: replyText,
                isBot: true,
                time: "Now"
            };

            setLocalLogs(prev => ({
                ...prev,
                [selectedId]: [...(prev[selectedId] || []), botReply]
            }));
        }, 800);

        setIsOpen(false);
    };

    return (
        <div className="flex h-full w-full bg-background text-foreground overflow-hidden shadcn-default">

            <aside className="w-[380px] h-full flex flex-col border-r border-border shrink-0 bg-background/50">
                <div className="p-4 shrink-0 border-b border-border/50">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="h-12">
                            <TabsTrigger value="needs-action" className="h-full gap-2 px-6">
                                <Icon icon="material-symbols:pending-actions" width={24} height={24} /> Pending
                            </TabsTrigger>
                            <TabsTrigger value="all-history" className="h-full gap-2 px-6">
                                <Icon icon="hugeicons:note-done" width={24} height={24} /> Resolved
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-2 space-y-1">
                        {filteredReports.length > 0 ? (
                            filteredReports.map((item) => {
                                const isActive = selectedId === item.id;

                                const itemLogs = localLogs[item.id] || [];
                                const lastUserAction = [...itemLogs].reverse().find(log => !log.isBot);
                                const previewText = lastUserAction ? lastUserAction.content : item.details;
                                const isActionTaken = !!lastUserAction;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedId(item.id)}
                                        className={`
                            group flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 border border-transparent
                            ${isActive
                                                ? "bg-accent/80 text-accent-foreground shadow-sm ring-1 ring-border"
                                                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                            }
                        `}
                                    >

                                        <Avatar className={`h-9 w-9 shrink-0 border transition-all ${isActive ? 'border-primary/20' : 'border-transparent group-hover:border-border'}`}>
                                            <AvatarFallback className={`text-[10px] font-bold ${isActive ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                                                {getInitials(item.student)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col flex-1 min-w-0 gap-0.5 justify-center">

                                            <div className="flex justify-between items-center w-full">
                                                <span className={`text-sm font-medium truncate ${isActive ? 'text-foreground' : ''}`}>
                                                    {item.student}
                                                </span>

                                                {isActionTaken ? (
                                                    <Icon icon="lucide:check" className="h-3.5 w-3.5 text-primary shrink-0 opacity-70 ml-2" />
                                                ) : item.unread && (
                                                    <span className="relative flex h-2 w-2 shrink-0 ml-2">
                                                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center w-full max-w-[180px]">
                                                {isActionTaken && <span className="text-[11px] font-bold text-primary mr-1 shrink-0">Anda:</span>}
                                                <span className={`text-[11px] truncate block ${isActionTaken ? 'text-primary/80 font-medium' : 'opacity-70'}`}>
                                                    {previewText}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground animate-in fade-in">
                                <Icon icon="hugeicons:task-01" className="h-8 w-8 mb-2 opacity-50" />
                                <p className="text-xs">No reports found.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </aside>

            <main className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
                {currentReport ? (
                    <>
                        <header className="px-6 h-16 flex justify-between items-center border-b border-border shrink-0 bg-background/80 backdrop-blur-sm z-10 sticky top-0">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                    <Icon icon="lucide:bot" width={18} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold">System Bot</h2>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Automated Resolution</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-mono">
                                Case #{currentReport.id}
                            </Badge>
                        </header>

                        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
                            <div className="w-full p-6 space-y-6">

                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center justify-center shrink-0 mt-1">
                                        <Icon icon="lucide:alert-circle" width={16} />
                                    </div>
                                    <div className="flex flex-col gap-1 max-w-[85%]">
                                        <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none shadow-sm">
                                            <h4 className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wide">{currentReport.type}</h4>
                                            <p className="text-sm leading-relaxed">{currentReport.details}</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-mono ml-1">{currentReport.time}</span>
                                    </div>
                                </div>

                                {localLogs[currentReport.id]?.map((log, i) => (
                                    <div key={i} className={`flex gap-3 ${log.isBot ? '' : 'flex-row-reverse'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-1 
                                            ${log.isBot
                                                ? 'bg-primary/10 border-primary/20 text-primary'
                                                : 'bg-muted border-border text-foreground'
                                            }`}
                                        >
                                            <Icon icon={log.isBot ? "lucide:bot" : "lucide:user"} width={16} />
                                        </div>

                                        <div className={`flex flex-col gap-1 ${!log.isBot ? 'items-end' : ''} max-w-[80%]`}>
                                            <div className={`p-3.5 px-5 rounded-2xl text-sm shadow-sm border 
                                                ${log.isBot
                                                    ? 'bg-card border-border text-card-foreground rounded-tl-none'
                                                    : 'bg-primary text-primary-foreground border-primary rounded-tr-none'
                                                }`}
                                            >
                                                {log.content}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground font-mono mx-1">{log.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <footer className="p-4 border-t border-border shrink-0 bg-background z-20 relative">
                            <div className="w-full">
                                {currentReport.status === 'pending' ? (
                                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                                        <PopoverTrigger asChild>

                                            <button className="relative group w-full text-left outline-none cursor-pointer">
                                                <Input
                                                    readOnly
                                                    placeholder="Pilih tindakan penyelesaian..."
                                                    className="h-12 pl-4 pr-10 cursor-pointer hover:bg-muted/50 transition-colors pointer-events-none bg-background"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-hover:text-foreground transition-colors">
                                                    <Icon icon="lucide:chevron-up" width={18} />
                                                </div>
                                            </button>
                                        </PopoverTrigger>

                                        <PopoverContent
                                            side="top"
                                            align="center"
                                            sideOffset={10}
                                            className="w-[var(--radix-popover-trigger-width)] p-1 mb-2 rounded-xl border-border shadow-lg z-50"
                                        >
                                            <div className="grid grid-cols-1 gap-0.5">

                                                {(reportActions[currentReport.type] || reportActions["default"] || [
                                                    "Selesaikan Laporan",
                                                    "Hubungi Wali Murid (WhatsApp)",
                                                    "Batalkan Input"
                                                ]).map((action) => (
                                                    <Button
                                                        key={action}
                                                        variant="ghost"
                                                        onClick={() => handleAction(action)}
                                                        className="w-full justify-between h-auto py-2.5 px-3 font-normal text-sm hover:bg-muted"
                                                    >
                                                        {action}
                                                        <Icon icon="lucide:arrow-right" width={14} className="text-muted-foreground opacity-50" />
                                                    </Button>
                                                ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <div className="h-12 w-full flex items-center justify-center bg-green-500/10 border border-green-500/20 rounded-md border-dashed">
                                        <span className="text-xs text-green-600 flex items-center gap-2 font-medium">
                                            <Icon icon="lucide:check-circle-2" width={16} />
                                            Kasus ini telah diselesaikan
                                        </span>
                                    </div>
                                )}
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4 rotate-3">
                            <Icon icon="lucide:inbox" width={32} className="opacity-50" />
                        </div>
                        <p className="text-sm font-medium">Pilih laporan untuk melihat detail</p>
                    </div>
                )}
            </main>
        </div>
    )
}