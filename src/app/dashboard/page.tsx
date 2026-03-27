'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/common/Layout';
import {
  StatsCard,
  RecentUploads,
  QuickActionCard
} from '@/components/dashboard';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/login');
  }

  const mockUploads = [
    {
      id: '1',
      title: 'AI Trends Episode 42',
      status: 'completed',
      views: 1250,
      date: new Date().toLocaleDateString()
    },
    {
      id: '2',
      title: 'Web3 Futures',
      status: 'completed',
      views: 890,
      date: new Date(Date.now() - 86400000).toLocaleDateString()
    }
  ];

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatsCard label="Total Uploads" value="12" icon="📤" trend={15} />
        <StatsCard label="Total Views" value="45K" icon="👁️" trend={28} />
        <StatsCard label="Engagement Rate" value="7.1%" icon="💬" trend={5} />
        <StatsCard label="Active Campaigns" value="3" icon="🤝" trend={0} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <QuickActionCard
          icon="📤"
          title="Upload Podcast"
          description="Upload and process your latest episode"
          href="/dashboard/studio"
        />
        <QuickActionCard
          icon="🤖"
          title="AI Processing"
          description="View AI-generated content"
          href="/dashboard/studio"
        />
        <QuickActionCard
          icon="🤝"
          title="Find Brands"
          description="Browse collaboration opportunities"
          href="/dashboard/marketplace"
        />
      </div>

      {/* Recent Uploads */}
      <RecentUploads uploads={mockUploads} />
    </DashboardLayout>
  );
}
