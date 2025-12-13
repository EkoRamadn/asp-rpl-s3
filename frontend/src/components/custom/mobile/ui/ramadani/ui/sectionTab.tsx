'use client';
import { useState } from 'react';

import ScannerQR from '../components/QRAbsensi';

import { NotifAbsen } from '../components/NontifAbsen';
import { ManualAbsensi } from '../components/ManualAbsensi';
import { BtnMobile } from '../components/BtnMobile';
import { Sholat } from '../types/global';

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
      <div className="head flex gap-[5px] w-full mb-2.5">
        <BtnMobile
          value="Scan QR Code"
          Ico="bx:scan"
          on={() => setState('left')}
          isActive={state == 'left'}
        />
        <BtnMobile
          value="Manual Entry"
          Ico="material-symbols:person-search"
          on={() => setState('right')}
          isActive={state == 'right'}
        />
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
