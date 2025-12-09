import Image from "next/image";
import type { ReactNode } from 'react';

interface HeaderProps {
    menu: ReactNode;
}

function Header({ menu }: HeaderProps) {
    return (
        <>
            <div className="flex flex-row w-full h-fit items-center justify-between">
                <div className="flex flex-row w-fit h-fit items-center justify-center gap-[5px]">
                    <Image src="/logo.svg" alt="A" className="w-8 h-[34px]" width={100} height={100} ></Image>
                    <p className="font-bold text-[18px]">ARDEN</p>
                </div>
                <div className="flex flex-row w-fit h-full items-center justify-center gap-5">
                    {menu}
                </div>
            </div>
        </>
    );
}

export default Header