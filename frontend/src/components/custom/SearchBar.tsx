'use client';

import React from 'react';

interface SearchBarProps {
  value?: string; // bisa undefined, nanti kita beri default ""
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  className?: string;
}

export default function SearchBar({
  value = '', // pastikan selalu string
  onChange,
  onClear,
  className = '',
}: SearchBarProps) {
  return (
    <div
      className={`flex flex-row w-full h-[48px] items-center justify-between p-2.5 border border-[#3F3F3F] transition-colors duration-300 focus-within:border-white ${className}`}
    >
      <input
        type="text"
        placeholder="Search Name/NISN: "
        value={value} // selalu controlled
        onChange={onChange}
        className="w-full bg-transparent outline-none text-white placeholder:text-gray-400"
      />

      {value && onClear && (
        <button
          onClick={onClear}
          className="ml-2 text-white font-medium text-sm bg-[#3F3F3F] px-2 py-1 rounded hover:bg-gray-600 transition"
        >
          Clear
        </button>
      )}
    </div>
  );
}
