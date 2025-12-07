import { AppSidebar } from '@/components/app-sidebar';
import HBread from '@/components/custom/HBread';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';


export const metadata: Metadata = {
  title: 'Dashboard',
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className={`${inter.variable} antialiased`}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className='border-2 border-sidebar-accent bg-background'>
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 " />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <HBread />
              </div>
            </header>
            <div className=" gap-4 p-4 pt-0">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
