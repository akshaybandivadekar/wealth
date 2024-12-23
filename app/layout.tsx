import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';
import Header from '@/components/header';
import { Toaster } from '../components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wealth',
  description: 'One stop Finance Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`${inter.className}`}>
          <Header />
          <main className='min-h-screen'>{children}</main>
          <Toaster richColors />
          <footer className='bg-blue-50 py-12'>
            <div className='container mx-auto px-4 text-center text-gray-600'>
              <p>Made with &#x1F497; by Akshay</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
