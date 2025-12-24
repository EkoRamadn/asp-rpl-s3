import { useCallback, useEffect, useState } from 'react';
import { AbsesiStatus, Sholat, Siswi } from '../types/global';
import { useError } from '@/hooks/useError';
import { getDataSiswi } from '../logic/getDataSiswi';

import { Icon } from '@iconify/react';
import { AbsensiForm } from './AbsensiForm';
import { Loading } from './Loading';
import { InputForm } from '@/components/custom/ui/input-form';


interface ManualInputProps {
  setPick: (siswi: AbsesiStatus) => void;
  setNAbsen: (value: boolean) => void;
  sholatTime: Sholat;
}

export const ManualAbsensi = ({ setPick, setNAbsen, sholatTime }: ManualInputProps) => {
  const [data, setData] = useState<Siswi[]>([]);
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState<Siswi | null>(null);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>();
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { showError } = useError();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getDataSiswi(debouncedSearch)
      .then((result) => {
        if (result.status === 'fail' || !result.data) {
          showError(result.message);
          setData([]);
        } else {
          setData(result.data.siswi);
        }
      })
      .catch((err) => {
        showError(err);
        setData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedSearch, showError]);

  const handleClick = useCallback((siswi: Siswi) => {
    setSelect(siswi);
    setOpen(true);
  }, []);

  return (
    <div className="p-2 flex-1 flex flex-col h-full">
      <form className="mb-4 relative w-full h-max">

        <InputForm
          placeholder="Search Name/NISN: "
          className="flex w-full h-fit items-center justify-between p-[10px] text-white text-[14px] placeholder:text-white/50 rounded-[12px] outline-none border border-[#3F3F3F]"
          value={search}
          onChange={(e) => {
            setIsLoading(true);
            setSearch(e.target.value);
          }}
        />
        <Icon
          icon="material-symbols:database-search"
          width="20"
          height="20"
          className="absolute top-1/2 -translate-y-1/2 right-2"
        />
      </form>

      <ul className="flex flex-col gap-2 overflow-auto flex-1">
        {data.length > 0 ? (
          isLoading ? (
            <Loading />
          ) : (
            data.map((item) => (
              <Item key={item.nis} siswi={item} handleClick={() => handleClick(item)} />
            ))
          )
        ) : (<>
          <p className="text-center text-[16px] font-extrabold pt-[30px] text-white/60">No results found</p>
          <p className="text-center text-[14px] font-normal text-white/60">Please try a different keyword</p>
        </>
        )}
      </ul>

      {select && (
        <AbsensiForm
          setNAbsensi={setPick}
          isOpen={open}
          setIsOpen={() => setOpen(!open)}
          dataSiswi={select}
          setNAbsen={setNAbsen}
          sholat={sholatTime}
        />
      )}
    </div>
  );
};

type ItemProps = {
  siswi: Siswi;
  handleClick: (data: { siswi: Siswi }) => void;
};

const Item = ({ siswi, handleClick }: ItemProps) => {
  return (
    // <div className="flex flex-col bg-[#151419] border border-[#3F3F3F] rounded-[12px]">
    //   <button
    //     onClick={() => handleClick({ siswi })}
    //     className="flex p-[15px] w-full h-fit justify-between items-center">
    //     <p className="text-[14px] font-medium">{siswi.nama_lengkap}</p>
    //   </button>
    // </div>
    <>
      <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[10px] flex items-start justify-start">
        <button className="flex flex-col gap-[10px] w-full text-left" onClick={() => handleClick({ siswi })}>
          <p className="text-[14px] font-medium text-white">{siswi.nama_lengkap}</p>
          <p className="text-[12px] font-normal text-white/60">{siswi.kelas} ({siswi.nis})</p>
        </button>
      </li>
      <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[10px] flex items-start justify-start">
        <button className="flex flex-col gap-[10px] w-full text-left" onClick={() => handleClick({ siswi })}>
          <p className="text-[14px] font-medium text-white">Handika Rado Arganata</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </button>
      </li>
      <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[10px] flex items-start justify-start">
        <button className="flex flex-col gap-[10px] w-full text-left" onClick={() => handleClick({ siswi })}>
          <p className="text-[14px] font-medium text-white">Handika Rado Arganata</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </button>
      </li>
      <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[10px] flex items-start justify-start">
        <button className="flex flex-col gap-[10px] w-full text-left" onClick={() => handleClick({ siswi })}>
          <p className="text-[14px] font-medium text-white">Handika Rado Arganata</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </button>
      </li>
      <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[10px] flex items-start justify-start">
        <button className="flex flex-col gap-[10px] w-full text-left" onClick={() => handleClick({ siswi })}>
          <p className="text-[14px] font-medium text-white">Handika Rado Arganata</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </button>
      </li>
      <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[10px] flex items-start justify-start">
        <button className="flex flex-col gap-[10px] w-full text-left" onClick={() => handleClick({ siswi })}>
          <p className="text-[14px] font-medium text-white">Handika Rado Arganata</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </button>
      </li>
      <li className="bg-[#27272A]/30 border border-[#27272A] rounded-[10px] p-[10px] flex items-start justify-start">
        <button className="flex flex-col gap-[10px] w-full text-left" onClick={() => handleClick({ siswi })}>
          <p className="text-[14px] font-medium text-white">Handika Rado Arganata</p>
          <p className="text-[12px] font-normal text-white/60">XI MIPA 2 (0123456789)</p>
        </button>
      </li>
    </>
  );
};
