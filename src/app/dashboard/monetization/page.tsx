'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/common/Layout';
import { Card, Button, Badge } from '@/components/common';

export default function MonetizationPage() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/login');
  }

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription');
        const result = await response.json();
        if (result.success) {
          setSubscription(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleUpgrade = async (plan: string) => {
    try {
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.toLowerCase() })
      });

      if (response.ok) {
        setSelectedPlan(plan);
      }
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
    }
  };

  if (loading) return <div>Loading monetization...</div>;

  const plans = subscription?.availablePlans || {};
  const currentPlan = subscription?.subscription?.plan?.toLowerCase() || 'free';

  return (
    <DashboardLayout title="Monetization & Billing">
      <div className="space-y-8">
        {/* Current Plan Info */}
        <Card className="p-8 bg-gradient-to-br from-pink-50 to-white border border-pink-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm mb-2">Current Plan</p>
              <h2 className="text-3xl font-bold capitalize">
                {currentPlan} Plan
              </h2>
              <p className="text-gray-600 mt-2">
                Active and ready to use all features
              </p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </Card>

        {/* Plans */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Upgrade Your Plan</h3>
          <div className="grid grid-cols-4 gap-6">
            {Object.entries(plans).map(([key, plan]: any) => (
              <Card
                key={key}
                className={`p-6 ${
                  currentPlan === key
                    ? 'ring-2 ring-pink-400 bg-pink-50'
                    : ''
                }`}
              >
                <h4 className="text-lg font-bold mb-2 capitalize">{key}</h4>
                <p className="text-2xl font-bold mb-4">
                  ${plan.monthlyPrice}
                  <span className="text-sm text-gray-600 font-normal">
                    /month
                  </span>
                </p>

                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-center gap-2">
                    <span>✓</span> {plan.uploads === Infinity ? 'Unlimited' : plan.uploads} uploads
                  </li>
                  <li className="flex items-center gap-2">
                    <span>{plan.aiProcessing ? '✓' : '✗'}</span> AI Processing
                  </li>
                  <li className="flex items-center gap-2">
                    <span>{plan.analytics ? '✓' : '✗'}</span> Analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span>✓</span> {plan.platformDistribution} platforms
                  </li>
                  <li className="flex items-center gap-2">
                    <span>{plan.brandMatching ? '✓' : '✗'}</span> Brand
                    Matching
                  </li>
                </ul>

                <Button
                  variant={currentPlan === key ? 'secondary' : 'primary'}
                  className="w-full"
                  onClick={() => handleUpgrade(key)}
                  disabled={currentPlan === key}
                >
                  {currentPlan === key ? 'Current Plan' : 'Choose Plan'}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Earnings */}
        <Card className="p-8">
          <h3 className="text-xl font-bold mb-6">Brand Deal Earnings</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-2">Completed Deals</p>
              <p className="text-3xl font-bold">2</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Earned</p>
              <p className="text-3xl font-bold">$1,500</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Pending Payouts</p>
              <p className="text-3xl font-bold">$300</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
