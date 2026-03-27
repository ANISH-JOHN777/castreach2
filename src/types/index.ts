/**
 * CastReach - Type Definitions
 * Core types for the application
 */

// User Types
export type UserRole = 'creator' | 'brand' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Podcast/Upload Types
export type ContentType = 'audio' | 'video';
export type UploadStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Upload {
  id: string;
  userId: string;
  title: string;
  description?: string;
  mediaUrl: string;
  type: ContentType;
  status: UploadStatus;
  duration?: number; // in seconds
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

// AI Processing Types
export interface AIOutput {
  id: string;
  uploadId: string;
  transcript: string;
  summary: string;
  keyHighlights: string[];
  captions: Caption[];
  socialPosts: SocialPost[];
  hashtags: string[];
  clipSuggestions?: ClipSuggestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Caption {
  text: string;
  startTime: number; // seconds
  endTime: number; // seconds
}

export interface SocialPost {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'tiktok';
  content: string;
  hashtags: string[];
}

export interface ClipSuggestion {
  startTime: number;
  endTime: number;
  title: string;
  reason: string;
}

// Analytics Types
export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'year';

export interface Analytics {
  id: string;
  userId: string;
  uploadId?: string;
  views: number;
  engagement: number;
  shares: number;
  platformBreakdown: Record<string, PlatformStats>;
  period: AnalyticsPeriod;
  date: Date;
}

export interface PlatformStats {
  platform: string;
  views: number;
  engagement: number;
  shares: number;
}

// Brand & Marketplace Types
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description: string;
  industry: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  brandId: string;
  title: string;
  description: string;
  budget: number;
  targetAudience: string;
  requirements: string[];
  deadline: Date;
  status: 'active' | 'closed' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  userId: string;
  campaignId: string;
  brandId: string;
  status: ApplicationStatus;
  pitch: string;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription Types
export type PlanType = 'free' | 'pro' | 'premium' | 'enterprise';

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanFeatures {
  uploads: number;
  aiProcessing: boolean;
  analytics: boolean;
  platformDistribution: number;
  brandMatching: boolean;
  monthlyPrice: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Session Types
export interface Session {
  user: User;
  expires: Date;
}
