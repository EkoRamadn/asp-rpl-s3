"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icon } from "@iconify/react"
import { toast } from "sonner"

export function Profile() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        avatar: ""
    });

    const [initialData, setInitialData] = useState({
        username: "",
        email: "",
        avatar: ""
    });
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [previewImage, setPreviewImage] = useState(initialData.avatar)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isEmailFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const [isProfilePending, setIsProfilePending] = useState(false);
    const [isPasswordPending, setIsPasswordPending] = useState(false);



    const handleAvatarClick = () => fileInputRef.current?.click()
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Ukuran file terlalu besar! Maksimal 2MB");
                return;
            }

            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file)
            setPreviewImage(imageUrl)
        }
    }

    const handleSavePassword = async () => {
        setIsPasswordPending(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success("Password updated!");
        setPasswords({ current: "", new: "", confirm: "" });
        setIsPasswordPending(false);
    };

    const isProfileDirty =
        formData.username !== initialData.username ||
        formData.email !== initialData.email ||
        previewImage !== initialData.avatar;

    const handleCancelProfile = () => {
        setFormData(initialData)
        setPreviewImage(initialData.avatar);
    };

    const handleSaveProfile = async () => {
        setIsProfilePending(true);
        try {
            const body = new FormData();
            body.append("username", formData.username);
            body.append("email", formData.email);
            if (selectedFile) body.append("avatar", selectedFile);

            const res = await fetch(`${API_URL}/petugas/update`, {
                method: "POST",
                body: body,
            });

            if (!res.ok) throw new Error();

            setInitialData({ ...formData, avatar: previewImage });
            setSelectedFile(null);
            toast.success("Profil berhasil diupdate!");
        } catch (error) {
            toast.error("Gagal simpan perubahan");
        } finally {
            setIsProfilePending(false);
        }
    };

    const isProfileValid = formData.username.trim() !== "" && isEmailFormatValid;

    const isPasswordValid =
        passwords.current !== "" &&
        passwords.new !== "" &&
        passwords.new === passwords.confirm;

    const isPasswordDirty = passwords.current !== "" || passwords.new !== "";
    const [showPass, setShowPass] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_URL}/petugas/1`);
                const data = await res.json();
                const userData = {
                    username: data.username || "Arganata",
                    email: data.email || "arganata.on@gmail.com",
                    avatar: data.avatar || "https://github.com/arga-nata.png"
                };
                setFormData(userData);
                setInitialData(userData);
                setPreviewImage(userData.avatar);
            } catch (error) {
                toast.error("Gagal ambil data profil");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [API_URL]);

    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    if (isLoading) {
        return (
            <div className="bg-[#151419] flex flex-col items-center justify-center min-h-[400px] w-full gap-4 shadcn-default">
                <Icon icon="lucide:loader-2" className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading profile data...</p>
            </div>
        );
    }

    return (
        <div className="bg-[#151419] border border-[#3F3F3F] rounded-xl overflow-hidden shadow-2xl shadcn-default">
            <Tabs defaultValue="profile" className="w-full">
                <div className="p-6 border-b">
                    <div className="text-xl font-semibold tracking-tight mb-4">Account</div>
                    <TabsList className="grid w-full grid-cols-2 h-12">
                        <TabsTrigger value="profile" className="gap-2 h-full">
                            <Icon icon="mingcute:profile-line" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="password" className="gap-2 h-full">
                            <Icon icon="carbon:password" />
                            Password
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="p-6">
                    <TabsContent value="profile" className="space-y-6 mt-0">
                        <div className="flex flex-col items-center gap-4">
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            <div
                                className={`relative group ${isProfilePending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={!isProfilePending ? handleAvatarClick : undefined}
                            >
                                <Avatar className={`w-24 h-24 border-2 border-border transition-opacity ${isProfilePending ? 'opacity-40' : 'group-hover:opacity-80'}`}>
                                    <AvatarImage src={previewImage} className="object-cover" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                {isProfilePending && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin text-primary" />
                                    </div>
                                )}
                                {!isProfilePending && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                                        <Icon icon="mdi:camera-outline" width="24" height="24" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {isProfilePending ? "Uploading..." : "Click to upload new photo"}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <div className="relative">
                                    <Input
                                        id="username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="h-12"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Input id="role" defaultValue="Admin" disabled className="bg-muted/50 h-12" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12"
                                />
                                {formData.email !== "" && !isEmailFormatValid && (
                                    <p className="text-[11px] text-destructive font-medium">
                                        Please enter a valid email address.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            {isProfileDirty && (
                                <Button variant="outline" onClick={handleCancelProfile} className="h-12 px-6">Cancel</Button>
                            )}

                            <Button
                                disabled={!isProfileValid || !isProfileDirty || isProfilePending}
                                onClick={handleSaveProfile}
                                className="h-12 px-6"
                            >
                                {isProfilePending ? (
                                    <>
                                        <Icon icon="lucide:loader-2" className="mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : "Save Changes"}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="password" className="space-y-4 mt-0">
                        <div className="grid gap-2">
                            <Label>Current Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPass.current ? "text" : "password"}
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className="pr-10 h-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => ({ ...p, current: !p.current }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <Icon icon={showPass.current ? "lucide:eye-off" : "lucide:eye"} />
                                </button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>New Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPass.new ? "text" : "password"}
                                    value={passwords.new}
                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                    className="pr-10 h-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => ({ ...p, new: !p.new }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <Icon icon={showPass.new ? "lucide:eye-off" : "lucide:eye"} />
                                </button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPass.confirm ? "text" : "password"}
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className="pr-10 h-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => ({ ...p, confirm: !p.confirm }))}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <Icon icon={showPass.confirm ? "lucide:eye-off" : "lucide:eye"} />
                                </button>
                            </div>
                        </div>
                        {passwords.confirm !== "" && passwords.new !== passwords.confirm && (
                            <p className="text-[11px] text-destructive font-medium">
                                Passwords do not match.
                            </p>
                        )}
                        <div className="flex justify-end gap-3 pt-4">
                            {isPasswordDirty && (
                                <Button variant="outline" onClick={() => setPasswords({ current: "", new: "", confirm: "" })} className="h-12 px-6">
                                    Cancel
                                </Button>
                            )}

                            <Button
                                disabled={!isPasswordValid || !isPasswordDirty || isPasswordPending}
                                onClick={handleSavePassword}
                                className="h-12 px-6"
                            >
                                {isPasswordPending ? (
                                    <>
                                        <Icon icon="lucide:loader-2" className="mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : "Update Password"}
                            </Button>

                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}

export default Profile