'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AbsesiStatus, NewAbsensi, Sholat, Siswi } from '../types/global';
import { addDataAbsensi } from '../logic/addDataAbsensi';
import { useError } from '@/hooks/useError';
import { checkTimeShoolat } from '@/lib/utils';

const formSchema = z.object({
  nama_lengkap: z.string().min(2, 'Minimal 2 karakter'),
  nis: z.string().min(6, 'minimal 6 karakter'),
  kelas: z.string().min(3, 'minimal 3 karakter'),
  catatan: z.string().min(1, 'Pilih salah satu role'),
});

interface AbsensiFormProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  dataSiswi: Siswi | null;
  setNAbsen: (value: boolean) => void;
  setNAbsensi: (value: AbsesiStatus) => void;
  sholat: Sholat;
}

export function AbsensiForm({
  isOpen,
  setIsOpen,
  dataSiswi,
  setNAbsen,
  setNAbsensi,
  sholat,
}: AbsensiFormProps) {
  const { showError } = useError();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama_lengkap: '',
      nis: '',
      kelas: '',
      catatan: '',
    },
  });

  useEffect(() => {
    if (dataSiswi) {
      form.reset({
        nama_lengkap: dataSiswi.nama_lengkap,
        nis: dataSiswi.nis,
        kelas: dataSiswi.kelas,
        catatan: '',
      });
    }
  }, [dataSiswi, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const sholatTime = checkTimeShoolat(sholat);
    if (sholatTime === 'NaV') {
      showError('Sesi Sholat Tidak Tersedia');
      form.reset();
      return;
    }
    const data: NewAbsensi = {
      id_siswi: !!dataSiswi?.id ? Number(dataSiswi.id) : 0,
      status: 'haid',
      keterangan: values.catatan,
      waktu: sholatTime,
      tanggal: new Date(),
      waktu_input: new Date(),
    };
    addDataAbsensi(data).then((result) => {
      setIsOpen(false);
      setNAbsen(true);
      setNAbsensi({
        id: values.nis,
        nama_lengkap: values.nama_lengkap,
        nis: values.nis,
        kelas: values.kelas,
        status: result.status,
        message: result.message,
      });
      form.reset();
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="dark:bg-[#151419]">
        <AlertDialogHeader>
          <AlertDialogTitle>Data Siswi</AlertDialogTitle>
          <AlertDialogDescription>Masukkan informasi Siswi.</AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_lengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input className="py-5 rounded-[7px]" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-[5px] ">
              <FormField
                control={form.control}
                name="nis"
                render={({ field }) => (
                  <FormItem className="flex-2">
                    <FormLabel>NIS</FormLabel>
                    <FormControl>
                      <Input className="py-5 rounded-[7px]" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kelas"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Kelas</FormLabel>
                    <FormControl>
                      <Input className="py-5 rounded-[7px]" disabled {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="catatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full py-5 rounded-[7px]">
                      <SelectValue placeholder="Beri Catatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ketinggalan">Ketinggalan</SelectItem>
                      <SelectItem value="Hilang">Hilang</SelectItem>
                      <SelectItem value="Pembuatan">Pembuatan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="mt-10">
              <AlertDialogCancel type="button" className="py-6 rounded-[7px]">
                Cancel
              </AlertDialogCancel>

              <Button type="submit" className="py-6 rounded-[7px]">
                Submit
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
