import { Icon } from '@iconify/react';

export function Loading({ className }: React.ComponentProps<'svg'>) {
  return (
    <div className={`p-4 w-full dark:text-stone-500 flex items-center gap-3 ${className}`}>
      <Icon icon="line-md:loading-twotone-loop" width="24" height="24" />
      <span className="text-[14px]">Loading</span>
    </div>
  );
}
