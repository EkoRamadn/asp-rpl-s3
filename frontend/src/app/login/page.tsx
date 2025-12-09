"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/custom/ui/Button";
import Image from 'next/image';
import { usersData } from "@/lib/dummyData";
import Iconify from "@/components/custom/ui/Iconify";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isError, setIsError] = useState(false);


    const handleLogin = () => {
        const foundUser = usersData.find((user) =>
            user.username === username && user.password === password)

        if (foundUser) {
            setIsError(false);

            if (foundUser.role === "Pelaksana") {
                router.push("/mobile/home");
            } else {
                router.push("/dashboard");
            }

        } else {
            setIsError(true);
        }
    };

    return (
        <div className="bg-[#060610] w-full min-h-screen text-white font-sans p-2.5 gap-[30px] flex flex-col items-center justify-center ">
            <div className="flex flex-row w-full h-fit items-center justify-center">
                <Image
                    src="/logo.svg"
                    alt="ghfhg"
                    className="w-14 h-[67px]"
                    width={60}
                    height={64}>
                </Image>
                <p className="font-bold text-[30px]">ARDEN</p>
            </div>
            <input
                type="text"
                placeholder="Enter username"
                className={`flex flex-row w-[300px] h-[48px] p-[15px] rounded-[12px] bg-[#27272A] focus:border-[#3F3F3F] focus:outline-none transition-colors capitalize ${isError ? "border-red-500" : "border-[#333] focus:border-white"
                    }`}
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                    setIsError(false);
                }}
            />
            <div className="flex flex-row w-[300px] h-[48px] items-center rounded-[12px] bg-[#27272A] px-[15px]">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="flex-1 bg-transparent outline-none"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setIsError(false);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.currentTarget.blur();
                        }
                    }}
                />

                <div
                    className="text-[#FFFFFF]"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <Iconify icon={showPassword ? "mdi:eye-off" : "mdi:eye"} />
                </div>
            </div>
            {isError && (
                <div className="flex flex-row gap-[5px] text-red-500 text-[12px] items-center">
                    <Iconify icon="mdi:alert-circle" size={12} />
                    <p>Invalid username or password.</p>
                </div>
            )}
            <Button
                text="Login"
                icon=""
                className="flex flex-row !w-[300px] h-[48px] bg-[#E5E7EB] text-black font-semibold text-[14px]"
                onClick={handleLogin}
            />
        </div>
    );
}