"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { Icon } from "@iconify/react";
import { toast } from "sonner";

export default function HeaderActions() {
    const router = useRouter();

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        toast.success("Logged out successfully");
        router.push('/login');
    }

    return (
        <div className='flex flex-row w-fit h-fit gap-3 py-[10px] justify-end'>
            <Link href="/dashboard/notifications">
                <Button
                    variant="ghost"
                    className="h-12 gap-2 text-white/60 hover:text-white hover:bg-white/5 border-none"
                >
                    <Icon icon="tabler:notification" width={20} />
                    Notification
                </Button>
            </Link>

            <Button
                variant="ghost"
                onClick={logout}
                className="h-12 gap-2 text-white/60 hover:text-red-400 hover:bg-red-400/10 border-none transition-colors"
            >
                <Icon icon="material-symbols:logout" width={20} />
                Logout
            </Button>
        </div>
    );
}