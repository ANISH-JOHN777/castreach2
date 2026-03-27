/**
 * Database Utilities
 * Prisma client initialization and helper functions
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : []
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Database query helpers
 */

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: true
    }
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  role?: 'creator' | 'brand' | 'admin' | 'CREATOR' | 'BRAND' | 'ADMIN';
  profileImage?: string;
}) {
  const roleMap: Record<string, 'CREATOR' | 'BRAND' | 'ADMIN'> = {
    'creator': 'CREATOR',
    'brand': 'BRAND',
    'admin': 'ADMIN',
    'CREATOR': 'CREATOR',
    'BRAND': 'BRAND',
    'ADMIN': 'ADMIN'
  };

  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: roleMap[data.role || 'creator'] as any,
      profileImage: data.profileImage,
      subscriptions: {
        create: {
          plan: 'FREE' as any,
          status: 'ACTIVE' as any,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        }
      }
    },
    include: {
      subscriptions: true
    }
  });
}

export async function getUploads(userId: string, limit = 20, offset = 0) {
  return prisma.upload.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      aiOutput: true
    }
  });
}

export async function getUploadById(uploadId: string) {
  return prisma.upload.findUnique({
    where: { id: uploadId },
    include: {
      aiOutput: {
        include: {
          captions: true,
          socialPosts: true,
          clipSuggestions: true
        }
      },
      analytics: true
    }
  });
}

export async function createUpload(data: {
  userId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  type: 'AUDIO' | 'VIDEO';
  duration?: number;
}) {
  return prisma.upload.create({
    data: {
      ...data,
      status: 'PENDING'
    }
  });
}

export async function updateUploadStatus(
  uploadId: string,
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
) {
  return prisma.upload.update({
    where: { id: uploadId },
    data: { status, updatedAt: new Date() }
  });
}

export async function saveAIOutput(
  uploadId: string,
  aiData: {
    transcript: string;
    summary: string;
    keyHighlights: string[];
    hashtags: string[];
    captions?: any[];
    socialPosts?: any[];
    clipSuggestions?: any[];
  }
) {
  return prisma.aIOutput.create({
    data: {
      uploadId,
      transcript: aiData.transcript,
      summary: aiData.summary,
      keyHighlights: aiData.keyHighlights,
      hashtags: aiData.hashtags,
      captions: {
        createMany: {
          data: aiData.captions || []
        }
      },
      socialPosts: {
        createMany: {
          data: aiData.socialPosts || []
        }
      },
      clipSuggestions: {
        createMany: {
          data: aiData.clipSuggestions || []
        }
      }
    },
    include: {
      captions: true,
      socialPosts: true,
      clipSuggestions: true
    }
  });
}

export async function getAnalytics(userId: string) {
  const analytics = await prisma.analytics.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30
  });

  const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
  const totalEngagement = analytics.reduce((sum, a) => sum + a.engagement, 0);

  return {
    analytics,
    totalViews,
    totalEngagement,
    averageEngagementRate:
      totalViews > 0 ? ((totalEngagement / totalViews) * 100).toFixed(2) : '0.00'
  };
}

export async function saveAnalytics(data: {
  userId: string;
  uploadId?: string;
  views: number;
  engagement: number;
  shares: number;
  platformBreakdown?: Record<string, any>;
}) {
  return prisma.analytics.create({
    data: {
      ...data,
      platformBreakdown: data.platformBreakdown || {}
    }
  });
}

export async function getBrands(limit = 20, offset = 0) {
  return prisma.brand.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      campaigns: {
        where: { status: 'ACTIVE' }
      }
    }
  });
}

export async function getCampaigns(
  brandId?: string,
  limit = 20,
  offset = 0
) {
  return prisma.campaign.findMany({
    where: {
      ...(brandId && { brandId })
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      brand: true,
      applications: true
    }
  });
}

export async function createBrand(data: {
  ownerId: string;
  name: string;
  description: string;
  industry: string;
  logo?: string;
  website?: string;
}) {
  return prisma.brand.create({
    data
  });
}

export async function createCampaign(data: {
  brandId: string;
  title: string;
  description: string;
  budget: number;
  targetAudience: string;
  requirements: string[];
  deadline: Date;
}) {
  return prisma.campaign.create({
    data: {
      ...data,
      status: 'ACTIVE'
    }
  });
}

export async function createApplication(data: {
  userId: string;
  campaignId: string;
  brandId: string;
  pitch: string;
}) {
  return prisma.application.create({
    data: {
      ...data,
      status: 'PENDING'
    }
  });
}

export async function getApplications(
  userId?: string,
  campaignId?: string,
  limit = 20,
  offset = 0
) {
  return prisma.application.findMany({
    where: {
      ...(userId && { userId }),
      ...(campaignId && { campaignId })
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
    include: {
      campaign: {
        include: { brand: true }
      }
    }
  });
}

export async function getSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId }
  });
}

export async function updateSubscription(
  userId: string,
  plan: 'FREE' | 'PRO' | 'PREMIUM' | 'ENTERPRISE'
) {
  const nextPeriodEnd = new Date();
  nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

  return prisma.subscription.update({
    where: { userId },
    data: {
      plan,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: nextPeriodEnd,
      updatedAt: new Date()
    }
  });
}
