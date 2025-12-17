"use client"

import { useState } from "react";
import Image from "next/image";
import Iconify from "@/components/custom/mobile/ui/Iconify";
import { Button } from "@/components/custom/ui/buttons";

import { Tabs, TabsList, TabsTrigger } from "@/components/custom/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { InputForm } from "@/components/custom/ui/input-form";



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
];

function ClassPage() {
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const filteredClasses = classesData.filter((kelas) => {
    const matchTab = activeTab === "all" ? true : kelas.batch === activeTab;
    const matchSearch =
      kelas.name.toLowerCase().includes(keyword.toLowerCase()) ||
      kelas.wali.toLowerCase().includes(keyword.toLowerCase());

    return matchTab && matchSearch;
  });

  if (selectedClassId !== null) {
    const selectedClassInfo = classesData.find(c => c.id === selectedClassId);

    return (
      <div className="h-full w-full bg-[#151419] flex flex-col overflow-hidden p-5 gap-5">
        <div className="flex items-center gap-4 flex-none">
          <Button variant="ghost" size="icon" onClick={() => setSelectedClassId(null)}>
            <Iconify icon="material-symbols:arrow-back" size={24} className="text-white" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{selectedClassInfo?.name}</h1>
            <p className="text-white/60 text-sm">{selectedClassInfo?.wali}</p>
          </div>
        </div>

        <div className="flex-1 border border-dashed border-[#3F3F3F] rounded-xl flex items-center justify-center text-white/50">
          <p>WIP</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-5">
        {/* Header Konten Desktop */}
        <div className="flex w-full h-fit gap-[20px] pt-[20px] pb-[20px] items-center">
          {/* Tabs */}
          <div className="flex w-fit h-fit">
            <TabsList>
              <TabsTrigger value="all">
                <Iconify icon="gridicons:grid" size={24} /> All
              </TabsTrigger>
              <TabsTrigger value="X">
                <Iconify icon="ph:student" size={24} /> Batch X
              </TabsTrigger>
              <TabsTrigger value="XI">
                <Iconify icon="ph:student" size={24} /> Batch XI
              </TabsTrigger>
              <TabsTrigger value="XII">
                <Iconify icon="ph:student" size={24} /> Batch XII
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Searchbar */}
          <div className="flex w-full h-fit max-w-[400px] relative">

            <InputForm
              type="text"
              placeholder="Search Class or Guardian..."
              className="pr-[40px] capitalize"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyword.length > 0 ? (
              <button
                onClick={() => setKeyword("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white flex items-center justify-center">
                <Iconify icon="material-symbols:close" size={24} />
              </button>
            ) : (
              <Iconify
                icon="material-symbols:search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70"
                size={24}
              />
            )}
          </div>
        </div>

        {/* Class */}
        <ScrollArea className="h-[calc(100vh-180px)] w-full">

          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[15px]">
              {filteredClasses.map((kelas) => (
                <div
                  key={kelas.id}
                  className="group w-full bg-[#151419] border border-[#27272A] rounded-[12px] p-[15px] flex flex-col gap-[15px] hover:border-[#3F3F3F] transition-colors"
                >
                  <Image
                    src="/Hollow Knight Silksong.jpg"
                    alt="Placeholder Class"
                    width={500}
                    height={500}>
                  </Image>

                  <div className="flex flex-col gap-[10px]">
                    <h3 className="text-white font-bold text-[14px] uppercase tracking-wider">{kelas.name}</h3>
                    <p className="text-white/60 font-medium text-[14px]">{kelas.wali}</p>
                  </div>

                  <div className="flex items-center gap-[10px]">
                    <Button
                      variant="default"
                      className="w-full font-medium text-[14px] gap-[15px]"
                      onClick={() => setSelectedClassId(kelas.id)}
                    >
                      <Iconify icon="majesticons:open" size={24} />
                      Masuk
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="p-[10px] w-fit h-fit"
                      onClick={() => setIsQRModalOpen(true)}>
                      <Iconify icon="ic:baseline-qr-code" size={24} />
                    </Button>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-white/60 gap-[15px]">
              <Iconify icon="material-symbols:search-off" size={48} />
              <p>No classes found.</p>
            </div>
          )}

        </ScrollArea>
      </Tabs>
      {/* Pop-up QR Code */}
      <AlertDialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <AlertDialogContent className="bg-[#151419] border border-[#3F3F3F] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Generate QR Code</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Placeholder untuk fitur generate QR Code satu kelas.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* QR (Placeholder) */}
          <div className="h-[200px] flex items-center justify-center bg-black/50 rounded border border-[#27272A]">
            <Iconify icon="ic:baseline-qr-code-2" size={64} className="text-white/50" />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#3F3F3F] text-white hover:bg-[#27272A] hover:text-white">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ClassPage;