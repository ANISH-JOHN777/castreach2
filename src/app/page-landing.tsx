'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/common';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your CastReach dashboard is ready
          </p>
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
            CR
          </div>
          <span className="text-2xl font-bold">CastReach</span>
        </div>

        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="secondary">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button>Start Free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Grow Your Podcast with AI
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              CastReach makes podcast distribution, automation, and monetization
              simple. Upload once, distribute everywhere, and earn through brand
              collaborations.
            </p>

            <div className="flex gap-4">
              <Link href="/auth/signup">
                <Button size="lg">Get Started Free</Button>
              </Link>
              <button className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl h-96 flex items-center justify-center">
            <span className="text-6xl">🎙️</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                icon: '📤',
                title: 'Easy Upload',
                description: 'Upload podcasts and let AI handle the rest'
              },
              {
                icon: '🤖',
                title: 'AI Magic',
                description: 'Automatic transcripts, captions, and social posts'
              },
              {
                icon: '📊',
                title: 'Analytics',
                description: 'Track performance across all platforms'
              },
              {
                icon: '🌍',
                title: 'Multi-Platform',
                description: 'Distribute to Spotify, YouTube, Apple & more'
              },
              {
                icon: '💰',
                title: 'Monetization',
                description: 'Connect with brands and earn commissions'
              },
              {
                icon: '⚡',
                title: 'Automation',
                description: 'Schedule posts and publishing automatically'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>

          <div className="grid grid-cols-4 gap-6">
            {[
              {
                name: 'Free',
                price: 0,
                features: ['5 uploads/month', 'Basic analytics', '1 platform']
              },
              {
                name: 'Pro',
                price: 29,
                features: ['50 uploads/month', 'Full analytics', 'AI features', '3 platforms'],
                highlighted: true
              },
              {
                name: 'Premium',
                price: 99,
                features: ['500 uploads/month', 'Advanced analytics', 'AI + Marketplace', '6 platforms']
              },
              {
                name: 'Enterprise',
                price: 299,
                features: ['Unlimited uploads', 'Priority support', 'White-label', 'All platforms']
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-8 rounded-xl border ${
                  plan.highlighted
                    ? 'border-pink-400 bg-pink-50 ring-2 ring-pink-400'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-6">
                  ${plan.price}
                  <span className="text-sm text-gray-600 font-normal">/month</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span>✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  Choose Plan
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-20">
        <div className="max-w-2xl mx-auto text-center px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Grow?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of podcast creators using CastReach to reach more
            listeners and earn more.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">Get Started Free Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <p>© 2024 CastReach. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
