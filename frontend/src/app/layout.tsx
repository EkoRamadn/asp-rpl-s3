import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ErrorProvider } from '@/hooks/useError';
import { ErrorDialog } from '@/components/custom/mobile/ui/ramadani/components/AlertError';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'APS RPL S3',
  description: 'Website Aps Rpl',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${inter.variable} font-sans antialiased dark`}>
        <ErrorProvider>
          {children}
          <ErrorDialog />
        </ErrorProvider>
      </body>
    </html>
  );
}