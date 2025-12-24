'use client';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getDataSholat } from './mobile/ui/ramadani/logic/getDataSholat';
import { PrayerTimes, Sholat } from './mobile/ui/ramadani/types/global';

interface CardProps {
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
    const nextTime = order[i + 1]?.time ?? 24 * 60;

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

const getJamDisplay = (sesi: string) => {
  switch (sesi) {
    case 'Fajr': return "04:30 - 06:00";
    case 'Dhuhr': return "11:30 - 13:00";
    case 'Asr': return "15:00 - 16:30";
    case 'Maghrib': return "17:45 - 18:45";
    case 'Isha': return "19:00 - 20:30";
    default: return "--:--";
  }
}

export const Card: React.FC<CardProps> = ({
  className = '',
  sholatTime,
  setSholatTime,
}) => {
  const dt = useMemo(() => new Date(), []);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-US', {
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
    <div className={`bg-[#151419] flex flex-row w-full h-[120px] items-center justify-center gap-[10px] p-[20px] rounded-[12px] border border-[#3F3F3F] ${className}`}>

      <Image
        src="/ARDEN.svg"
        alt="ARDEN"
        className="w-[60px] h-[60px]"
        width={100}
        height={100}
      />

      <div className="flex flex-col w-full h-fit gap-[5px] p-[10px]">
        <p className="font-bold text-[18px] text-white truncate">
          {sholatTime} Prayer Session
        </p>
        <p className="font-medium text-[14px] text-white/80 truncate">
          {formatDate(dt)}
        </p>
        <p className="font-medium text-[12px] text-white/80 truncate">
          {getJamDisplay(sholatTime)}
        </p>
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