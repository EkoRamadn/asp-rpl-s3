'use client';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const HBread = () => {
  const path = usePathname();
  const segments = path.split('/');
  const title = segments[segments.length - 1];
  function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <Link className="dark:text-white font-semibold text-[20px]" href="#">
            {capitalize(title == 'dashboard' ? 'home' : title)}
          </Link>
        </BreadcrumbItem>
        {/* <BreadcrumbSeparator className="hidden md:block" /> */}
        {/* <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default HBread;
