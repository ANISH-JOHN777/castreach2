'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { DashboardLayout } from '@/components/common/Layout';
import { Card, Button, Input, Alert } from '@/components/common';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    bio: ''
  });
  const [saveMessage, setSaveMessage] = useState('');

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect('/auth/login');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setSaveMessage('Settings saved successfully!');
    setIsEditing(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-8 max-w-2xl">
        {saveMessage && (
          <Alert
            type="success"
            message={saveMessage}
            onClose={() => setSaveMessage('')}
          />
        )}

        {/* Profile Settings */}
        <Card className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Profile Settings</h3>
            <Button
              variant="secondary"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell about yourself and your podcast..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-colors resize-none disabled:bg-gray-50"
                rows={4}
              />
            </div>

            {isEditing && (
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            )}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-8">
          <h3 className="text-xl font-bold mb-6">Notifications</h3>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium">Upload Completed</p>
                <p className="text-sm text-gray-600">
                  Notify when AI processing is complete
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium">New Campaign Opportunities</p>
                <p className="text-sm text-gray-600">
                  Alert when matching campaigns are available
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium">Weekly Analytics Report</p>
                <p className="text-sm text-gray-600">
                  Get a summary of your podcast performance
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-gray-600">
                  Updates about new features and promotions
                </p>
              </div>
            </label>
          </div>
        </Card>

        {/* Connected Platforms */}
        <Card className="p-8">
          <h3 className="text-xl font-bold mb-6">Connected Platforms</h3>

          <div className="space-y-4">
            {['Spotify', 'YouTube', 'Apple Podcasts'].map(platform => (
              <div
                key={platform}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-medium">{platform}</p>
                  <p className="text-sm text-gray-600">
                    Not yet connected
                  </p>
                </div>
                <Button size="sm" variant="secondary">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-8 border-red-200 bg-red-50">
          <h3 className="text-xl font-bold mb-6 text-red-600">Danger Zone</h3>

          <div className="space-y-4">
            <Button variant="danger" className="w-full">
              Delete Account
            </Button>
            <p className="text-sm text-gray-600">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
