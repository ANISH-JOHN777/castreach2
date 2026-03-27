/**
 * API Route: GET /api/analytics
 * Get user analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mock analytics data
    const mockAnalytics = {
      totalUploads: 12,
      totalViews: 45000,
      totalEngagement: 3200,
      averageEngagementRate: '7.1%',
      thisMonthViews: 12000,
      thisMonthGrowth: 15,
      topPlatforms: [
        { name: 'YouTube', views: 20000, engagement: 1500, percentage: 44 },
        { name: 'Spotify', views: 15000, engagement: 900, percentage: 33 },
        { name: 'Apple Podcasts', views: 10000, engagement: 800, percentage: 23 }
      ],
      recentData: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(),
        views: Math.floor(Math.random() * 2000) + 100,
        engagement: Math.floor(Math.random() * 150) + 10
      }))
    };

    return NextResponse.json({
      success: true,
      data: mockAnalytics
    });
  } catch (error) {
    console.error('[API] Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

/**
 * API Route: POST /api/analytics
 * Record analytics event
 */

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
    const { uploadId, views, engagement, shares } = body;

    // In production: Save to database
    console.log('[API] Analytics recorded:', {
      uploadId,
      views,
      engagement,
      shares
    });

    return NextResponse.json({
      success: true,
      data: { recorded: true }
    });
  } catch (error) {
    console.error('[API] Analytics POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
}
