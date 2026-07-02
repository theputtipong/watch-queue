import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '../components/Shared/ToastProvider';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WatchQueue | Manage Your Videos',
  description: 'Manage your video queue effortlessly with Optimistic UI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black antialiased`}>
        <Providers>
          {/* ให้ ToastProvider ทำงานแบบ Global */}
          <ToastProvider />
          {children}
        </Providers>
      </body>
    </html>
  );
}
