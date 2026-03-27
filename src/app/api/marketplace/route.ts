/**
 * API Routes: /api/marketplace
 * Marketplace and brand collaboration features
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/marketplace/campaigns
 * List all active campaigns
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock campaigns data
    const mockCampaigns = [
      {
        id: 'camp_1',
        title: 'Tech Gadget Launch Campaign',
        brandName: 'TechPro Co',
        budget: 5000,
        description:
          'We are looking for podcast creators to cover our new AI-powered gadget launch',
        requirements: ['Technology', '10K+ listeners', 'Monthly cadence'],
        deadline: new Date(Date.now() + 86400000 * 30).toLocaleDateString(),
        status: 'active'
      },
      {
        id: 'camp_2',
        title: 'Wellness & Health Content',
        brandName: 'HealthFirst',
        budget: 3000,
        description:
          'Partner with us to discuss health, wellness, and lifestyle topics',
        requirements: ['Health & Wellness', '5K+ listeners', 'Bi-weekly'],
        deadline: new Date(Date.now() + 86400000 * 20).toLocaleDateString(),
        status: 'active'
      },
      {
        id: 'camp_3',
        title: 'Financial Education Series',
        brandName: 'MoneyWise',
        budget: 7500,
        description:
          'Create educational content about personal finance and investing',
        requirements: ['Finance', '15K+ listeners', 'Weekly series'],
        deadline: new Date(Date.now() + 86400000 * 25).toLocaleDateString(),
        status: 'active'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        campaigns: mockCampaigns.slice(page * limit, (page + 1) * limit),
        total: mockCampaigns.length,
        page,
        pageSize: limit,
        hasMore: (page + 1) * limit < mockCampaigns.length
      }
    });
  } catch (error) {
    console.error('[API] Marketplace campaigns error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/marketplace/applications
 * Create campaign application
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
    const { campaignId, pitch } = body;

    if (!campaignId || !pitch) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production: Save application to database
    const application = {
      id: `app_${Date.now()}`,
      userId: session.user.id,
      campaignId,
      status: 'pending',
      pitch,
      createdAt: new Date()
    };

    console.log('[API] Application created:', application);

    return NextResponse.json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('[API] Create application error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create application' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/marketplace/brands
 * List all brands
 */
export async function GET_BRANDS(request: NextRequest) {
  try {
    // Mock brands data
    const mockBrands = [
      {
        id: 'brand_1',
        name: 'TechPro Co',
        industry: 'Technology',
        description: 'Leading technology company focused on AI and gadgets',
        campaignCount: 3
      },
      {
        id: 'brand_2',
        name: 'HealthFirst',
        industry: 'Healthcare',
        description: 'Wellness and health products for modern lifestyle',
        campaignCount: 2
      },
      {
        id: 'brand_3',
        name: 'MoneyWise',
        industry: 'Finance',
        description: 'Financial education and investment services',
        campaignCount: 4
      }
    ];

    return NextResponse.json({
      success: true,
      data: { brands: mockBrands }
    });
  } catch (error) {
    console.error('[API] Get brands error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/marketplace/applications
 * Get user's applications
 */
export async function GET_APPLICATIONS(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Mock applications data
    const mockApplications = [
      {
        id: 'app_1',
        campaignTitle: 'Tech Gadget Launch Campaign',
        brandName: 'TechPro Co',
        status: 'pending',
        appliedDate: new Date(Date.now() - 86400000 * 3).toLocaleDateString(),
        pitch: 'I have a tech podcast with 25K listeners focused on AI innovations...'
      },
      {
        id: 'app_2',
        campaignTitle: 'Wellness & Health Content',
        brandName: 'HealthFirst',
        status: 'accepted',
        appliedDate: new Date(Date.now() - 86400000 * 7).toLocaleDateString(),
        pitch: 'Great fit for our health-focused content strategy...'
      }
    ];

    return NextResponse.json({
      success: true,
      data: { applications: mockApplications }
    });
  } catch (error) {
    console.error('[API] Get applications error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
