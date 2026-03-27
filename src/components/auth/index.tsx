/**
 * Authentication Components
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Alert } from '@/components/common';

interface AuthFormProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export const LoginForm: React.FC<AuthFormProps> = ({
  onSubmit,
  isLoading = false,
  error = ''
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Sign In
      </Button>

      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-pink-400 hover:text-pink-500">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};

export const SignupForm: React.FC<
  AuthFormProps & { role?: 'creator' | 'brand' }
> = ({ onSubmit, isLoading = false, error = '', role = 'creator' }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(role);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordError('');
    await onSubmit({ name, email, password, role: selectedRole });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert type="error" message={error} />}

      <Input
        type="text"
        label="Full Name"
        placeholder="John Doe"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

      <Input
        type="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am a...
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="creator"
              checked={selectedRole === 'creator'}
              onChange={e => setSelectedRole(e.target.value as any)}
              className="mr-2"
            />
            <span className="text-gray-700">Creator (Podcaster)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="brand"
              checked={selectedRole === 'brand'}
              onChange={e => setSelectedRole(e.target.value as any)}
              className="mr-2"
            />
            <span className="text-gray-700">Brand (Looking for Creators)</span>
          </label>
        </div>
      </div>

      <Input
        type="password"
        label="Password"
        placeholder="••••••••"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />

      <Input
        type="password"
        label="Confirm Password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        error={passwordError}
        required
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        Create Account
      </Button>

      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-pink-400 hover:text-pink-500">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export const OAuthButtons: React.FC = () => {
  return (
    <div className="space-y-3">
      <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <button className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.828 0 1.5-.672 1.5-1.5S14.328 6 13.5 6 12 6.672 12 7.5s.672 1.5 1.5 1.5zm-7 0c.828 0 1.5-.672 1.5-1.5S7.328 6 6.5 6 5 6.672 5 7.5 5.672 9 6.5 9zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
        Continue with Apple
      </button>
    </div>
  );
};
