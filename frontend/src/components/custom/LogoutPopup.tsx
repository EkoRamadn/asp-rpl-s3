import Button from "@/components/custom/ui/Button";
import Iconify from "@/components/custom/ui/Iconify";

interface LogoutPopupProps {
    onCancel: () => void;
    onConfirm: () => void;
}

export default function LogoutPopup({ onCancel, onConfirm }: LogoutPopupProps) {
    return (
        <div className="bg-[#060610] flex flex-col w-[360px] h-fit gap-[15px] items-center justify-center p-[15px] border border-[#3F3F3F] rounded-[12px] animate-in fade-in zoom-in-95 duration-200 ease-out">
            <p className="font-semibold text-[30px]">LOGOUT</p>
            <p className="font-light text-[15px]">Are you sure you want to log out?</p>
            <div className="flex flex-row w-full h-fit gap-[15px]">
                <Button
                    text="Cancel"
                    variant="button-enable"
                    onClick={onCancel}
                />
                <Button
                    text="Logout"
                    variant="button-enable"
                    onClick={onConfirm}
                />
            </div>

        </div>
    );
}