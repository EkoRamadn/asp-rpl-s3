import Image from 'next/image';

interface HeaderMobileProps {
  className?: string;
  children: React.ReactNode;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({ className = '', children }) => {
  return (
    <header className={`flex flex-row w-full h-fit items-center justify-between ${className} `}>
      <div className="logo flex flex-row items-center justify-center gap-[5px]">
        <div className=" w-[32px] h-[32px]">
          <Image
            src="/logo.svg"
            alt="Arden logo"
            width={100}
            height={100}>
          </Image>
        </div>
        <h1 className="font-bold text-[16px]">ARDEN</h1>
      </div>
      {children}
    </header>
  );
};
