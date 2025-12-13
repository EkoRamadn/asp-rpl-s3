import Iconify from './Iconify';

type ButtonVariant =
  | 'header-button'
  | 'button-active'
  | 'button-inactive'
  | 'button-enable'
  | 'button-disable';

interface ButtonProps {
  icon?: string;
  text: string;
  className?: string;
  dir?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
}

function Button({
  icon,
  text,
  className,
  dir,
  onClick,
  disabled,
  variant = 'header-button',
}: ButtonProps) {
  const variants = {
    'header-button': 'rounded-[0px]',
    'button-active': 'bg-[#27272A] text-white border border-[#3F3F3F]',
    'button-inactive': 'bg-[#151419] text-[#B3B3B3] border border-[#2a2a30]',
    'button-enable': 'bg-white text-black',
    'button-disable': 'bg-[#27272A] text-[#B3B3B3] cursor-not-allowed',
  };

  const baseStyle =
    'flex flex-row w-full h-[48px] items-center justify-center gap-[5px] rounded-xl transition-transform duration-100 active:scale-95 disabled:opacity-50 disabled:active:scale-100';

  const variantStyle = variants[variant];

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${className} ${dir}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Iconify icon={icon} />}

      <p className="font-semibold text-[14px]">{text}</p>
    </button>
  );
}
export default Button;
