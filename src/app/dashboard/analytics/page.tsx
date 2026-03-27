'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/common/Layout';
import { AnalyticsChart, PlatformBreakdown } from '@/components/analytics';
import { Card } from '@/components/common';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/login');
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics');
        const result = await response.json();
        if (result.success) {
          setAnalytics(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6">
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Total Views</p>
            <p className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</p>
            <p className="text-sm text-green-600 mt-2">
              ↑ {analytics.thisMonthGrowth}% this month
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">Engagement Rate</p>
            <p className="text-3xl font-bold">{analytics.averageEngagementRate}</p>
            <p className="text-sm text-gray-600 mt-2">
              {analytics.totalEngagement.toLocaleString()} total engagements
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-2">This Month</p>
            <p className="text-3xl font-bold">
              {analytics.thisMonthViews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-2">views this month</p>
          </Card>
        </div>

        {/* Charts */}
        <AnalyticsChart data={analytics.recentData} />

        {/* Platform Breakdown */}
        <PlatformBreakdown platforms={analytics.topPlatforms} />
      </div>
    </DashboardLayout>
  );
}
