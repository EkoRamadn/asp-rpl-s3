"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Card from "@/components/custom/Card";
import Content from "@/components/custom/Content";
import Header from "@/components/custom/Header";
import SearchBar from "@/components/custom/SearchBar";
import Button from "@/components/custom/ui/Button";
import { studentsData } from "@/lib/dummyData";
import StudentConfirmation from "@/components/custom/StudentConfirmation";
import Iconify from "@/components/custom/ui/Iconify";
import LogoutPopup from "@/components/custom/LogoutPopup";


function AbsensiManual() {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const isTyping = keyword.length > 0
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isSuccess, setIsSuccess] = useState(false);
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


    const filteredStudents = studentsData.filter((siswa) => {
        if (keyword === "") return false;

        return (
            siswa.name.toLowerCase().includes(keyword.toLowerCase())
        );
    });

    const handleStudentClick = (siswa: any) => {
        setKeyword(siswa.name);
        setSelectedStudent(siswa);
    };

    const handleClearSearch = () => {
        setKeyword("");
        setSelectedStudent(null);
    }

    return (
        <>
            <div className="bg-[#060610] w-full min-h-screen text-white font-sans p-2.5 gap-2.5 flex flex-col select-none">
                <Header menu=
                    {
                        <>
                            <Button
                                icon="material-symbols:history"
                                text="History"
                                onClick={handleHistoryClick} />
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

                <Content
                    onScanClick={handleScanClick}
                    onManualClick={handleManualClick}
                    activeTab="manual" />

                <div className="flex flex-col w-full h-screen p-2.5 rounded-xl bg-[#151419] justify-start">
                    <SearchBar
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value)
                            setSelectedStudent(null);
                        }}
                        onClear={handleClearSearch}

                        className={isTyping && !selectedStudent
                            ? "rounded-t-[12px] rounded-b-none"
                            : "rounded-[12px]"
                        }
                    />

                    {isTyping && !selectedStudent && (
                        <div className="flex flex-col overflow-y-auto no-scrollbar border-t-0">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((siswa) => (
                                    <div
                                        key={siswa.id}
                                        onClick={() => handleStudentClick(siswa)}
                                        className="flex flex-col w-full h-fit gap-0">
                                        <div
                                            className="flex flex-row w-full h-[48px] gap-0 p-[10px] items-center border border-[#3F3F3F] border-t-0">
                                            <p className="font-medium text-[14px]">{siswa.name}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center gap-[10px] p-[30px]">
                                    <p className="font-extrabold text-[16px]">No results found</p>
                                    <p className="font-medium text-[14px]">Please try a different keyword</p>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedStudent && (
                        <StudentConfirmation
                            student={selectedStudent}
                            onConfirm={() => {
                                setIsSuccess(true);
                                setKeyword("");
                            }}
                        />
                    )}

                    {isSuccess && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                            <div className="flex flex-col w-[360px] h-fit items-center justify-center gap-[15px] p-[15px] bg-[#060610] border border-[#3F3F3F] rounded-[12px]">
                                <p className="font-semibold text-[30px]">SUCCESS!</p>
                                <Iconify
                                    icon="icon-park-outline:add-picture"
                                    size={120}
                                />
                                <span className="font-medium text-[20px]">{selectedStudent?.name}</span>
                                <span>{selectedStudent?.kelas} ({selectedStudent?.nis})</span>
                                <Button
                                    text="Confirm"
                                    variant="button-enable"
                                    onClick={() => {
                                        setIsSuccess(false);
                                        setSelectedStudent(null);
                                        setKeyword("");
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {showLogout && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
                            <LogoutPopup
                                onCancel={() => setShowLogout(false)}
                                onConfirm={confirmLogout}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AbsensiManual