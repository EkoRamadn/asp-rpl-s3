'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useError } from '@/hooks/useError';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { Loading } from '../components/Loading';
import { getDataAbsensi } from '../logic/getDataAbsensi';
import { DataAbsensi, Sholat, SholatTimes } from '../types/global';

interface HistoryAbenProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  sholat: Sholat;
}

const HistoryAbsen = ({ isOpen, setIsOpen, sholat }: HistoryAbenProps) => {
  const [activeTab, setActiveTab] = useState<string>('dzuhur');
  const [data, setData] = useState<DataAbsensi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showError } = useError();

  useEffect(() => {
    if (!isOpen || !localStorage.getItem('token')) return;

    const currentSholat = activeTab as SholatTimes;
    setIsLoading(true);

    getDataAbsensi(getToday().toString(), currentSholat)
      .then((result) => {
        if (result.status === 'fail' || !result.data) {
          setData([]);
        } else {
          setData(result.data.absensi);
        }
      })
      .catch((err) => {
        showError(err);
        setData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeTab, isOpen, sholat, showError]);

  const ListContent = () => (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Info */}
      <div className="flex items-center justify-center gap-[5px] p-[10px]">
        <Icon icon="material-symbols:info-outline" className="text-white/80 text-[12px]" />
        <p className="text-[10px] text-white/80">Sorted by latest activity. Resets daily at 00:00.</p>
      </div>

      {/* Area Scroll Data */}
      <ScrollArea className="h-[40vh] w-full">
        <ul className="flex flex-col gap-[10px]">
          {isLoading ? (
            <div className="p-[10px] items-center flex justify-center"><Loading /></div>
          ) : data.length > 0 ? (
            data.map((item) => <Item siswi={item} key={item.id} />)
          ) : (
            <div className="flex flex-col items-center justify-center p-[10px] text-white/60 gap-[10px] h-[300px]">
              <Icon icon="material-symbols:inbox-customize-outline" width={32} height={32} />
              <p className="text-[12px]">No data recorded.</p>
            </div>
          )}
        </ul>
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[100%] rounded-[12px] bg-[#151419] border-[#27272A] text-white">
        <DialogHeader className="text-left space-y-4">
          <DialogTitle className="flex items-center text-[18px] font-bold gap-[10px]">
            <Icon icon="mingcute:time-line" width={24} height={24} />
            History
          </DialogTitle>
        </DialogHeader>

        {/* Tab */}
        <Tabs
          defaultValue="dzuhur"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full h-[48px] grid grid-cols-2 bg-transparent border border-[#27272A]">
            <TabsTrigger value="dzuhur" className="text-[14px] data-[state=active]:bg-[#151419] data-[state=active]:text-white text-white/50">
              Dzuhur
            </TabsTrigger>
            <TabsTrigger value="ashar" className="text-[14px] data-[state=active]:bg-[#151419] data-[state=active]:text-white text-white/50">
              Ashar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dzuhur" className="mt-0 focus-visible:ring-0 outline-none">
            <ListContent />
          </TabsContent>
          <TabsContent value="ashar" className="mt-0 focus-visible:ring-0 outline-none">
            <ListContent />
          </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
};

export function formatToWIB(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'Asia/Jakarta',
  };
  return `${new Intl.DateTimeFormat('en-EN', options).format(date)} WIB`;
}

interface ItemProps { siswi: DataAbsensi; }

const Item = ({ siswi }: ItemProps) => {
  return (<>
    <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[15px] flex justify-between items-center">
      <div className="flex items-center gap-[10px]">
        <div>
          <p className="text-[14px] font-medium text-white">{siswi.tbl_siswi.nama_lengkap}</p>
          <p className="text-[12px] font-normal text-white/60">{siswi.tbl_siswi.kelas} ({siswi.tbl_siswi.nis})</p>
        </div>
      </div>
      <div className="text-[10px] font-normal text-white/80">
        {formatToWIB(siswi.waktu_input)}
      </div>
    </li>
    <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[15px] flex justify-between items-center">
      <div className="flex items-center gap-[10px]">
        <div>
          <p className="text-[14px] font-medium text-white">Lorem ipsum dolor sit amet</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </div>
      </div>
      <div className="text-[10px] font-normal text-white/80">
        {formatToWIB(siswi.waktu_input)}
      </div>
    </li>
    <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[15px] flex justify-between items-center">
      <div className="flex items-center gap-[10px]">
        <div>
          <p className="text-[14px] font-medium text-white">Lorem ipsum dolor sit amet</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </div>
      </div>
      <div className="text-[10px] font-normal text-white/80">
        {formatToWIB(siswi.waktu_input)}
      </div>
    </li>
    <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[15px] flex justify-between items-center">
      <div className="flex items-center gap-[10px]">
        <div>
          <p className="text-[14px] font-medium text-white">Lorem ipsum dolor sit amet</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </div>
      </div>
      <div className="text-[10px] font-normal text-white/80">
        {formatToWIB(siswi.waktu_input)}
      </div>
    </li>
    <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[15px] flex justify-between items-center">
      <div className="flex items-center gap-[10px]">
        <div>
          <p className="text-[14px] font-medium text-white">Lorem ipsum dolor sit amet</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </div>
      </div>
      <div className="text-[10px] font-normal text-white/80">
        {formatToWIB(siswi.waktu_input)}
      </div>
    </li>

  </>
  );
};

export const getToday = () => new Date().toISOString().split('T')[0];

export default HistoryAbsen;