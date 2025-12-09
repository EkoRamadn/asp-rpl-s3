"use client";

import Header from "@/components/custom/Header";
import Button from "@/components/custom/ui/Button";
import Iconify from "@/components/custom/ui/Iconify";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LogoutPopup from "@/components/custom/LogoutPopup";
import Card from "@/components/custom/Card";
import { historyData } from "@/lib/dummyData";

function HistoryAbensi() {
    const [activeTab, setActiveTab] = useState("Dhuhr");
    const filteredData = historyData.filter((siswa) => siswa.sesi === activeTab);
    const router = useRouter();
    const [showLogout, setShowLogout] = useState(false);

    const handleBackClick = () => {
        router.push('/mobile/home');
    };

    const handleLogoutClick = () => {
        setShowLogout(true);
    };

    const confirmLogout = () => {
        router.push('/login');
    };

    return (
        <>
            <div className="bg-[#060610] w-full min-h-screen text-white font-sans p-2.5 gap-2.5 flex flex-col">
                <Header menu=
                    {
                        <>
                            <Button
                                icon="mingcute:left-fill"
                                text="Back"
                                onClick={handleBackClick}
                            />
                            <Button
                                icon="material-symbols:logout"
                                text="Logout"
                                onClick={handleLogoutClick} />
                        </>
                    }
                />

                <Card
                    jamSesi="11:30 - 12:30"
                    sesi="Dhuhr Prayer Session"
                />

                <div className="flex flex-col w-full h-full gap-[10px] rounded-[12px] bg-[#151419] border border-[#27272A]">
                    <div className="flex flex-row w-full h-[48px] justify-between border-b border-[#27272A]">

                        <Button
                            icon="mingcute:time-line"
                            text="Dhuhr Prayer"
                            className={`${activeTab === 'Dhuhr' ? "bg-[#27272A] rounded-tr-none rounded-br-none rounded-bl-none h-full dir=ltr border border-[#3F3F3F]" : "bg-[#151419] rounded-tr-none rounded-br-none rounded-bl-none h-full' dir='ltr text-[#B3B3B3]"}`}
                            onClick={() => setActiveTab("Dhuhr")}
                        />

                        <Button
                            icon="mingcute:time-line"
                            text="Asr Prayer"
                            className={`${activeTab === 'Asr' ? "bg-[#27272A] rounded-tl-none rounded-bl-none rounded-br-none h-full dir=ltr border border-[#3F3F3F]" : "bg-[#151419] rounded-tl-none rounded-br-none rounded-bl-none h-full' dir='ltr text-[#B3B3B3]"}`}
                            onClick={() => setActiveTab("Asr")}
                        />

                    </div>

                    <div className="flex flex-row w-full h-fit items-center justify-center gap-[5px]">
                        <Iconify
                            icon='material-symbols:info-outline'
                            size={14} />
                        <p className="font-light text-[10px]">Sorted by latest activity. List resets daily at 00:00 WIB.</p>
                    </div>
                    {filteredData.map((siswa) => (

                        <div
                            key={siswa.id}
                            className="flex flex-row flex-1 h-fit gap-[10px] p-[10px] items-center justify-center">
                            <Iconify icon='mdi:person-circle' size={30} />
                            <div className="flex flex-col w-full h-fit gap-[5px]">
                                <p className="font-bold text-[12px] truncate">{siswa.name}</p>
                                <p className="font-medium text-[10px]">
                                    {siswa.kelas} ({siswa.nis})
                                </p>
                            </div>
                            <p className="font-medium text-[10px]">{siswa.waktu}</p>
                        </div>
                    ))}

                    {showLogout && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                            <LogoutPopup
                                onCancel={() => setShowLogout(false)}
                                onConfirm={confirmLogout}
                            />
                        </div>
                    )}

                </div >
            </div>
        </>
    );
}

export default HistoryAbensi;