# CastReach Deployment Guide

This guide covers deploying CastReach to production on Vercel, AWS, or self-hosted environments.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [AWS Deployment](#aws-deployment)
6. [Self-Hosted Deployment](#self-hosted-deployment)
7. [Security Hardening](#security-hardening)
8. [Monitoring & Analytics](#monitoring--analytics)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

- [ ] All environment variables configured in production environment
- [ ] Database migrations run successfully (`npx prisma migrate deploy`)
- [ ] SSL certificate obtained and installed
- [ ] Domain configured with DNS records
- [ ] Email service (SendGrid) configured for transactional emails
- [ ] CDN configured for static assets and media
- [ ] Backup strategy implemented (daily database backups)
- [ ] Error monitoring setup (Sentry or similar)
- [ ] Analytics tracking configured (Google Analytics, Mixpanel)
- [ ] Security headers configured (CORS, CSP, HSTS)
- [ ] Rate limiting implemented on API endpoints
- [ ] Load testing completed (target: 1000 concurrent users)
- [ ] Staging environment mirrors production
- [ ] Team access controls configured
- [ ] Automated deployments setup (CI/CD pipelines)
- [ ] Rollback strategy documented
- [ ] Runbook created for common issues

## Environment Configuration

### Production Environment Variables

Create a `.env.production.local` file with all production values:

```bash
# Critical Production Setup
NEXTAUTH_SECRET=$(openssl rand -base64 32)  # Generate new secret for production
NEXTAUTH_URL=https://your-domain.com  # Must match deployment domain
NODE_ENV=production
```

### Environment-Specific Variables

**Staging** (`staging` branch):
```
DATABASE_URL=postgresql://staging_user:pass@staging-db.example.com/castreach_staging
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
```

**Production** (`main` branch):
```
DATABASE_URL=postgresql://prod_user:pass@prod-db.example.com/castreach_prod
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Secure Secrets Management

Use environment variable management services:

**Vercel Secrets:**
```bash
vercel env add DATABASE_URL
vercel env add OPENAI_API_KEY
vercel env add NEXTAUTH_SECRET
```

**AWS Secrets Manager:**
```bash
aws secretsmanager create-secret --name castreach/db-url \
  --secret-string "postgresql://..."
```

**HashiCorp Vault:**
- Store all sensitive values in Vault
- Rotate credentials every 90 days
- Audit all secret access

## Database Setup

### PostgreSQL Hosted Options

**1. Vercel Postgres** (Recommended for Vercel deployments)
```bash
# Create database
vercel postgres create

# Get connection string
vercel postgres env pull .env.local
```

**2. RDS (AWS)**
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier castreach-prod \
  --engine postgres \
  --allocated-storage 100 \
  --db-instance-class db.t3.medium
```

**3. Supabase** (PostgreSQL + extras)
- Go to supabase.com
- Create new project
- Click "Connect" → copy connection string
- Add to environment variables

### Database Migrations in Production

```bash
# Using Vercel Postgres with Prisma
npx prisma migrate deploy

# Using RDS/Supabase
DATABASE_URL="your-connection-string" npx prisma migrate deploy
```

### Database Backup Strategy

**Automated Backups:**
- Configure daily automated backups in RDS/Supabase
- Store backups encrypted in S3
- Test restore from backups monthly

**Backup Retention:**
- Keep 30-day rolling backups
- Monthly snapshots stored long-term
- Disaster recovery test quarterly

## Vercel Deployment

### Recommended Approach - Best for Next.js

**Step 1: Connect Repository**
```bash
# Push code to GitHub
git push origin main
```

**Step 2: Import to Vercel**
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Select GitHub repository
4. Click "Import"

**Step 3: Configure Environment**
1. In Project Settings → Environment Variables
2. Add all variables from `.env.production.local`
3. Ensure "Production" and "Preview" are set appropriately

**Step 4: Database Connection**
```bash
# Option 1: Use Vercel Postgres (recommended)
vercel postgres create
vercel postgres env pull

# Option 2: External PostgreSQL
# Add DATABASE_URL to environment variables
```

**Step 5: Deploy**
```bash
# Automatic: Push to main branch triggers deployment
git push origin main

# Manual deployment
vercel --prod
```

### Vercel Functions Best Practices

```typescript
// src/app/api/optimized/route.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // or 'edge' for Edge Functions
export const maxDuration = 60; // Maximum execution time in seconds

export async function GET(request: NextRequest) {
  // This function runs on Vercel Edge Network
  return NextResponse.json({ success: true });
}
```

### Vercel Analytics Setup

1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. Enable Speed Insights
4. Add custom events for business metrics

## AWS Deployment

### Option 1: EC2 + RDS

**Infrastructure Setup:**
```bash
# Create EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-groups default

# Create RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier castreach \
  --engine postgres \
  --allocated-storage 100
```

**Deploy Application:**
```bash
# Connect to EC2
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/your-org/castreach.git
cd castreach
npm install

# Setup environment
cp .env.example .env.production.local
# Edit with production values

# Build
npm run build

# Run with PM2
npm install -g pm2
pm2 start npm --name "castreach" -- start
pm2 startup
pm2 save
```

### Option 2: AWS App Runner

```bash
# Create App Runner service
aws apprunner create-service \
  --service-name castreach \
  --source-configuration \
    RepositoryConfiguration={RepositoryUrl=https://github.com/your-org/castreach,Branch=main} \
  --instance-role-arn arn:aws:iam::YOUR_ACCOUNT_ID:role/AppRunnerRole
```

### Option 3: ECS Fargate

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and Push:**
```bash
# Build image
docker build -t castreach:latest .

# Push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag castreach:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/castreach:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/castreach:latest
```

## Self-Hosted Deployment

### Ubuntu/Debian Server Setup

**Initial Server Configuration:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx

# Create application user
sudo useradd -m -s /bin/bash castreach
sudo su - castreach

# Clone repository
git clone https://github.com/your-org/castreach.git
cd castreach

# Install dependencies
npm install

# Build application
npm run build

# Setup environment
cp .env.example .env.production.local
# Edit with production values
```

**Setup Process Manager (PM2):**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 config
echo '{
  "apps": [{
    "name": "castreach",
    "script": "npm",
    "args": "start",
    "env": {
      "NODE_ENV": "production",
      "PORT": "3000"
    }
  }]
}' > ecosystem.config.js

# Start application
pm2 start ecosystem.config.js

# Setup startup
pm2 startup
pm2 save
```

**Setup Nginx Reverse Proxy:**
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/castreach
```

```nginx
upstream castreach {
  server localhost:3000;
}

server {
  listen 80;
  server_name your-domain.com;

  # Redirect to HTTPS
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name your-domain.com;

  # SSL Certificate (Let's Encrypt)
  ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

  # Security Headers
  add_header Strict-Transport-Security "max-age=31536000" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-XSS-Protection "1; mode=block" always;

  # Proxy to Node.js
  location / {
    proxy_pass http://castreach;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # Static files cache
  location /_next/static/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**Enable Nginx Site:**
```bash
sudo ln -s /etc/nginx/sites-available/castreach /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Setup SSL Certificate (Let's Encrypt):**
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Create certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

## Security Hardening

### 1. CORS Configuration

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL!);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### 2. Security Headers

```typescript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ]
};

export default nextConfig;
```

### 3. Rate Limiting

```typescript
// src/lib/utils/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per 60 seconds
});

export async function checkRateLimit(identifier: string) {
  const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
  
  return { success, limit, reset, remaining };
}
```

### 4. API Route Protection

```typescript
// src/app/api/protected/route.ts
import { checkRateLimit } from '@/lib/utils/rateLimit';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { success } = await checkRateLimit(ip);

  if (!success) {
    return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  // Process request
  return Response.json({ success: true });
}
```

## Monitoring & Analytics

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === 'development',
});

export default Sentry;
```

### 2. Performance Monitoring

```typescript
// src/app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout() {
  return (
    <html>
      <body>
        {/* Your content */}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Custom Logging

```typescript
// src/lib/utils/logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} ${message}`, data);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()} ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} ${message}`, error);
    // Send to Sentry in production
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error);
    }
  },
};
```

## Performance Optimization

### 1. Image Optimization

```tsx
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <Image
      src="/podcast-cover.jpg"
      alt="Podcast"
      width={400}
      height={400}
      priority
      quality={80}
    />
  );
}
```

### 2. Code Splitting

```typescript
// dynamic.config.ts
import dynamic from 'next/dynamic';

