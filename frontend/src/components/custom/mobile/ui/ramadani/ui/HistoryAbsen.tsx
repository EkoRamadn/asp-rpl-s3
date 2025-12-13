'use client';

import { useEffect, useState } from 'react';
import { HeaderMobile } from './HeaderMobile';
import { Icon } from '@iconify/react';
import { BtnHistory } from './BtnHistory';
import { DataAbsensi, Sholat, SholatTimes } from '../types/global';
import { Loading } from '../components/Loading';
import { getDataAbsensi } from '../logic/getDataAbsensi';
import { useError } from '@/hooks/useError';
import { checkTimeShoolat } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryAbenProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  sholat: Sholat;
}

const HistoryAbsen = ({ isOpen, setIsOpen, sholat }: HistoryAbenProps) => {
  // useEffect(() => {
  //     if (isOpen) {
  //     } else {
  //         const timer = setTimeout(() => { }, 300);
  //         return () => clearTimeout(timer);
  //     }
  // }, [isOpen]);

  const handleBack = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`
                fixed inset-0 w-dvw h-dvh dark:bg-[#060610]
                transition-all duration-1000  z-9999 rounded-sm ease-in-out p-4
                ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-100 translate-x-full'}
            `}
    >
      <HeaderMobile>
        <div className="right h-max flex gap-[5px] items-center dark:text-stone-400">
          <button onClick={handleBack} className="flex px-2 py-2 gap-[5px] items-center">
            <Icon icon="lets-icons:back" width="20" height="20" />
            <span className="font-semibold font-mono text-[12px]">Back</span>
          </button>
        </div>
      </HeaderMobile>
      <TabHistory sholat={sholat} />
    </div>
  );
};

export function formatToWIB(dateString: string) {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  };

  const time = new Intl.DateTimeFormat('id-ID', options).format(date);

  return `${time} WIB`;
}

interface ItemProps {
  siswi: DataAbsensi;
}

const Item = ({ siswi }: ItemProps) => {
  return (
    <li>
      <button className="flex justify-between  w-full items-center p-3 dark:focus:bg-[#27272a7a]">
        <div className="flex items-center justify-start gap-2.5">
          <div className="avatar">
            <Icon icon="carbon:user-avatar-filled" width="40" height="40" />
          </div>
          <div className="data gap-[5px] text-start">
            <p className="text-[14px] font-mono font-bold">{siswi.tbl_siswi.nama_lengkap}</p>
            <span className="text-[8px] font-medium">
              {siswi.tbl_siswi.kelas} ({siswi.tbl_siswi.nis})
            </span>
          </div>
        </div>
        <div className="time flex justify-center items-center">
          <span className="text-[8px]">{formatToWIB(siswi.waktu_input)}</span>
        </div>
      </button>
    </li>
  );
};

export default HistoryAbsen;

export const getToday = () => {
  return new Date().toISOString().split('T')[0];
};

const TabHistory = ({ sholat }: { sholat: Sholat }) => {
  const [state, setState] = useState<'left' | 'right'>('left');
  const [data, setData] = useState<DataAbsensi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { showError } = useError();

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    const sholatTime = checkTimeShoolat(sholat);
    if (sholatTime === 'NaV') {
      showError('Sesi Sholat Tidak Tersedia');
      return;
    }

    const currentSholat: SholatTimes = state === 'left' ? 'dzuhur' : 'ashar';

    setIsLoading(true);

    getDataAbsensi(getToday().toString(), currentSholat)
      .then((result) => {
        if (result.status === 'fail' || !result.data) {
          showError(result.message);
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
  }, [state, sholat, showError]);

  return (
    <div className="tab-history border border-input rounded-tl-[10px] rounded-tr-[10px] mb-5 h-full mt-2">
      <div className="head flex w-full">
        <BtnHistory
          value="Dhuhur Player"
          Ico="mingcute:time-line"
          className="rounded-tl-[10px]"
          isActive={state === 'left'}
          on={() => setState('left')}
        />
        <BtnHistory
          value="Ashar Player"
          Ico="mingcute:time-line"
          className="rounded-tr-[10px]"
          isActive={state === 'right'}
          on={() => setState('right')}
        />
      </div>

      <div className="content dark:bg-[#151419] h-full">
        <div className="dez text-[8px] text-stone-500 flex items-center justify-center py-2">
          <Icon icon="material-symbols:info-outline" width="12.5" height="12.5" />
          <p>Sorted by latest activity. List resets daily at 00:00 WIB.</p>
        </div>
        <ScrollArea className="h-full w-full  ">
          <ul>
            {isLoading ? (
              <Loading />
            ) : data.length > 0 ? (
              data.map((item) => <Item siswi={item} key={item.id} />)
            ) : (
              <p className="text-center py-5">Siswi belum ada absensi</p>
            )}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
};
