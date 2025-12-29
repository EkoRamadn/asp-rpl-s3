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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icon } from "@iconify/react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ClassDetailView } from "./ClassDetailView";
import { classesData, studentsData, mockAttendance } from "@/lib/dummyData";

function ClassPage() {
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredClasses = classesData.filter((kelas) => {
    const batchMap: Record<string, string> = {
      "X": "2024",
      "XI": "2023",
      "XII": "2022"
    };

    const matchTab = activeTab === "all" ? true : kelas.angkatan === batchMap[activeTab];

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

  return (
    <div className={`shadcn-default h-full flex flex-col overflow-hidden ${selectedClassId ? "p-0" : "px-[20px] pb-4"}`}>

      {selectedClassId ? (
        <ClassDetailView
          classId={selectedClassId}
          onBack={() => setSelectedClassId(null)}
          classesData={classesData}
          studentsData={studentsData}
          attendanceHistory={mockAttendance}
        />
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex w-full h-fit gap-[20px] py-[20px] items-center shrink-0">
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

          <div className="flex-1 overflow-y-auto min-h-0 pb-4 pr-2">
            {paginatedClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedClasses.map((kelas) => (
                  <div key={kelas.id} className="group bg-[#151419] border border-[#3F3F3F] rounded-xl p-4 flex flex-col gap-4 transition-all hover:border-white/20">
                    <div className="relative w-full h-[100px] overflow-hidden rounded-lg bg-black/50">
                      <div className="absolute inset-0 flex items-center justify-center text-white/20">
                        <Icon icon="ph:chalkboard-teacher" width={32} />
                      </div>
                      <Image src="/image.png" alt="Thumb" fill priority={true} className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold text-[16px] text-white uppercase leading-tight">{kelas.name}</h3>
                      <p className="text-[14px] text-white/40 truncate">{kelas.wali}</p>
                    </div>
                    <div className="flex gap-2 pt-2 mt-auto">
                      <Button className="flex-1 h-10 bg-white text-black hover:bg-white/90 font-bold text-xs" onClick={() => setSelectedClassId(kelas.id)}>
                        <Icon icon="majesticicons:open" width={20} height={20} className="mr-2" />
                        Masuk
                      </Button>
                      <Button variant="outline" size="icon" className="h-10 w-10 border-[#3F3F3F]" onClick={() => setIsQRModalOpen(true)}>
                        <Icon icon="ic:baseline-qr-code" width={20} height={20} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500 h-full">
                <Icon icon="hugeicons:file-search" width={48} height={48} className="text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold text-foreground/80">No classes found</h3>
                <p className="text-sm text-muted-foreground max-w-[300px]">
                  We couldn't find any classes matching "{keyword}".
                </p>
                <Button
                  variant="link"
                  onClick={() => setKeyword("")}
                  className="mt-2 text-primary"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>

          {paginatedClasses.length > 0 && (
            <div className="shrink-0 py-4 z-10 mt-auto border-t border-transparent">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); currentPage > 1 && setCurrentPage(currentPage - 1) }}
                      className={currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === pageNum}
                            onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1) }}
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
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); currentPage < totalPages && setCurrentPage(currentPage + 1) }}
                      className={currentPage === totalPages || totalPages === 0 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

        </Tabs>
      )}

      {/* MODAL QR */}
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