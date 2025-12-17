'use client';

import { useState } from 'react';
import ScannerQR from '../components/QRAbsensi';
import { NotifAbsen } from '../components/NontifAbsen';
import { ManualAbsensi } from '../components/ManualAbsensi';
import { Sholat } from '../types/global';
import { Button } from '@/components/custom/ui/buttons';
import { Icon } from '@iconify/react';

interface SectionTabProps {
  className?: string;
  sholatTime: Sholat;
}

type Status = 'fail' | 'succes';

interface AbsesiStatus {
  id: string;
  nama_lengkap: string;
  nis: string;
  kelas: string;
  status: Status;
  message: string;
}

export const SectionTab: React.FC<SectionTabProps> = ({ className = '', sholatTime }) => {
  const [state, setState] = useState<'left' | 'right'>('right');
  const [isPick, setIsPick] = useState<AbsesiStatus>();
  const [nAbsen, setNAbsen] = useState<boolean>(false);

  return (
    <div className={`section-tab flex w-full h-[60vh]  flex-col flex-1 ${className}`}>
      <div className="head flex flex-row w-full h-fit items-center justify-center gap-[10px] mb-2.5">
        {/* Button Scan QR Code */}
        <Button
          variant={state === 'left' ? "default" : "secondary"}
          size="mobile"
          className="flex-1"
          onClick={() => setState('left')}
        >
          <Icon icon="bx:scan" width={20} height={20} />Scan QR Code</Button>
        {/* Button Absensi Manual */}
        <Button
          variant={state === 'right' ? "default" : "secondary"}
          size="mobile"
          className="flex-1"
          onClick={() => setState('right')}
        >
          <Icon icon="material-symbols:person-search" width={20} height={20} />
          Manual Entry
        </Button>
      </div>
      <div className="content-Tab body w-full flex-1 dark:bg-[rgb(21,20,25)] rounded-[10px] overflow-hidden">
        {state === 'left' ? (
          <ScannerQR setPick={setIsPick} setNAbsen={setNAbsen} sholat={sholatTime} />
        ) : (
          <ManualAbsensi setPick={setIsPick} setNAbsen={setNAbsen} sholatTime={sholatTime} />
        )}
      </div>
      <NotifAbsen isOpen={nAbsen} absensiStatus={isPick} setOpen={setNAbsen} />
    </div>
  );
};
