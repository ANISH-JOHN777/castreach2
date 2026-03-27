/**
 * API Routes: /api/subscription
 * Subscription and monetization features
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSubscription, updateSubscription } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's subscription
    const subscription = await getSubscription(session.user.id as string);

    const planFeatures = {
      free: {
        name: 'Free',
        monthlyPrice: 0,
        uploads: 5,
        aiProcessing: false,
        analytics: false,
        platformDistribution: 1,
        brandMatching: false
      },
      pro: {
        name: 'Pro',
        monthlyPrice: 29,
        uploads: 50,
        aiProcessing: true,
        analytics: true,
        platformDistribution: 3,
        brandMatching: true
      },
      premium: {
        name: 'Premium',
        monthlyPrice: 99,
        uploads: 500,
        aiProcessing: true,
        analytics: true,
        platformDistribution: 6,
        brandMatching: true
      },
      enterprise: {
        name: 'Enterprise',
        monthlyPrice: 299,
        uploads: Infinity,
        aiProcessing: true,
        analytics: true,
        platformDistribution: 12,
        brandMatching: true
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        subscription: subscription || {
          plan: 'FREE',
          status: 'ACTIVE'
        },
        availablePlans: planFeatures
      }
    });
  } catch (error) {
    console.error('[API] Get subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan } = body;

    if (!['free', 'pro', 'premium', 'enterprise'].includes(plan)) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      );
    }

    // In production: Process Stripe payment
    // For demo: Just update the subscription
    const subscription = await updateSubscription(
      session.user.id as string,
      plan.toUpperCase() as any
    );

    return NextResponse.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('[API] Update subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
