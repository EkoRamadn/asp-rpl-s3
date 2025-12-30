'use client';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { AbsesiStatus } from '../types/global';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

interface NontifAbsenPopup {
  isOpen: boolean;
  absensiStatus: AbsesiStatus | undefined;
  setOpen: (value: boolean) => void;
}

export function NotifAbsen({ isOpen, absensiStatus, setOpen }: NontifAbsenPopup) {
  const [show, setShow] = useState(isOpen);
  const isSuccess = absensiStatus?.status === 'succes';

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
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 z-[9999]"
      style={{ opacity: isOpen ? 1 : 0 }}
    >
      <div
        className="w-[80%] max-w-[300px] rounded-[28px] bg-[#151419] border border-[#3F3F3F] shadow-2xl overflow-hidden transform transition-all duration-200"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(15px)',
        }}
      >
        <div className="flex flex-col items-center p-8 text-center">
          <div className={cn(
            "size-16 rounded-full flex items-center justify-center mb-6",
            isSuccess ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
          )}>
            <Icon icon={isSuccess ? "solar:check-circle-bold" : "solar:danger-bold"} width={40} />
          </div>

          <div className="mb-8">
            <h2 className={cn(
              "text-lg font-bold tracking-tight uppercase",
              isSuccess ? "text-green-500" : "text-destructive"
            )}>
              {isSuccess ? 'Success' : 'Failed'}
            </h2>
            <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2 leading-relaxed">
              {isSuccess ? 'Attendance Recorded' : absensiStatus?.message}
            </p>
          </div>

          <Button
            className="w-full h-12 rounded-2xl text-[11px] font-bold uppercase tracking-[0.15em] active:scale-95 transition-transform"
            onClick={() => setOpen(false)}
          >
            Selesai
          </Button>
        </div>
      </div>
    </div>
  );
}