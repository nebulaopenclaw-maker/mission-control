import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Nav } from '@/components/nav';

export const metadata: Metadata = {
  title: 'OpenClaw — Mission Control',
  description: 'Command center for the OpenClaw autonomous AI agent system.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06080F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body className="bg-base text-text-primary antialiased min-h-screen">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Nav />
            <main className="flex-1 pt-[46px]">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
