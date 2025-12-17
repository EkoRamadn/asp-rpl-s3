"use client";

import { useRouter } from "next/navigation";
import { Button } from '@/components/custom/ui/buttons';
import Iconify from '@/components/custom/mobile/ui/Iconify';

export default function HeaderActions() {
    const router = useRouter();

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        router.push('/login');
    }

    return (

        <div className='flex flex-row w-fit h-fit gap-[10px] p-[10px] justify-end'>
            <Button
                variant="ghost">
                <Iconify icon="tabler:notification" />
                Notification
            </Button>
            <Button
                variant="ghost"
                onClick={logout}>
                <Iconify icon="material-symbols:logout" />
                Logout
            </Button>
        </div>
    );
}