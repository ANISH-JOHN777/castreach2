'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { DashboardLayout } from '@/components/common/Layout';
import { UploadForm, AIOutputDisplay } from '@/components/studio';
import { Alert, Card } from '@/components/common';

export default function StudioPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/login');
  }

  const handleUpload = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('Podcast uploaded! AI is processing your content...');
        setShowResults(true);

        // Simulate AI processing delay
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="Upload Studio">
      <div className="space-y-8">
        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        )}

        <UploadForm onSubmit={handleUpload} isLoading={isLoading} />

        {showResults && (
          <AIOutputDisplay
            transcript="Welcome to the CastReach podcast. Today we're discussing the future of audio content creation and distribution... [Full transcript would appear here]"
            summary="This podcast episode discusses the future of audio content and the podcast industry's growth. Key topics include AI-powered content generation, multi-platform distribution, and monetization strategies."
            hashtags={[
              '#podcasting',
              '#AudioContent',
              '#CreatorEconomy',
              '#ContentDistribution'
            ]}
            captions={[
              {
                text: 'Welcome to CastReach podcast',
                startTime: 0,
                endTime: 5
              },
              {
                text: 'Today we discuss audio content creation',
                startTime: 5,
                endTime: 12
              }
            ]}
            socialPosts={[
              {
                platform: 'twitter',
                content:
                  'Just released a new episode! Check it out to learn about podcast growth strategies.',
                hashtags: ['#podcasting', '#content']
              }
            ]}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
