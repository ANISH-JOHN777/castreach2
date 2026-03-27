import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'CastReach - Podcast Growth & Monetization Platform',
  description:
    'AI-powered podcast distribution, automation, and monetization platform for creators',
  keywords: [
    'podcast',
    'distribution',
    'AI',
    'content creation',
    'monetization',
    'analytics'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
