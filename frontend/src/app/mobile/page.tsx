'use client';
import { Sholat } from '@/components/custom/mobile/ui/ramadani/types/global';
import { CardThub } from '@/components/custom/mobile/ui/ramadani/ui/CardThub';
import { HeaderMobile } from '@/components/custom/mobile/ui/ramadani/ui/HeaderMobile';
import HistoryAbsen from '@/components/custom/mobile/ui/ramadani/ui/HistoryAbsen';
import { SectionTab } from '@/components/custom/mobile/ui/ramadani/ui/sectionTab';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
      <HeaderMobile className="mb-2.5">
        <div className="right h-max flex gap-[5px] items-center dark:text-stone-400 dark:*:focus:text-white">
          <button
            className="flex px-2 py-2 gap-[5px] items-center"
            onClick={() => showHistory(true)}
          >
            <Icon icon="material-symbols:history" width="20" height="20" />
            <span className="font-semibold font-mono text-[12px]">History</span>
          </button>
          <button className="flex px-2 py-2 gap-[5px] items-center" onClick={logout}>
            <Icon icon="material-symbols:logout" width="20" height="20" />
            <span className="font-semibold font-mono text-[12px]">Logout</span>
          </button>
        </div>
      </HeaderMobile>

      <CardThub className="mb-2.5" sholatTime={sholat} setSholatTime={setSholat} />
      <SectionTab className="flex-1" sholatTime={sholat} />

      <HistoryAbsen isOpen={history} setIsOpen={showHistory} sholat={sholat} />
    </div>
  );
}

export default Page;

// const Absen = () => {
//   return <div>{/* <AlertDialogDemo isOpen={false} /> */}</div>;
// };
