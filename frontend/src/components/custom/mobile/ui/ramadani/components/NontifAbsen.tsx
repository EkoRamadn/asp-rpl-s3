'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { AbsesiStatus } from '../types/global';

interface NontifAbsenPopup {
  isOpen: boolean;
  absensiStatus: AbsesiStatus | undefined;
  setOpen: (value: boolean) => void;
}

export function NotifAbsen({ isOpen, absensiStatus, setOpen }: NontifAbsenPopup) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  return (
    <div
      className="
            fixed inset-0 flex items-center justify-center
            bg-black/40 backdrop-blur-sm
            transition-opacity duration-200
            z-9999
            "
      style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div
        className="
                w-[90%] max-w-sm rounded-xl p-5
                bg-white dark:bg-[#27272A] shadow-xl
                transform transition-all duration-200
                "
        style={{
          opacity: isOpen ? 1 : 0,
          translate: isOpen ? '0 0' : '0 20px',
        }}
      >
        <h2 className="text-lg font-semibold mb-1">Absensi Status</h2>

        <div className="space-y-1 mb-4">
          <p className="font-medium">{absensiStatus?.nama_lengkap}</p>
          <p className="text-sm opacity-70">{absensiStatus?.nis}</p>
          <p className="pt-2 text-green-600 font-semibold">
            {absensiStatus?.status === 'succes' ? 'Berhasil' : absensiStatus?.message}
          </p>
        </div>

        <Button className="rounded-none w-full" onClick={() => setOpen(false)}>
          OK
        </Button>
      </div>
    </div>
  );
}
