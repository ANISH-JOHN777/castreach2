/**
 * Utility Functions
 * Common helpers, formatters, validators
 */

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Plan features configuration
export const PLAN_FEATURES = {
  free: {
    uploads: 5,
    aiProcessing: false,
    analytics: false,
    platformDistribution: 1,
    brandMatching: false,
    monthlyPrice: 0
  },
  pro: {
    uploads: 50,
    aiProcessing: true,
    analytics: true,
    platformDistribution: 3,
    brandMatching: true,
    monthlyPrice: 29
  },
  premium: {
    uploads: 500,
    aiProcessing: true,
    analytics: true,
    platformDistribution: 6,
    brandMatching: true,
    monthlyPrice: 99
  },
  enterprise: {
    uploads: Infinity,
    aiProcessing: true,
    analytics: true,
    platformDistribution: 12,
    brandMatching: true,
    monthlyPrice: 299
  }
};

export function getPlanFeatures(plan: string) {
  return (
    PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES] || PLAN_FEATURES.free
  );
}

export function canUpload(plan: string, currentUploads: number): boolean {
  const features = getPlanFeatures(plan);
  return currentUploads < features.uploads;
}

export function canUseAI(plan: string): boolean {
  const features = getPlanFeatures(plan);
  return features.aiProcessing;
}

export function canAccessAnalytics(plan: string): boolean {
  const features = getPlanFeatures(plan);
  return features.analytics;
}

export function canAccessMarketplace(plan: string): boolean {
  const features = getPlanFeatures(plan);
  return features.brandMatching;
}

export const PLATFORM_ICONS = {
  youtube: '▶️',
  spotify: '🎵',
  applePodcasts: '🎙️',
  twitter: '𝕏',
  instagram: '📷',
  linkedin: '💼',
  tiktok: '✨',
  facebook: 'f'
};
