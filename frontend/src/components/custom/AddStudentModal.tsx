'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

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
import { Button } from '@/components/ui/button';
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
        <div className="shadcn-default">
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-[#151419] border-[#3F3F3F] text-white max-w-[600px]">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                        <DialogTitle className="text-[20px] font-bold">
                            {initialData ? "Edit Student" : "Add New Student"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nama_lengkap"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            {fieldState.error ? (
                                                <FormMessage className="text-[14px] font-medium text-red-500" />
                                            ) : (
                                                <FormLabel className="text-white text-[14px]">Full Name</FormLabel>
                                            )}

                                            <FormControl>
                                                <Input
                                                    placeholder="Full Name"
                                                    className={`shadcn-default h-12 focus-visible:ring-1 ${fieldState.error ? 'ring-1 ring-red-500' : ''}`}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nis"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            {fieldState.error ? (
                                                <FormMessage className="text-[14px] font-medium text-red-500" />
                                            ) : (
                                                <FormLabel className="text-white text-[14px]">Student ID (NIS)</FormLabel>
                                            )}

                                            <FormControl>
                                                <Input
                                                    placeholder="0123456789"
                                                    className={`shadcn-default h-12 focus-visible:ring-1 ${fieldState.error ? 'ring-1 ring-red-500' : ''}`}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="kelas"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            {fieldState.error ? (
                                                <FormMessage className="text-[14px] font-medium text-red-500" />
                                            ) : (
                                                <FormLabel className="text-white">Class</FormLabel>
                                            )}

                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="shadcn-default w-full !h-12 text-white">
                                                        <SelectValue placeholder="Select Class" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="shadcn-default bg-[#27272A] border-[#3F3F3F] text-white">
                                                    <SelectItem value="X MIPA 1">X MIPA 1</SelectItem>
                                                    <SelectItem value="XI MIPA 1">XI MIPA 1</SelectItem>
                                                    <SelectItem value="XII MIPA 1">XII MIPA 1</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            {fieldState.error ? (
                                                <FormMessage className="text-[14px] font-medium text-red-500" />
                                            ) : (
                                                <FormLabel className="text-white">Status</FormLabel>
                                            )}

                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="shadcn-default w-full !h-12 text-white">
                                                        <SelectValue placeholder="Select Status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="shadcn-default bg-[#27272A] border-[#3F3F3F] text-white">
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="unactive">Unactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        {fieldState.error ? (
                                            <FormMessage className="text-[14px] font-medium text-red-500" />
                                        ) : (
                                            <FormLabel className="text-white">Notes</FormLabel>
                                        )}
                                        <FormControl>
                                            <Textarea
                                                placeholder="Type your notes here."
                                                className={`shadcn-default min-h-[100px] resize-none ${fieldState.error ? 'ring-1 ring-red-500' : ''}`}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={onClose}
                                    className="h-12 px-6 border-[#3F3F3F] text-white hover:bg-[#27272A]"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="h-12 px-6 bg-white text-black hover:bg-white/90 font-semibold"
                                >
                                    {initialData ? "Update Student" : "Save Student"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
                <AlertDialogContent className="bg-[#151419] border-[#3F3F3F] text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                        <div className="text-white/60 text-sm">
                            Are you sure you want to save this data? This will be recorded in the system.
                        </div>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <AlertDialogCancel
                            className="bg-transparent border-[#3F3F3F] text-white hover:bg-[#27272A] h-12 px-6"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <Button
                            onClick={handleFinalSave}
                            className="bg-white text-black hover:bg-white/90 h-12 px-6 font-semibold"
                        >
                            Save
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}