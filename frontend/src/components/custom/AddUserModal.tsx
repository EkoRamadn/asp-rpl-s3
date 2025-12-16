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
import { toast } from "sonner"

const formSchema = z.object({
    nama_lengkap: z.string().min(1, 'Full Name is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().optional(),
    role: z.string().min(1, 'Role is required'),
}).refine((data) => {
    if (data.password && data.password.length > 0 && data.password.length < 6) {
        return false;
    }
    return true;
}, {
    message: "Password must be at least 6 characters if provided",
    path: ["password"],
});

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
}

export default function AddUserModal({ isOpen, onClose, initialData }: AddUserModalProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { nama_lengkap: '', username: '', role: '' },
    });

    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [pendingValues, setPendingValues] = useState<any>(null);

    useEffect(() => {
        if (isOpen && initialData) {
            form.reset({
                nama_lengkap: initialData.nama_lengkap,
                username: initialData.username,
                role: initialData.role,
            });
        } else {
            form.reset({ nama_lengkap: '', username: '', role: '' });
        }
    }, [isOpen, initialData, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        setPendingValues(values);
        setShowSaveConfirm(true);
    }

    const handleFinalSave = () => {
        console.log("DATA USER DISIMPAN:", pendingValues);
        toast.success("User has been saved successfully!");
        setShowSaveConfirm(false);
        onClose();
    };

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={onClose}>
                <AlertDialogContent className="bg-[#151419] border border-[#3F3F3F]">
                    <div className="flex items-center justify-between mb-[25px]">
                        <AlertDialogTitle className="text-[20px] font-bold text-white">
                            {initialData ? "Edit User" : "Add New User"}
                        </AlertDialogTitle>
                        <button onClick={onClose} type="button" className="text-white/50 hover:text-white"><Iconify icon="mdi:close" size={24} /></button>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-[20px]">
                            <FormField control={form.control} name="nama_lengkap" render={({ field }) => (
                                <FormItem><FormLabel className="text-white">Full Name</FormLabel><FormControl><Input {...field} className="bg-[#27272A] border-none text-white h-12" placeholder="Full Name" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="username" render={({ field }) => (
                                <FormItem><FormLabel className="text-white">Username</FormLabel><FormControl><Input {...field} className="bg-[#27272A] border-none text-white h-12" placeholder="Username" /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="password" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" className="bg-[#27272A] border-none text-white h-12" placeholder="******" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="role" render={({ field }) => (
                                <FormItem><FormLabel className="text-white">Role</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger className="bg-[#27272A] border-none text-white w-full !h-12"><SelectValue placeholder="Select Role" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Teacher">Teacher</SelectItem>
                                            <SelectItem value="Staff">Staff</SelectItem>
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
                        <div className="text-white/60 text-sm">Are you sure you want to save this user data?</div>
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