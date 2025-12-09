import SearchBar from "@/components/custom/SearchBar";
import Button from "./ui/Button"
import Iconify from '@/components/custom/ui/Iconify';

function HeaderDesktop() {
    return (
        <>
            <div className="flex flex-row w-full h-fit items-center justify-between p-[15px] border border-green-500">
                <div className="flex flex-row w-fit h-fit p-[15px] border border-red-500">
                    <button className="flex flex-row w-[150px] h-fit items-center justify-center gap-[10px] p-[10px] bg-[#27272A] border border-[#3F3F3F] font-medium text-[15px]">
                        <Iconify icon="mdi:user" />
                        <p>Students</p>
                    </button>
                    <button className="flex flex-row w-[150px] h-fit items-center justify-center gap-[10px] p-[10px] bg-[#151419] border border-[#3F3F3F] font-medium text-[15px]">
                        <Iconify icon="mdi:user" />
                        <p>Students</p>
                    </button>
                    <button className="flex flex-row w-[150px] h-fit items-center justify-center gap-[10px] p-[10px] bg-[#151419] border border-[#3F3F3F] font-medium text-[15px]">
                        <Iconify icon="mdi:user" />
                        <p>Students</p>
                    </button>
                </div>
                <div className="flex flex-row w-full h-fit border border-blue-500">
                    <div className="flex flex-row w-[500px] h-fit items-center justify-between p-[10px] bg-[#151419]">
                        <p className="font-medium text-[14px] text-[#B3B3B3]">Search Student...</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderDesktop