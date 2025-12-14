import { getTodayDate } from '@/lib/utils';
import Image from 'next/image';

interface CardProps {
  jamSesi: string;
  sesi: string;
}

function Card({ jamSesi, sesi }: CardProps) {
  const { fullDateString } = getTodayDate();
  return (
    <div className="bg-[#151419] flex flex-row w-full h-[120px] items-center justify-center gap-2.5 p-5 rounded-2xl border border-[#3F3F3F]">
      <Image
        src="/ARDEN.svg"
        alt="ARDEN"
        className="w-14 h-[67px]"
        width={100}
        height={100}
      ></Image>
      <div className="flex flex-col w-full h-fit gap-[5px] p-2.5">
        <p className="font-bold text-[18px] truncate">{sesi}</p>
        <p className="font-medium text-[14px] truncate">{fullDateString}</p>
        <p className="font-medium text-[12px] truncate">{jamSesi}</p>
      </div>
    </div>
  );
}

export default Card;
