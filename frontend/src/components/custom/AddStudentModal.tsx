'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Iconify from "@/components/custom/mobile/ui/Iconify";

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
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
    nama_lengkap: z.string().min(1, 'Full name is required'),
    nis: z.string().min(1, 'NIS is required'),
    kelas: z.string().min(1, 'Class is required'),
    status: z.string().min(1, 'Status is required'),
    notes: z.string().optional(),
});

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function AddStudentModal({ isOpen, onClose, initialData }: AddStudentModalProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama_lengkap: '',
            nis: '',
            kelas: '',
            status: '',
            notes: '',
        },
    });
    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [pendingValues, setPendingValues] = useState<any>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    nama_lengkap: initialData.name,
                    nis: initialData.nis,
                    kelas: initialData.class,
                    status: initialData.status,
                    notes: initialData.notes || '',
                });
            } else {
                form.reset({
                    nama_lengkap: '',
                    nis: '',
                    kelas: '',
                    status: '',
                    notes: '',
                });
            }
        }
    }, [isOpen, initialData, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setPendingValues(values);
        setShowSaveConfirm(true);
    }

    const handleFinalSave = () => {
        console.log("DATA DISIMPAN:", pendingValues);
        toast.success("Student has been saved successfully!");
        setShowSaveConfirm(false);
        onClose();
    };

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={onClose}>

                <AlertDialogContent className="bg-[#151419]">

                    <div className="flex items-center justify-between mb-[25px]">
                        <AlertDialogTitle className="text-[20px] font-bold text-white">
                            {initialData ? "Edit Student" : "Add New Student"}
                        </AlertDialogTitle>
                        <button onClick={onClose} type="button" className="text-white/50 hover:text-white transition-colors">
                            <Iconify icon="mdi:close" size={24} />
                        </button>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[20px]">

                            <div className="grid grid-cols-2 gap-[20px]">
                                <FormField
                                    control={form.control}
                                    name="nama_lengkap"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[14px] text-white font-medium">Full Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Full Name"
                                                    className="capitalize border-none text-white placeholder:text-white/50 w-full !h-[48px] !rounded-[7px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nis"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[14px] text-white font-medium">Student ID (NIS)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="0123456789"
                                                    className="border-none text-white placeholder:text-white/50 w-full !h-[48px] !rounded-[7px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-[20px]">
                                <FormField
                                    control={form.control}
                                    name="kelas"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[14px] text-white font-medium">Class</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="border-none text-white placeholder:text-white/50 w-full !h-[48px] !rounded-[7px]">
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="X MIPA 1">X MIPA 1</SelectItem>
                                                    <SelectItem value="XI MIPA 1">XI MIPA 1</SelectItem>
                                                    <SelectItem value="XII MIPA 1">XII MIPA</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-[14px] text-white font-medium">Status</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="border-none text-white placeholder:text-white/50 w-full !h-[48px] !rounded-[7px]">
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Unactive">Unactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem className="grid w-full gap-[10px]">
                                        <FormLabel className="text-[14px] text-white font-medium">Notes</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type your notes here."
                                                className="bg-[#27272A] border-none text-white min-h-[100px] resize-none placeholder:text-white/50 w-full !rounded-[7px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex flex-row gap-[15px] mt-[10px] justify-end">
                                <AlertDialogCancel
                                    type="button"
                                    className="h-11 px-4 py-2 text-[15px]"
                                    onClick={onClose}
                                >
                                    Cancel
                                </AlertDialogCancel>

                                <Button
                                    type="submit"
                                >
                                    Save
                                </Button>
                            </div>

                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>

            {/* Pop-up konfirmasi */}
            <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
                <AlertDialogContent className="bg-[#151419] text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                        <div className="text-white/60 text-sm">
                            Are you sure you want to save this data?
                        </div>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <AlertDialogCancel type="button" className="h-11 px-4 py-2 text-[15px]" onClick={() => setShowSaveConfirm(false)}>Cancel</AlertDialogCancel>
                        <Button onClick={handleFinalSave}>Confirm</Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}