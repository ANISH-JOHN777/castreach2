/**
 * Marketplace Components
 */

'use client';

import { useState } from 'react';
import { Card, Button, Badge } from '@/components/common';

interface CampaignCardProps {
  id: string;
  title: string;
  brand: string;
  budget: number;
  description: string;
  requirements: string[];
  deadline: string;
  hasApplied?: boolean;
  onApply?: () => void;
  onViewDetails?: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({
  id,
  title,
  brand,
  budget,
  description,
  requirements,
  deadline,
  hasApplied = false,
  onApply,
  onViewDetails
}) => {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-gray-600">{brand}</p>
        </div>
        <Badge variant="default">${budget.toLocaleString()}</Badge>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{description}</p>

      <div className="mb-4">
        <p className="text-xs font-medium text-gray-600 mb-2">Requirements:</p>
        <div className="flex flex-wrap gap-2">
          {requirements.slice(0, 3).map((req, i) => (
            <Badge key={i} variant="default">
              {req}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">Deadline: {deadline}</p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onViewDetails}
          >
            Details
          </Button>
          <Button
            size="sm"
            variant={hasApplied ? 'secondary' : 'primary'}
            onClick={onApply}
            disabled={hasApplied}
          >
            {hasApplied ? '✓ Applied' : 'Apply'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

interface BrandCardProps {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  description: string;
  campaignCount: number;
}

export const BrandCard: React.FC<BrandCardProps> = ({
  id,
  name,
  logo,
  industry,
  description,
  campaignCount
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-bold">
          {logo || name[0]}
        </div>
        <div className="flex-1">
          <h3 className="font-bold">{name}</h3>
          <p className="text-sm text-gray-600">{industry}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{description}</p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-600">
          {campaignCount} Active Campaign{campaignCount !== 1 ? 's' : ''}
        </p>
        <Button size="sm" variant="primary">
          View Campaigns
        </Button>
      </div>
    </Card>
  );
};

interface ApplicationViewProps {
  id: string;
  campaignTitle: string;
  brandName: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedDate: string;
  pitch: string;
}

export const ApplicationCard: React.FC<ApplicationViewProps> = ({
  id,
  campaignTitle,
  brandName,
  status,
  appliedDate,
  pitch
}) => {
  const statusColors = {
    pending: 'warning',
    accepted: 'success',
    rejected: 'danger'
  } as const;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold">{campaignTitle}</h3>
          <p className="text-sm text-gray-600">{brandName}</p>
        </div>
        <Badge variant={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <p className="text-sm text-gray-700 mb-3">{pitch}</p>

      <p className="text-xs text-gray-500">Applied on {appliedDate}</p>
    </Card>
  );
};

interface ApplicationFormProps {
  campaignTitle: string;
  onSubmit: (pitch: string) => Promise<void>;
  isLoading: boolean;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  campaignTitle,
  onSubmit,
  isLoading
}) => {
  const [pitch, setPitch] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(pitch);
    setPitch('');
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h3 className="text-lg font-bold mb-4">Apply for: {campaignTitle}</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Pitch
          </label>
          <textarea
            value={pitch}
            onChange={e => setPitch(e.target.value)}
            placeholder="Tell the brand why you're a perfect fit for this campaign..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-colors resize-none"
            rows={6}
            required
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Submit Application
        </Button>
      </form>
    </Card>
  );
};
