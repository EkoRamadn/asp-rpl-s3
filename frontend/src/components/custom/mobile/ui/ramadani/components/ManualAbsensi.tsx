import { useCallback, useEffect, useState } from 'react';
import { AbsesiStatus, Sholat, Siswi } from '../types/global';
import { useError } from '@/hooks/useError';
import { getDataSiswi } from '../logic/getDataSiswi';
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/react';
import { AbsensiForm } from './AbsensiForm';
import { Loading } from './Loading';

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
        <Input
          placeholder="Cari Nama / NIS"
          className="py-5 pr-7"
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
        ) : (
          <p className="text-center py-5">Siswi Tidak Ditemukan</p>
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
    <li>
      <button
        onClick={() => handleClick({ siswi })}
        className="flex p-3 dark:bg-[#27272A] w-full rounded-[10px] border justify-between items-center"
      >
        <div className="left text-start">
          <p className="text-[16px] font-semibold">{siswi.nama_lengkap}</p>
          <p className="text-[14px] font-light">{siswi.nis}</p>
        </div>

        <div className="right">
          <p>{siswi.kelas}</p>
        </div>
      </button>
    </li>
  );
};
