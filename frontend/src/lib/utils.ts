import { Sholat } from '@/components/custom/mobile/ui/ramadani/types/global';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTodayDate() {
  const now = new Date();
  return {
    day: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now),
    date: now.getDate(),
    month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now),
    year: now.getFullYear(),

    fullDateString: `${new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(now)}, ${now.getDate()} ${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(now)} ${now.getFullYear()}`,
  };
}

export const formatDMY = (d: Date) => {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

export function checkTimeShoolat(sholat: Sholat): string {
  if (sholat === 'Dhuhr') return 'dzuhur';
  if (sholat === 'Asr') return 'ashar';
  return 'NaV';
}
