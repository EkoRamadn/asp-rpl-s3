'use client';

import * as React from 'react';
import { BookOpen, Bot, Settings2, SquareTerminal } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/dashboard',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Database',
      url: '/dashboard/database',
      icon: Bot,
    },
    {
      title: 'Class',
      url: '/dashboard/class',
      icon: BookOpen,
    },
    {
      title: 'Recapitulation',
      url: '/dashboard/recapitulation',
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton className="mb-2 mt-1" asChild > */}
            <Link href="/dashboard" className="flex items-center gap-2 mb-4 mt-2 pl-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-sm">
                <Image src="/logo.svg" alt="Logo" width={45} height={48} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-sans font-medium">ARDEN</span>
              </div>
            </Link>
            {/* </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="*:bg-sidebar-accent">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
