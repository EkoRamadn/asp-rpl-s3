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
import { Button } from '@/components/custom/ui/buttons';
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
import { Icon } from '@iconify/react';

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
      <AlertDialogContent className="w-[100%] rounded-[12px] bg-[#151419] border-[#27272A] text-white">
        <AlertDialogHeader className="text-left space-y-2">
          <AlertDialogTitle className="flex items-center text-[18px] font-bold gap-[10px] mb-[10px]">
            <Icon icon="mdi:form-outline" width={24} height={24} />Manual Entry</AlertDialogTitle>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nama_lengkap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[14px] text-white font-medium">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#27272A] border-none text-white/80 h-[48px] rounded-[7px] disabled:opacity-100 disabled:cursor-not-allowed"
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nis"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[14px] text-white font-medium">Student ID (NIS)</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#27272A] border-none text-white/80 h-[48px] rounded-[7px] disabled:opacity-100 disabled:cursor-not-allowed"
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kelas"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-[14px] text-white font-medium">Class</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#27272A] border-none text-white/80 h-[48px] rounded-[7px] disabled:opacity-100 disabled:cursor-not-allowed"
                        disabled
                        {...field}
                      />
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
                  <FormLabel className="text-[14px] text-white font-medium">Reason</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[#27272A] border-none !text-white w-full !h-[48px] rounded-[7px]">
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ketinggalan">Forgot ID Card</SelectItem>
                      <SelectItem value="Hilang">Lost ID Card</SelectItem>
                      <SelectItem value="Ijin">Sick/Permission</SelectItem>
                      <SelectItem value="Pembuatan">Pembuatan</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-[10px]">
              <AlertDialogCancel
                type="button"
                className="h-[48px]"
              >
                Cancel
              </AlertDialogCancel>

              <Button
                type="submit"
                variant="default"
                size="mobile"
              >
                Submit
              </Button>
            </div>

          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
