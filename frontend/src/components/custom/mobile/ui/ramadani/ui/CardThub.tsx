'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getDataSholat } from '../logic/getDataSholat';
import { PrayerTimes, Sholat } from '../types/global';

interface CardThubProps {
  className?: string;
  sholatTime: Sholat;
  setSholatTime: (value: Sholat) => void;
}

function getCurrentPrayer(prayers: PrayerTimes): keyof PrayerTimes {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const toMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  };

  const order: { name: keyof PrayerTimes; time: number }[] = [
    { name: 'Fajr', time: toMinutes(prayers.Fajr) },
    { name: 'Dhuhr', time: toMinutes(prayers.Dhuhr) },
    { name: 'Asr', time: toMinutes(prayers.Asr) },
    { name: 'Maghrib', time: toMinutes(prayers.Maghrib) },
    { name: 'Isha', time: toMinutes(prayers.Isha) },
  ];

  for (let i = 0; i < order.length; i++) {
    const thisTime = order[i].time;
    const nextTime = order[i + 1]?.time ?? 24 * 60; // sampai akhir hari

    if (currentMinutes >= thisTime && currentMinutes < nextTime) {
      return order[i].name;
    }
  }

  return 'Isha';
}

// function clock(callback: (time: { hours: number; minutes: number }) => void) {
//     const id = setInterval(() => {
//         const d = new Date();
//         callback({
//             hours: d.getHours(),
//             minutes: d.getMinutes(),
//         });
//     }, 20000);

//     return id; // <<— ini yang kamu pakai buat clearInterval
// }

// const interval = clock((time) => {
//     console.log(time);
// });

export const CardThub: React.FC<CardThubProps> = ({
  className = '',
  sholatTime,
  setSholatTime,
}) => {
  const dt = useMemo(() => new Date(), []);
  const formatDate = (d: Date) =>
    d.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  useEffect(() => {
    getDataSholat(dt).then((result) => {
      setSholatTime(getCurrentPrayer(result));
    });
  }, [dt, setSholatTime]);

  return (
    <div
      className={`card-thub flex gap-2.5 p-5 dark:bg-[rgb(21,20,25)] bg-stone-100 rounded-[10px] items-center ${className}`}
    >
      <div className="left w-[41.65px] h-[49.17px]">
        <Image src="/ARDEN.svg" alt="ICON THUMB" width={100} height={100} />
      </div>

      <div className="right p-2.5 text-start flex flex-col items-start">
        <h2 className="font-bold text-[19px] font-mono mb-1.5">Sesi Sholat {sholatTime}</h2>
        <p className="font-medium font-mono text-[12px]">{formatDate(dt)} </p>
      </div>
    </div>
  );
};

export default function Typewriter() {
  const words: string[] = useMemo(() => ['Hello, World!', 'Welcome to my', 'This is a.'], []);

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];

    if (!isDeleting && subIndex === currentWord.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 5000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && subIndex === 0) {
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
      }, 0);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
      },
      isDeleting ? 60 : 100
    );

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, words]);

  return (
    <div className="w-full h-9 flex justify-start items-center">
      <h2 className="text-[19px] font-mono mb-1.5 font-bold">
        {words[index].substring(0, subIndex)}
      </h2>
    </div>
  );
}

// interface ClockProps {
//   className?: string;
// }

// const Clock: React.FC<ClockProps> = React.memo(({ className = "" }) => {
//     const [hour, setHour] = useState<number>();
//     const [minute, setMinute] = useState<number>();

//     useEffect(() => {
//         const interval = setInterval(() => {
//             const h = new Date()
//             setHour(h.getHours())
//             setMinute(h.getMinutes())
//         }, 1000);
//         return () => clearInterval(interval);
//     }, []);

//     return <span className={`${className}`}>{hour}:{minute}</span>;
// });

// // contoh stop interval
// setTimeout(() => {
//     clearInterval(interval);
//     console.log("Interval stopped");
// }, 100000);
