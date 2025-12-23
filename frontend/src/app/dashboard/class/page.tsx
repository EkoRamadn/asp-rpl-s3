"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { Icon } from "@iconify/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DataTable } from "@/components/ui/data-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const classesData = [
  { id: 1, name: "X MIPA 1", wali: "Bapak Mulyono S.Pd.", batch: "X" },
  { id: 2, name: "X MIPA 2", wali: "Ibu Susi S.Pd.", batch: "X" },
  { id: 3, name: "XI MIPA 1", wali: "Bapak Budi S.Pd.", batch: "XI" },
  { id: 4, name: "XI IPS 1", wali: "Ibu Ani S.Pd.", batch: "XI" },
  { id: 5, name: "XII MIPA 1", wali: "Bapak Joko S.Pd.", batch: "XII" },
  { id: 6, name: "XII MIPA 2", wali: "Ibu Rina S.Pd.", batch: "XII" },
  { id: 7, name: "XII IPS 1", wali: "Bapak Tono S.Pd.", batch: "XII" },
  { id: 8, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII" },
  { id: 9, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII" },
  { id: 10, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII" },
  { id: 11, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII" },
  { id: 12, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII" },
  { id: 13, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII" },
  { id: 14, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII" },
  { id: 15, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII" },
  { id: 16, name: "XII IPS 2", wali: "Ibu Sari S.Pd.", batch: "XII" },
];

const studentsData = [
  { id: 1, name: "Handika Rado Arganata", nim: "0123456789" },
  { id: 2, name: "Budi Santoso", nim: "0123456790" },
  { id: 3, name: "Siti Aminah", nim: "0123456791" },
  { id: 4, name: "Rizky Pratama", nim: "0123456792" },
  { id: 5, name: "Putri Lestari", nim: "0123456793" },
];

const attendanceHistory = [
  { no: "01", ket: "Haid", awal: "November 09, 2025", akhir: "November 24, 2025", status: "Selesai" },
  { no: "02", ket: "Haid", awal: "October 10, 2025", akhir: "October 25, 2025", status: "Selesai" },
];

const columnsAttendance = [
  { accessorKey: "no", header: "No" },
  { accessorKey: "ket", header: "Keterangan" },
  { accessorKey: "awal", header: "Tanggal Mulai" },
  { accessorKey: "akhir", header: "Tanggal Selesai" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => (
      <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase text-white/80">
        {row.getValue("status")}
      </span>
    )
  },
];

function ClassPage() {
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [qrGeneratedFor, setQrGeneratedFor] = useState<number | null>(null);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredClasses = classesData.filter((kelas) => {
    const matchTab = activeTab === "all" ? true : kelas.batch === activeTab;
    const matchSearch =
      kelas.name.toLowerCase().includes(keyword.toLowerCase()) ||
      kelas.wali.toLowerCase().includes(keyword.toLowerCase());
    return matchTab && matchSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, activeTab]);

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClasses = filteredClasses.slice(startIndex, startIndex + itemsPerPage);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="shadcn-default px-[20px] h-screen flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col flex-1 overflow-hidden">
        <div className="flex w-full h-fit gap-[20px] py-[20px] items-center">
          <div className="flex w-fit h-fit">
            <TabsList className="h-12">
              <TabsTrigger value="all" className="h-full px-6 gap-2">
                <Icon icon="gridicons:grid" width={20} /> All
              </TabsTrigger>
              <TabsTrigger value="X" className="h-full px-6">Batch X</TabsTrigger>
              <TabsTrigger value="XI" className="h-full px-6">Batch XI</TabsTrigger>
              <TabsTrigger value="XII" className="h-full px-6">Batch XII</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex w-full h-fit">
            <div className="relative w-full max-w-[400px]">
              <Input
                placeholder="Search classes"
                className="pr-[40px] h-12"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Icon
                icon={keyword ? "material-symbols:close" : "material-symbols:search"}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground ${keyword && 'cursor-pointer'}`}
                width={20}
                onClick={() => setKeyword("")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {paginatedClasses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedClasses.map((kelas) => (
                  <div key={kelas.id} className="group bg-[#151419] border border-[#3F3F3F] rounded-xl p-4 flex flex-col gap-4 transition-all">
                    <div className="relative w-full h-[60px] overflow-hidden rounded-lg">
                      <Image src="/image.png" alt="Thumb" fill className="object-cover opacity-80" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[16px] text-white uppercase">{kelas.name}</h3>
                      <p className="text-[14px] text-white/40 truncate">{kelas.wali}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 h-10 bg-white text-black hover:bg-white/90 font-bold text-xs" onClick={() => setSelectedClassId(kelas.id)}>
                        <Icon icon="majesticicons:open" width={20} height={20} />
                        Masuk
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 border-[#3F3F3F]" onClick={() => setIsQRModalOpen(true)}>
                        <Icon icon="ic:baseline-qr-code" width={20} height={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); currentPage > 1 && setCurrentPage(currentPage - 1) }} className={currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href="#" isActive={currentPage === i + 1} onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); currentPage < totalPages && setCurrentPage(currentPage + 1) }} className={currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Icon icon="material-symbols:search-off" width={48} className="mb-4 opacity-20" />
              <p>No classes found.</p>
            </div>
          )}
        </div>
      </Tabs>

      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="bg-[#151419] border-[#3F3F3F] text-white">
          <DialogHeader><DialogTitle>Class QR Code</DialogTitle></DialogHeader>
          <div className="flex flex-col items-center py-6 gap-4">
            <div className="w-40 h-40 bg-white p-2 rounded-lg">
              <Icon icon="ic:baseline-qr-code-2" width="100%" height="100%" className="text-black" />
            </div>
            <p className="text-xs text-center text-white/40">Gunakan kode ini untuk absensi kolektif kelas.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ClassPage;