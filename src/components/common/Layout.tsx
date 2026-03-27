/**
 * Layout Components - Navigation and Structure
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/common';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Studio', href: '/dashboard/studio', icon: '🎙️' },
  { label: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
  { label: 'Marketplace', href: '/dashboard/marketplace', icon: '🤝' },
  { label: 'Monetization', href: '/dashboard/monetization', icon: '💰' },
  { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' }
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
          CR
        </div>
        <span className="text-xl font-bold">CastReach</span>
      </Link>

      {/* User Info */}
      {session?.user && (
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-bold">
              {session.user.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="space-y-2 mb-8">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              pathname?.startsWith(item.href)
                ? 'bg-pink-100 text-pink-600 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Sign Out */}
      <div className="mt-auto pt-8 border-t border-gray-200">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
        >
          Sign Out
        </Button>
      </div>
    </aside>
  );
};

export const Header: React.FC<{ title?: string }> = ({ title }) => {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <div>
        {title && <h1 className="text-2xl font-bold">{title}</h1>}
      </div>

      <div className="flex items-center gap-4">
        {/* Upgrade Button */}
        {session && (
          <>
            <Link href="/dashboard/settings">
              <Button variant="secondary" size="sm">
                Upgrade Plan
              </Button>
            </Link>
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-bold">
              {session.user.name?.[0] || 'U'}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export const DashboardLayout: React.FC<{
  children: React.ReactNode;
  title?: string;
}> = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
