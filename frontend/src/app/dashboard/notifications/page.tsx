"use client"

import { useState, useEffect, useRef } from "react"
import { Icon } from "@iconify/react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { notificationsData, reportActions, Report } from "@/lib/dummyData"

const botReplies: Record<string, string> = {
    "Hubungi Siswi via WhatsApp": "Sistem telah mengirimkan pesan pengingat otomatis ke nomor WhatsApp siswi terkait. Menunggu respon sistem...",
    "Konfirmasi Wali Kelas": "Permintaan konfirmasi telah diteruskan ke Dashboard Wali Kelas. Status akan diperbarui jika ada balasan.",
    "Input Data Manual": "Mode input manual diaktifkan. Silakan perbarui data absensi pada modul Absensi Utama.",
    "Selesaikan Laporan": "Laporan berhasil diselesaikan. Case ini akan dipindahkan ke tab Resolved.",
    "Koreksi Data Siklus": "Data siklus telah diperbarui berdasarkan standar medis sistem. Silakan cek kembali grafik siswi.",
    "Cek Fisik Kartu Siswi": "Perintah pengecekan kartu telah dicatat. Mohon arahkan siswi ke ruang IT jika kartu fisik rusak."
};

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState("needs-action")
    const [selectedId, setSelectedId] = useState(101)
    const [localLogs, setLocalLogs] = useState<Record<number, any[]>>({})
    const [isOpen, setIsOpen] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [reports, setReports] = useState(notificationsData);

    const filtered = reports.filter(r =>
        activeTab === "needs-action" ? r.status === 'pending' : r.status === 'completed'
    )

    const current = reports.find(r => r.id === selectedId)

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
        // 1. Catat pesan Admin
        const adminMessage = { content: action, isBot: false, time: "17.30" };
        setLocalLogs(prev => ({
            ...prev,
            [selectedId]: [...(prev[selectedId] || []), adminMessage]
        }));

        // 2. Eksekusi Perubahan Sistem
        if (action === "Selesaikan Laporan" || action === "Update Status Valid") {
            setReports(prevReports => prevReports.map(report =>
                report.id === selectedId ? { ...report, status: 'completed', unread: false } : report
            ));
        }

        // 3. Balasan Bot Dinamis
        setTimeout(() => {
            const replyText = botReplies[action] || "Sistem: Instruksi telah diterima dan dijalankan.";
            const botReply = {
                content: replyText,
                isBot: true,
                time: "17.31"
            };

            setLocalLogs(prev => ({
                ...prev,
                [selectedId]: [...(prev[selectedId] || []), botReply]
            }));
        }, 800);

        setIsOpen(false);
    };

    return (
        <div className="flex h-screen w-full bg-[#0F0F12] text-white overflow-hidden border-b border-[#3F3F3F] shadcn-default">

            <aside className="w-[380px] h-full flex flex-col border-r border-[#3F3F3F] shrink-0">
                <div className="p-6 pb-4 shrink-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="h-12">
                            <TabsTrigger value="needs-action" className="h-full gap-2 px-6">
                                <Icon icon="material-symbols:pending-actions" />
                                Pending
                            </TabsTrigger>
                            <TabsTrigger value="all-history" className="h-full gap-2 px-6">
                                <Icon icon="hugeicons:note-done" />
                                Resolved
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <ScrollArea className="flex-1 no-scrollbar">
                    <div className="px-3 pb-10">
                        {filtered.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedId(item.id)}
                                className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all border mb-1 text-left ${selectedId === item.id ? "bg-[#151419] border-[#3F3F3F]" : "border-transparent hover:bg-white/5"}`}
                            >
                                <Avatar className="w-10 h-10 border border-[#3F3F3F] shrink-0">
                                    <AvatarFallback className="bg-[#27272A] text-[10px] font-black">{getInitials(item.student)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.nis}</span>
                                        {item.unread && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_red]" />}
                                    </div>
                                    <p className="text-sm font-bold truncate">{item.student}</p>
                                    <p className="text-[11px] text-white/40 truncate">{item.type}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </aside>

            <main className="flex-1 flex flex-col h-full bg-[#0F0F12] overflow-hidden">
                {current && (
                    <>
                        <header className="px-8 h-[93px] flex justify-between items-center border-b border-[#3F3F3F] shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#151419] border border-[#3F3F3F] flex items-center justify-center">
                                    <Icon icon="lucide:bot" width={22} className="text-blue-400" />
                                </div>
                                <h2 className="text-sm font-bold uppercase tracking-wider">System Bot</h2>
                            </div>
                            <Badge variant="outline" className="text-[10px] border-[#3F3F3F] text-white/40 uppercase tracking-widest px-3">Case #{current.id}</Badge>
                        </header>

                        <div className="flex-1 overflow-y-auto no-scrollbar" ref={scrollRef}>
                            <div className="max-w-4xl mx-auto p-10 space-y-10">
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded bg-[#151419] border border-[#3F3F3F] flex items-center justify-center shrink-0">
                                        <Icon icon="lucide:bot" width={16} className="text-blue-400" />
                                    </div>
                                    <div className="flex flex-col gap-2 max-w-[85%]">
                                        <div className="bg-[#151419] border border-[#3F3F3F] p-5 rounded-2xl rounded-tl-none">
                                            <p className="text-sm leading-relaxed text-white/90">{current.details}</p>
                                        </div>
                                        <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest ml-1">{current.time}</span>
                                    </div>
                                </div>

                                {localLogs[selectedId]?.map((log, i) => (
                                    <div key={i} className={`flex gap-4 ${log.isBot ? '' : 'flex-row-reverse'}`}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-[#3F3F3F] ${!log.isBot ? 'bg-white text-black' : 'bg-[#27272A] text-white'}`}>
                                            <Icon icon={log.isBot ? "lucide:bot" : "lucide:user"} width={16} />
                                        </div>

                                        <div className={`flex flex-col gap-2 ${!log.isBot ? 'items-end' : ''} max-w-[80%]`}>
                                            <div className={`bg-${log.isBot ? '[#151419]' : 'white'} ${log.isBot ? 'text-white/90 border-[#3F3F3F]' : 'text-black border-transparent'} p-4 rounded-2xl border ${log.isBot ? 'rounded-tl-none' : 'rounded-tr-none'} text-sm font-medium`}>
                                                {log.content}
                                            </div>
                                            <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">{log.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <footer className="p-8 border-t border-[#3F3F3F] shrink-0">
                            <div className="max-w-4xl mx-auto">
                                <Popover open={isOpen} onOpenChange={setIsOpen}>
                                    <PopoverTrigger asChild>
                                        <div className="relative">
                                            <Input readOnly placeholder="Klik untuk memilih tindakan..." className="h-14 bg-[#151419] border-[#3F3F3F] pl-6 pr-12 rounded-xl text-sm cursor-pointer focus-visible:ring-1 focus-visible:ring-white/10" />
                                            <Icon icon="lucide:chevron-up" className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20" width={18} />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent side="top" align="start" className="w-[830px] mb-2 bg-[#151419] border-[#3F3F3F] p-2 rounded-xl shadow-2xl">
                                        <div className="grid grid-cols-2 gap-1 p-1">
                                            {reportActions[current.type as keyof typeof reportActions]?.map((action) => (
                                                <button key={action} onClick={() => handleAction(action)} className="p-3 text-left rounded-lg text-xs font-bold text-white/60 hover:bg-white/5 hover:text-white transition-all flex justify-between items-center group">
                                                    {action}
                                                    <Icon icon="lucide:arrow-right" width={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </footer>
                    </>
                )}
            </main>
        </div>
    )
}