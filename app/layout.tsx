import './globals.css';
import type { Metadata, Viewport } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Field Summary Dashboard',
  description: 'Offline PWA for Oman Oil WO and NAMA WNSC tracking',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/apple-touch-icon.png'
  }
};

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gradient">Summary Dashboard</h1>
            <nav className="flex items-center gap-3">
              <a className="hover:underline" href="/dashboard">Dashboard</a>
              <a className="hover:underline" href="/wo">WO</a>
              <a className="hover:underline" href="/wnsc">WNSC</a>
              <a className="hover:underline" href="/settings">Settings</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
