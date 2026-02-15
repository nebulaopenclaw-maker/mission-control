import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mission Control - Nebula Agent Management',
  description: 'Multi-agent management dashboard for OpenClaw',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-dark-bg text-white">
        <div className="container-main">
          {children}
        </div>
      </body>
    </html>
  );
}
