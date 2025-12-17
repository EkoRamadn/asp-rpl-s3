'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Iconify from "@/components/custom/mobile/ui/Iconify";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/ui/buttons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const formSchema = z.object({
    name: z.string().min(1, 'Class Name is required'),
    angkatan: z.string().min(1, 'Batch (Angkatan) is required'),
});

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function AddClassModal({ isOpen, onClose, initialData }: AddClassModalProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: '', angkatan: '' },
    });

    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [pendingValues, setPendingValues] = useState<any>(null);

    useEffect(() => {
        if (isOpen && initialData) {
            form.reset({
                name: initialData.name,
                angkatan: initialData.angkatan,
            });
        } else {
            form.reset({ name: '', angkatan: '' });
        }
    }, [isOpen, initialData, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setPendingValues(values);
        setShowSaveConfirm(true);
    }

    const handleFinalSave = () => {
        console.log("DATA KELAS DISIMPAN:", pendingValues);
        toast.success("Class has been saved successfully!");
        setShowSaveConfirm(false);
        onClose();
    };

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={onClose}>
                <AlertDialogContent className="bg-[#151419] border border-[#3F3F3F]">
                    <div className="flex items-center justify-between mb-[25px]">
                        <AlertDialogTitle className="text-[20px] font-bold text-white">
                            {initialData ? "Edit Class" : "Add New Class"}
                        </AlertDialogTitle>
                        <button onClick={onClose} type="button" className="text-white/50 hover:text-white"><Iconify icon="mdi:close" size={24} /></button>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[20px]">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel className="text-white">Class Name</FormLabel><FormControl><Input {...field} className="bg-[#27272A] border-none text-white h-12" placeholder="e.g. XII MIPA 1" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="angkatan" render={({ field }) => (
                                <FormItem><FormLabel className="text-white">Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="bg-[#27272A] border-none text-white w-full !h-12"><SelectValue placeholder="Select Batch" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="X">x</SelectItem>
                                            <SelectItem value="XI">xi</SelectItem>
                                            <SelectItem value="XII">xii</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage /></FormItem>
                            )} />
                            <div className="flex justify-end gap-3 mt-4">
                                <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
                <AlertDialogContent className="bg-[#151419] text-white border border-[#3F3F3F]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                        <div className="text-white/60 text-sm">Are you sure you want to save this class data?</div>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setShowSaveConfirm(false)}>Cancel</Button>
                        <Button onClick={handleFinalSave}>Confirm</Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}