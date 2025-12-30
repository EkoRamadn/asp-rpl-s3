'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
  nis: z.string().min(6, 'Minimal 6 karakter'),
  kelas: z.string().min(3, 'Minimal 3 karakter'),
  catatan: z.string().min(1, 'Pilih salah satu alasan'),
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
  const [isPending, setIsPending] = useState(false);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true);
    const sholatTime = checkTimeShoolat(sholat);

    if (sholatTime === 'NaV') {
      toast.error("Sesi Sholat Tidak Tersedia");
      setIsPending(false);
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

    try {
      const result = await addDataAbsensi(data);
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
      toast.success("Absensi berhasil dicatat!");
      form.reset();
    } catch (error) {
      toast.error("Gagal mencatat absensi");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="shadcn-default">
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="w-[95%] max-w-lg rounded-xl bg-[#151419] border-[#3F3F3F] p-0 overflow-hidden shadow-2xl shadcn-default">
          <AlertDialogHeader className="p-6 border-b border-[#3F3F3F]">
            <AlertDialogTitle className="flex items-center gap-3 text-xl font-semibold tracking-tight text-white">
              <Icon icon="mdi:form-outline" className="text-primary" />
              Manual Entry
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="nama_lengkap"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 bg-muted/50 border-[#3F3F3F] text-white"
                          disabled
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nis"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">NIS</FormLabel>
                        <FormControl>
                          <Input
                            className="h-12 bg-muted/50 border-[#3F3F3F] text-white"
                            disabled
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="kelas"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">Class</FormLabel>
                        <FormControl>
                          <Input
                            className="h-12 bg-muted/50 border-[#3F3F3F] text-white"
                            disabled
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="catatan"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      {/* Logika Ganti Label Jadi Error */}
                      <FormLabel className={`text-sm font-medium ${form.formState.errors.catatan ? "text-destructive" : "text-white"}`}>
                        {form.formState.errors.catatan ? form.formState.errors.catatan.message : "Reason"}
                      </FormLabel>

                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={`!h-12 w-full border-[#3F3F3F] text-white ${form.formState.errors.catatan && "border-destructive"}`}>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#151419] border-[#3F3F3F]">
                          <SelectItem value="Ketinggalan">Forgot ID Card</SelectItem>
                          <SelectItem value="Hilang">Lost ID Card</SelectItem>
                          <SelectItem value="Ijin">Sick/Permission</SelectItem>
                          <SelectItem value="Pembuatan">Pembuatan</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <AlertDialogCancel asChild>
                    <Button variant="outline" className="h-12 px-6 border-[#3F3F3F]">
                      Cancel
                    </Button>
                  </AlertDialogCancel>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-12 px-6 min-w-[120px]"
                  >
                    {isPending ? (
                      <>
                        <Icon icon="lucide:loader-2" className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : "Submit Entry"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}