import { Icon } from '@iconify/react';

interface IconifyProps {
    icon: string;
    className?: string;
    size?: number;
    onClick?: () => void;
}

function Iconify({ icon, className, size = 20, onClick }: IconifyProps) {
    return (
        <span
            style={{
                display: 'inline-flex',
                width: size,
                height: size,
                minWidth: size,
                minHeight: size
            }}
            className={`items-center justify-center shrink-0 ${className}`}
            onClick={onClick}
        >
            <Icon
                icon={icon}
                width={size}
                height={size}
                className={className}
                onClick={onClick}
            />
        </span>
    );
}

export default Iconify