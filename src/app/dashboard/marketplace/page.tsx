'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/common/Layout';
import { CampaignCard, ApplicationCard } from '@/components/marketplace';
import { Card, Button, Modal } from '@/components/common';
import { ApplicationForm } from '@/components/marketplace';

export default function MarketplacePage() {
  const { data: session, status } = useSession();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'applications'>('campaigns');

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/login');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignsRes, applicationsRes] = await Promise.all([
          fetch('/api/marketplace'),
          fetch('/api/marketplace')
        ]);

        const campaignsData = await campaignsRes.json();
        const applicationsData = await applicationsRes.json();

        if (campaignsData.success) {
          setCampaigns(campaignsData.data.campaigns);
        }
        if (applicationsData.success) {
          setApplications(applicationsData.data.applications || []);
        }
      } catch (error) {
        console.error('Failed to fetch marketplace data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApply = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (pitch: string) => {
    if (!selectedCampaign) return;
    
    try {
      const response = await fetch('/api/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          pitch
        })
      });

      if (response.ok) {
        setShowApplicationModal(false);
        setSelectedCampaign(null);
        // Refresh applications
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
    }
  };

  if (loading) return <div>Loading marketplace...</div>;

  return (
    <DashboardLayout title="Marketplace">
      <div className="space-y-8">
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'campaigns'
                ? 'border-pink-400 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Available Campaigns
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 border-b-2 font-medium transition-colors ${
              activeTab === 'applications'
                ? 'border-pink-400 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            My Applications
          </button>
        </div>

        {/* Campaigns */}
        {activeTab === 'campaigns' && (
          <div className="grid gap-6">
            {campaigns.map(campaign => (
              <CampaignCard
                key={campaign.id}
                {...campaign}
                onApply={() => handleApply(campaign)}
                onViewDetails={() => {}}
              />
            ))}
          </div>
        )}

        {/* Applications */}
        {activeTab === 'applications' && (
          <div className="grid gap-6">
            {applications.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600 mb-4">
                  You haven't applied to any campaigns yet
                </p>
                <Button
                  onClick={() => setActiveTab('campaigns')}
                >
                  Browse Campaigns
                </Button>
              </Card>
            ) : (
              applications.map(app => (
                <ApplicationCard key={app.id} {...app} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Application Modal */}
      <Modal
        title={`Apply for: ${selectedCampaign?.title || ''}`}
        isOpen={showApplicationModal}
        onClose={() => {
          setShowApplicationModal(false);
          setSelectedCampaign(null);
        }}
      >
        {selectedCampaign && (
          <ApplicationForm
            campaignTitle={selectedCampaign.title}
            onSubmit={handleSubmitApplication}
            isLoading={false}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}
