import React from 'react';
import Iconify from './mobile/ui/Iconify';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  placeholder?: string;
  className?: string;
}

function Select({
  options,
  placeholder = 'Select an option',
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <p className="font-semibold text-[14px] text-white">Reason</p>
      <div className="relative w-full flex items-center">
        <select
          className="flex flex-row w-full h-12 p-2.5 rounded-[12px] bg-[#27272A] text-[#B3B3B3] text-[14px] items-center appearance-none font-medium focus:outline-none"
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-white text-[14px] font-medium"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 pointer-events-none flex items-center justify-center">
          <Iconify icon="mdi:chevron-down" className="text-[#B3B3B3]" size={24} />
        </div>
      </div>
    </div>
  );
}

export default Select;
