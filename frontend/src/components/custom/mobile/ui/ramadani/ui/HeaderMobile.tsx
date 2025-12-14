import Image from 'next/image';

interface HeaderMobileProps {
  className?: string;
  children: React.ReactNode;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = ({ className = '', children }) => {
  return (
    <header className={`py-1 flex items-center justify-between ${className} `}>
      <div className="logo flex items-center gap-[5px]">
        <div className=" w-[30px] h-8">
          <Image src="/logo.svg" alt="Arder logo" width={100} height={100}></Image>
        </div>
        <h1 className="font-medium font-mono text-[15px]">ARDEN</h1>
      </div>

      {children}
    </header>
  );
};