const AnalyticsComponent = dynamic(
  () => import('@/components/analytics/AnalyticsChart'),
  { loading: () => <div>Loading...</div> }
);
```

### 3. Database Query Optimization

```typescript
// Use indexes in Prisma schema
model Upload {
  id String @id @default(cuid())
  userId String
  status String @db.VarChar(20)
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

### 4. Caching Strategy

```typescript
// src/app/api/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Cache for 1 hour
  const response = NextResponse.json({ /* data */ });
  
  response.headers.set(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  );
  
  return response;
}
```

## Troubleshooting

### Deployment Issues

**Problem:** "Database connection refused"
```
Solution:
1. Verify DATABASE_URL is correct
2. Check database service is running
3. Verify firewall rules allow connection
4. Test connection: psql $DATABASE_URL
```

**Problem:** "NextAuth session not working"
```
Solution:
1. Verify NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL matches deployment domain
3. Check cookies are not blocked
4. Clear browser cookies and try again
```

**Problem:** "AI processing timeout"
```
Solution:
1. Increase timeout in Vercel/Lambda
2. Implement job queue (Bull/Agenda)
3. Process asynchronously with webhook
4. Use mock data for development
```

**Problem:** "Out of memory errors"
```
Solution:
1. Check database connection pooling
2. Implement pagination for large queries
3. Consider database optimization
4. Scale up server resources
```

### Performance Issues

**Slow API Response:**
```bash
# Check with curl
time curl -i https://your-domain.com/api/endpoint

# Check database query slow logs
tail -f /var/log/postgresql/postgresql.log
```

**High Server CPU:**
```bash
# Monitor with PM2
pm2 monit

# Check process usage
top -p $(pgrep -f 'node.*start')
```

## Production Checklist

- [ ] Database automated backups every 6 hours
- [ ] SSL/TLS certificate auto-renewal configured
- [ ] Error monitoring and alerting working
- [ ] Performance monitoring dashboard setup
- [ ] Daily log review process established
- [ ] Incident response runbook created
- [ ] Security scanning (e.g., Snyk) configured
- [ ] Load testing completed (>1000 concurrent users)
- [ ] Disaster recovery plan documented
- [ ] Team on-call rotation established
- [ ] Version control practices enforced (PR reviews, branch protection)
- [ ] Database query monitoring enabled
- [ ] API rate limiting tested and verified
- [ ] CORS policies validated for security
- [ ] Sensitive data logging disabled in production

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment
- **PostgreSQL Administration:** https://www.postgresql.org/docs/
- **Nginx Configuration:** https://nginx.org/en/docs/

## Next Steps

1. Choose your deployment platform (Vercel recommended)
2. Configure all environment variables
3. Run database migrations
4. Deploy to staging environment first
5. Test all critical flows
6. Configure monitoring and alerting
7. Deploy to production
8. Monitor logs and metrics for 24 hours
9. Perform smoke tests on production
10. Document any deployment-specific processes

