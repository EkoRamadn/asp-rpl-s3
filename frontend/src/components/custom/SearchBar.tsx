import Iconify from './ui/Iconify';

interface SearchBarProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    onClear?: () => void
}

function SearchBar({ value, onChange, className = "", onClear }: SearchBarProps) {
    return (
        <div className={`flex flex-row w-full h-[48px] items-center justify-between p-2.5 border border-[#3F3F3F] transition-colors duration-300 focus-within:border-white ${className}`}>
            <input
                type="text"
                placeholder="Search Name/NISN: "
                value={value}
                onChange={onChange}
                className="w-full h-[48px] text-white font-medium text-[14px] placeholder-[#B3B3B3] placehold- outline-none border-none capitalize"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.currentTarget.blur();
                    }
                }}
            />

            {value ? (
                <Iconify
                    icon="ic:baseline-clear"
                    onClick={onClear}
                />
            ) : (
                <Iconify
                    icon="material-symbols:database-search"
                    className="text-[#B3B3B3]"
                />
            )}
        </div>
    );
}

export default SearchBar