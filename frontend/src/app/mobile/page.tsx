'use client';

import { HeaderMobile } from '@/components/custom/HeaderMobile';
import { Card } from '@/components/custom/Card';
import { Sholat } from '@/components/custom/mobile/ui/ramadani/types/global';
import HistoryAbsen from '@/components/custom/mobile/ui/ramadani/ui/HistoryAbsen';
import { SectionTab } from '@/components/custom/mobile/ui/ramadani/ui/sectionTab';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


function Page() {
  const [history, showHistory] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [sholat, setSholat] = useState<Sholat>('Dhuhr');
  const route = useRouter();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');

    route.push('/login');
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-dvh w-full flex items-center justify-center">
        <div className="content flex justify-center items-center flex-col">
          <Image src="/splash.svg" alt="Arden Logo" width={60} height={60} />
          {/* <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-400 border-t-transparent"></div> */}
          <div className="flex space-x-2 justify-center items-center h-max dark:invert mt-2.5">
            {/* <span className='sr-only'>Loading...</span> */}
            <div className="h-2 w-2 bg-black dark:bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-black dark:bg-stone-400  rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-black dark:bg-stone-400  rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="constiner p-4 h-dvh flex flex-col">
      {/* <HeaderMobile className="mb-2.5"> */}
      {/* <div className="flex flex-row w-fit h-full items-center justify-center gap-[20px] dark:text-white"> */}
      {/* Button Histori Absensi */}
      {/* <Button variant="ghost" size="mobile" onClick={() => showHistory(true)}>
          <Icon icon="material-symbols:history" width={20} height={20} />
          History
        </Button> */}
      {/* Button Logout */}
      {/* <Button variant="ghost" size="mobile" onClick={logout}>
          <Icon icon="material-symbols:logout" width={20} height={20} />
          Logout
        </Button> */}

      <HeaderMobile className="mb-2.5">
        <div className="flex flex-row w-full h-full items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Icon icon="material-symbols:menu" width={24} height={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit bg-[#151419] border-[#27272A] text-white">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* History */}
              <DropdownMenuItem
                onClick={() => showHistory(true)}
                className="cursor-pointer hover:bg-[#27272A] focus:bg-[#27272A] focus:text-white gap-[5px] p-[10px]"
              >
                <Icon icon="material-symbols:history" className="text-white" />
                <span>History</span>
              </DropdownMenuItem>

              {/* Setting */}
              <DropdownMenuItem
                onClick={() => showHistory(true)}
                className="cursor-pointer hover:bg-[#27272A] focus:bg-[#27272A] focus:text-white gap-[5px] p-[10px]"
              >
                <Icon icon="uil:setting" className="text-white" />
                <span>Settings</span>
              </DropdownMenuItem>

              {/* Logout */}
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-[#27272A] focus:bg-[#27272A] gap-[5px] p-[10px]"
              >
                <Icon icon="material-symbols:logout" className="text-red-500" />
                <span>Logout</span>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </HeaderMobile>
      {/* </div> */}
      {/* </HeaderMobile> */}


      {/* Card Sesi Sholat */}
      <Card className="mb-2.5" sholatTime={sholat} setSholatTime={setSholat} />
      {/* Content */}
      <SectionTab className="flex-1" sholatTime={sholat} />
      {/* Geser Tab Histori Absensi */}
      <HistoryAbsen isOpen={history} setIsOpen={showHistory} sholat={sholat} />
    </div>
  );
}

export default Page;

// const Absen = () => {
//   return <div>{/* <AlertDialogDemo isOpen={false} /> */}</div>;
// };
