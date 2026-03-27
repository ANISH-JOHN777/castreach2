'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoginForm, OAuthButtons } from '@/components/auth';
import { Card, Alert } from '@/components/common';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-4">
            CR
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your CastReach account</p>
        </div>

        <Card className="p-8 mb-6">
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </Card>

        <Card className="p-6">
          <p className="text-center text-sm text-gray-600 mb-4">
            Or continue with
          </p>
          <OAuthButtons />
        </Card>
      </div>
    </div>
  );
}
