import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';

interface BtnMobileProps {
  className?: string;
  value: string;
  Ico?: string;
  on?: () => void;
  isActive?: boolean;
}

export const BtnHistory: React.FC<BtnMobileProps> = ({
  className = '',
  value,
  Ico,
  on,
  isActive = false,
}) => {
  return (
    <Button
      variant="history"
      size="ht"
      className={`flex-1 flex gap-[5px] items-center dark:hover:bg-[#27272A]
             dark:border-transparent dark:hover:border-input dark:focus:border-input
             dark:focus:bg-[#27272A] dark:active:border-input
             dark:active:bg-[#27272A]
            ${className} ${
              isActive &&
              `dark:border-input
             dark:bg-[#27272A]`
            }`}
      onClick={on}
    >
      {Ico && <Icon icon={Ico} width="20" height="20" />}
      <span className="text-[12px]">{value}</span>
    </Button>
  );
};
