/**
 * Studio Components - Podcast Upload and Processing
 */

'use client';

import { useState } from 'react';
import { Card, Button, Input, LoadingSpinner, Alert } from '@/components/common';

interface UploadFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export const UploadForm: React.FC<UploadFormProps> = ({
  onSubmit,
  isLoading
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<'audio' | 'video'>('audio');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = contentType === 'audio'
        ? ['audio/mpeg', 'audio/wav', 'audio/ogg']
        : ['video/mp4', 'video/quicktime'];

      if (!validTypes.includes(selectedFile.type)) {
        setError(`Invalid ${contentType} format`);
        return;
      }

      if (selectedFile.size > 500 * 1024 * 1024) {
        // 500MB limit
        setError('File size exceeds 500MB');
        return;
      }

      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', contentType);
    formData.append('file', file);

    try {
      await onSubmit(formData);
      setTitle('');
      setDescription('');
      setFile(null);
    } catch (err) {
      setError('Failed to upload podcast');
    }
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Podcast</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <Input
          type="text"
          label="Podcast Title"
          placeholder="e.g., 'AI Trends in 2024'"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="audio"
                checked={contentType === 'audio'}
                onChange={e => setContentType(e.target.value as any)}
                className="mr-2"
              />
              <span>Audio</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="video"
                checked={contentType === 'video'}
                onChange={e => setContentType(e.target.value as any)}
                className="mr-2"
              />
              <span>Video</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {contentType === 'audio' ? 'Audio File' : 'Video File'}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors cursor-pointer">
            <input
              type="file"
              accept={contentType === 'audio' ? '.mp3,.wav,.ogg' : '.mp4,.mov'}
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <span className="text-4xl mb-2">📁</span>
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">
                Max 500MB
              </p>
            </label>
          </div>
          {file && (
            <p className="text-sm text-green-600 mt-2">
              ✓ {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            placeholder="Describe your podcast episode..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-colors resize-none"
            rows={4}
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          {isLoading ? 'Uploading & Processing...' : 'Upload Podcast'}
        </Button>
      </form>
    </Card>
  );
};

interface AIOutputDisplayProps {
  transcript: string;
  summary: string;
  hashtags: string[];
  captions: any[];
  socialPosts: any[];
}

export const AIOutputDisplay: React.FC<AIOutputDisplayProps> = ({
  transcript,
  summary,
  hashtags,
  captions,
  socialPosts
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'captions' | 'social'>('summary');

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">AI Processing Results</h3>

      <div className="flex gap-2 mb-6 border-b border-gray-100">
        {(['summary', 'transcript', 'captions', 'social'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-pink-400 text-pink-600 font-medium'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="min-h-96">
        {activeTab === 'summary' && (
          <div>
            <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {hashtags.map(tag => (
                <span
                  key={tag}
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'transcript' && (
          <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
        )}

        {activeTab === 'captions' && (
          <div className="space-y-2">
            {captions.map((caption, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium text-gray-600">
                  {Math.floor(caption.startTime / 60)}:
                  {String(caption.startTime % 60).padStart(2, '0')} →{' '}
                  {Math.floor(caption.endTime / 60)}:
                  {String(caption.endTime % 60).padStart(2, '0')}
                </span>
                <p className="text-gray-700 ml-4">{caption.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            {socialPosts.map((post, i) => (
              <Card key={i} className="p-4">
                <p className="text-sm font-bold text-pink-600 mb-2">
                  {post.platform.toUpperCase()}
                </p>
                <p className="text-gray-700 mb-2">{post.content}</p>
                <div className="flex flex-wrap gap-1">
                  {post.hashtags.map((tag: string) => (
                    <span key={tag} className="text-pink-600 text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
