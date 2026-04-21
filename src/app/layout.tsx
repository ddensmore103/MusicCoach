import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'MusicCoach — AI Music Practice Coach',
  description:
    'Your personal AI-powered music coach. Record, practice, and improve with intelligent feedback on your playing.',
  keywords: ['music', 'coach', 'AI', 'practice', 'guitar', 'piano', 'vocal'],
  openGraph: {
    title: 'MusicCoach',
    description: 'AI-powered music practice coach',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6366F1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}