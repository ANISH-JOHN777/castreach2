/**
 * Analytics Components
 */

'use client';

import { Card, LoadingSpinner } from '@/components/common';

interface AnalyticsPoint {
  date: string;
  views: number;
  engagement: number;
}

export const AnalyticsChart: React.FC<{
  data: AnalyticsPoint[];
  loading?: boolean;
}> = ({ data, loading = false }) => {
  if (loading) {
    return (
      <Card className="p-6 flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  const maxViews = Math.max(...data.map(d => d.views), 100);
  const maxEngagement = Math.max(...data.map(d => d.engagement), 100);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-6">Performance Trends</h3>
      <div className="flex items-end gap-2 h-64 border-l-2 border-b-2 border-gray-300 p-4">
        {data.map((point, i) => (
          <div key={i} className="flex-1 relative group">
            <div className="flex items-end gap-1 h-full">
              <div
                className="flex-1 bg-pink-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                style={{ height: `${(point.views / maxViews) * 100}%` }}
              />
              <div
                className="flex-1 bg-blue-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                style={{ height: `${(point.engagement / maxEngagement) * 100}%` }}
              />
            </div>
            <div className="absolute -bottom-6 left-0 right-0 text-xs text-gray-600 text-center whitespace-nowrap">
              {point.date}
            </div>
            <div className="absolute -top-12 left-0 right-0 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Views: {point.views} | Engagement: {point.engagement}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-6 mt-12 pt-6 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Views</p>
          <div className="w-4 h-4 bg-pink-400 rounded inline-block mr-2"></div>
        </div>
        <div>
          <p className="text-sm text-gray-500">Engagement</p>
          <div className="w-4 h-4 bg-blue-400 rounded inline-block mr-2"></div>
        </div>
      </div>
    </Card>
  );
};

interface Platform {
  name: string;
  views: number;
  engagement: number;
  percentage: number;
}

export const PlatformBreakdown: React.FC<{ platforms: Platform[] }> = ({
  platforms
}) => {
  const total = platforms.reduce((sum, p) => sum + p.views, 0);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Platform Performance</h3>
      <div className="space-y-4">
        {platforms.map(platform => (
          <div key={platform.name}>
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">{platform.name}</p>
              <p className="text-sm text-gray-500">
                {platform.views} views ({platform.percentage}%)
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-400 h-2 rounded-full transition-all"
                style={{ width: `${platform.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Engagement: {((platform.engagement / platform.views) * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
