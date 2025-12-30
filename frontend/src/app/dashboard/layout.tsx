import { AppSidebar } from '@/components/app-sidebar';
import HBread from '@/components/custom/HBread';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import HeaderActions from './HeaderActions';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Dashboard',
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${inter.variable} antialiased h-screen w-full flex overflow-hidden`}>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="border-2 border-sidebar-accent bg-background flex flex-col h-full overflow-hidden">

          <header className="flex flex-row shrink-0 w-full h-fit items-center justify-between p-[10px] border-b border-[#27272A]">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 " />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <HBread />
            </div>
            <HeaderActions />
          </header>

          <div className="flex-1 overflow-hidden p-0 relative">
            {children}
            <Toaster />
          </div>

        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}