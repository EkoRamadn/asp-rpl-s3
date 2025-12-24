'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { toast } from "sonner";

const formSchema = z.object({
    nama_lengkap: z.string().min(1, 'Full Name is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    role: z.string().min(1, 'Role is required'),
}).refine((data) => {
    return data.password.length >= 6;
}, {
    message: "Password must be at least 6 characters",
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
        defaultValues: { nama_lengkap: '', username: '', password: '', role: '' },
    });

    const [showSaveConfirm, setShowSaveConfirm] = useState(false);
    const [pendingValues, setPendingValues] = useState<any>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    nama_lengkap: initialData.nama_lengkap,
                    username: initialData.username,
                    role: initialData.role,
                    password: '',
                });
            } else {
                form.reset({ nama_lengkap: '', username: '', password: '', role: '' });
            }
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
        <div className="shadcn-default">
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="bg-[#151419] border-[#3F3F3F] text-white max-w-[550px]">
                    <DialogHeader className="pb-6">
                        <DialogTitle className="text-[20px] font-bold text-white">
                            {initialData ? "Edit User" : "Add New User"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField control={form.control} name="nama_lengkap" render={({ field, fieldState }) => (
                                <FormItem>
                                    {fieldState.error ? (
                                        <FormMessage className="text-[14px] font-medium text-red-500" />
                                    ) : (
                                        <FormLabel className="text-white">Full Name</FormLabel>
                                    )}
                                    <FormControl>
                                        <Input {...field} className={`text-white h-12 focus-visible:ring-1 ${fieldState.error ? 'ring-1 ring-red-500' : ''}`} placeholder="Full Name" />
                                    </FormControl>
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="username" render={({ field, fieldState }) => (
                                    <FormItem>
                                        {fieldState.error ? (
                                            <FormMessage className="text-[14px] font-medium text-red-500" />
                                        ) : (
                                            <FormLabel className="text-white">Username</FormLabel>
                                        )}
                                        <FormControl>
                                            <Input {...field} className={`text-white h-12 focus-visible:ring-1 ${fieldState.error ? 'ring-1 ring-red-500' : ''}`} placeholder="Username" />
                                        </FormControl>
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="password" render={({ field, fieldState }) => (
                                    <FormItem>
                                        {fieldState.error ? (
                                            <FormMessage className="text-[14px] font-medium text-red-500" />
                                        ) : (
                                            <FormLabel className="text-white">Password</FormLabel>
                                        )}
                                        <FormControl>
                                            <Input {...field} type="password" className={`text-white h-12 focus-visible:ring-1 ${fieldState.error ? 'ring-1 ring-red-500' : ''}`} placeholder="******" />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="role" render={({ field, fieldState }) => (
                                <FormItem>
                                    {fieldState.error ? (
                                        <FormMessage className="text-[14px] font-medium text-red-500" />
                                    ) : (
                                        <FormLabel className="text-white">Role</FormLabel>
                                    )}
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={`text-white w-full !h-12 focus:ring-1 ${fieldState.error ? 'ring-1 ring-red-500' : ''}`}>
                                                <SelectValue placeholder="Select Role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-[#27272A] border-[#3F3F3F] text-white">
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Teacher">Teacher</SelectItem>
                                            <SelectItem value="Staff">Staff</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={onClose} className="h-12 px-6 border-[#3F3F3F] text-white hover:bg-[#27272A]">
                                    Cancel
                                </Button>
                                <Button type="submit" className="h-12 px-8 bg-white text-black hover:bg-white/90 font-semibold">
                                    {initialData ? "Update User" : "Save User"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
                <AlertDialogContent className="bg-[#151419] text-white border border-[#3F3F3F]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                        <div className="text-white/60 text-sm">Are you sure you want to save this user data?</div>
                    </AlertDialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <AlertDialogCancel className="bg-transparent border-[#3F3F3F] text-white hover:bg-[#27272A] h-12 px-6">Cancel</AlertDialogCancel>
                        <Button onClick={handleFinalSave} className="bg-white text-black hover:bg-white/90 h-12 px-6 font-semibold">
                            Yes, Save Data
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}