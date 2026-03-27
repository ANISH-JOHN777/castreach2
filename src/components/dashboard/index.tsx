/**
 * Dashboard Components
 */

'use client';

import { Card, Badge } from '@/components/common';
import Link from 'next/link';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  icon,
  trend
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend !== undefined && (
            <p
              className={`text-sm mt-2 ${
                trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
            </p>
          )}
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </Card>
  );
};

interface RecentUploadProps {
  id: string;
  title: string;
  status: string;
  views: number;
  date: string;
}

export const RecentUploads: React.FC<{ uploads: RecentUploadProps[] }> = ({
  uploads
}) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-bold">Recent Uploads</h3>
        <Link href="/dashboard/studio" className="text-pink-400 hover:text-pink-500 text-sm">
          View All →
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {uploads.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No uploads yet</p>
            <Link href="/dashboard/studio" className="text-pink-400 hover:text-pink-500 text-sm">
              Upload your first podcast
            </Link>
          </div>
        ) : (
          uploads.map(upload => (
            <div key={upload.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{upload.title}</p>
                  <p className="text-sm text-gray-500">{upload.date}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      upload.status === 'completed'
                        ? 'success'
                        : upload.status === 'failed'
                          ? 'danger'
                          : 'warning'
                    }
                  >
                    {upload.status}
                  </Badge>
                  <p className="text-sm font-medium mt-2">{upload.views} views</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

interface QuickActionProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export const QuickActionCard: React.FC<QuickActionProps> = ({
  icon,
  title,
  description,
  href
}) => {
  return (
    <Link href={href}>
      <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer h-full">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </Card>
    </Link>
  );
};
