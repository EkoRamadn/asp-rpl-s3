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
import { Separator } from '@/components/ui/separator';

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
      <ScrollArea className="h-[45vh] w-full pr-4">
        <div className="flex flex-col gap-1 py-2">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loading />
            </div>
          ) : data.length > 0 ? (
            data.map((item) => <Item siswi={item} key={item.id} />)
          ) : (
            <div className="flex flex-col items-center justify-center p-10 text-zinc-600 gap-4 h-[300px]">
              <Icon icon="material-symbols:inbox" width={48} height={48} className="opacity-80" />
              <p className="text-[12px] font-medium opacity-80">No activity recorded today</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <Separator className="bg-[#3F3F3F] mt-2" />

      <div className="flex items-center justify-center gap-2 p-4 opacity-50">
        <Icon icon="lucide:refresh-cw" className="text-[10px]" />
        <p className="text-[10px] font-bold">Resets daily at 00:00 WIB</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[95%] max-w-lg rounded-2xl bg-[#151419] border-[#3F3F3F] p-0 overflow-hidden shadow-2xl shadcn-default">
        <DialogHeader className="p-6 border-b border-[#3F3F3F]">
          <DialogTitle className="flex items-center text-xl font-bold tracking-tight text-white gap-3">
            <Icon icon="mingcute:time-line" className="text-primary" width={24} />
            History Log
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Tabs
            defaultValue="dzuhur"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 mb-6">
              <TabsTrigger
                value="dzuhur"
                className="text-xs font-bold uppercase tracking-widest"
              >
                Dzuhur
              </TabsTrigger>
              <TabsTrigger
                value="ashar"
                className="text-xs font-bold uppercase tracking-widest"
              >
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function formatToWIB(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: 'Asia/Jakarta',
  };
  return `${new Intl.DateTimeFormat('en-EN', options).format(date)} WIB`;
}

interface ItemProps { siswi: DataAbsensi; }

const Item = ({ siswi }: ItemProps) => {
  return (
    <li className="bg-[#27272A]/30 border border-[#3F3F3F] rounded-[10px] p-[15px] flex justify-between items-center">
      <div className="flex items-center gap-[10px]">
        <div>
          <p className="text-[14px] font-medium text-white">
            {siswi.tbl_siswi.nama_lengkap}
          </p>
          <p className="text-[12px] font-normal text-white/60">
            {siswi.tbl_siswi.kelas} ({siswi.tbl_siswi.nis})
          </p>
        </div>
      </div>
      <div className="text-[10px] font-normal text-white/80">
        {formatToWIB(siswi.waktu_input)}
      </div>
    </li>
  );
};

export const getToday = () => new Date().toISOString().split('T')[0];

export default HistoryAbsen;