import * as React from 'react';

import { cn } from '@/lib/utils';

function InputForm({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'flex w-full h-fit items-center justify-between p-[10px] rounded-[10px] text-[15px] outline-none',
                'bg-[#151419] border-2 border-[#27272A] text-white placeholder:text-white/30',
                'hover:bg-[#1f1e23] hover:border-[#3F3F3F] transition-all duration-200',
                'focus-visible:border-white/40 focus-visible:bg-[#151419]',
                'disabled:cursor-not-allowed disabled:opacity-50',

                className
            )}
            {...props}
        />
    );
}

export { InputForm };