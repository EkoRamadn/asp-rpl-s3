"use client";
import { useRouter } from "next/navigation";
import { useState } from "react"
import Header from "@/components/custom/Header";
import Card from "@/components/custom/Card";
import Content from '@/components/custom/Content';
import Button from "@/components/custom/ui/Button";
import LogoutPopup from "@/components/custom/LogoutPopup";

function Home() {
    const router = useRouter();
    const [showLogout, setShowLogout] = useState(false);

    const handleScanClick = () => {
        router.push('/mobile/home');
    };

    const handleManualClick = () => {
        router.push('/mobile/absensi-manual');
    };

    const handleHistoryClick = () => {
        router.push('/mobile/history-absensi');
    };

    const handleLogoutClick = () => {
        setShowLogout(true);
    };

    const confirmLogout = () => {
        router.push('/login');
    };

    return (
        <div className="bg-[#060610] w-full min-h-screen text-white font-sans p-2.5 gap-2.5 flex flex-col">
            <Header menu=
                {
                    <>
                        <Button
                            icon="material-symbols:history"
                            text="History"
                            onClick={handleHistoryClick}
                        />
                        <Button
                            icon="material-symbols:logout"
                            text="Logout"
                            onClick={handleLogoutClick}
                        />
                    </>
                }
            />
            <Card
                jamSesi="11:30 - 12:30"
                sesi="Dhuhr Prayer Session"
            />
            <Content
                onScanClick={handleScanClick}
                onManualClick={handleManualClick}
                activeTab="scan"
            />

            {showLogout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                    <LogoutPopup
                        onCancel={() => setShowLogout(false)}
                        onConfirm={confirmLogout}
                    />
                </div>
            )}

        </div>
    );
}

export default Home