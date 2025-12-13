interface LabelInputProps {
  label: string;
  value: string;
  className?: string;
}

function LabelInput({ label, value, className = '' }: LabelInputProps) {
  return (
    <div className={`flex flex-col gap-[10px] ${className}`}>
      <p className="font-semibold text-[14px] text-white">{label}</p>
      <div className="flex flex-row w-full h-[48px] p-[10px] rounded-[12px] bg-[#27272A] text-[#B3B3B3] text-[14px] items-center">
        {value}
      </div>
    </div>
  );
}

export default LabelInput;
