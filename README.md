# CastReach - AI-Powered Podcast Growth Platform

A production-grade SaaS platform for podcast creators to automate distribution, leverage AI for content generation, and monetize through brand collaborations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Setup database
npx prisma migrate dev

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Features

### 1. Podcast Upload & Management
- Upload audio/video files (up to 500MB)
- Auto-detect duration and metadata
- Multi-format support (MP3, WAV, OGG, MP4, MOV)

### 2. AI-Powered Content Generation
- Automatic transcription (Whisper API)
- Smart summarization
- Timestamped captions
- Multi-platform social posts
- Hashtag suggestions
- Viral clip suggestions

### 3. Multi-Platform Distribution
- Publish to Spotify, YouTube, Apple Podcasts
- Scheduled publishing
- One-click distribution

### 4. Comprehensive Analytics
- Real-time view tracking
- Per-platform engagement metrics
- Growth trends and predictions
- Audience insights

### 5. Brand Marketplace
- Browse sponsorship opportunities
- AI-powered brand matching
- Application tracking
- Commission-based earnings (5-10%)

### 6. Monetization System
- 4 subscription tiers (Free, Pro, Premium, Enterprise)
- Brand deal commissions
- Premium eatue payments
- Payout management

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js + Google OAuth
- **Storage**: Firebase Storage / Cloudinary
- **AI**: OpenAI Whisper
- **Hosting**: Vercel

### Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── api/               # Backend routes
│   ├── auth/              # Auth pages
│   ├── dashboard/         # Main app
│   └── page.tsx           # Landing
├── components/            # React components
├── lib/                   # Utilities
│   ├── ai/               # AI module
│   ├── db/               # Database
│   └── auth.ts           # NextAuth config
├── types/                # TypeScript types
└── middleware.ts         # Auth middleware
```

## 🔐 Authentication

### Supported Methods
1. **Email/Password** - Registration + Login
2. **Google OAuth** - One-click sign-in

### User Roles
- **Creator** - Podcasters
- **Brand** - Sponsors
- **Admin** - Platform managers

## 💻 API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Create account
- `GET /api/auth/session` - Get session

### Uploads
- `POST /api/upload` - Upload podcast
- `GET /api/upload` - List uploads

### Analytics
- `GET /api/analytics` - Get dashboard stats
- `POST /api/analytics` - Log event

### Marketplace
- `GET /api/marketplace` - List campaigns
- `POST /api/marketplace` - Create application

### Subscription
- `GET /api/subscription` - Get plan
- `POST /api/subscription` - Upgrade plan

## 📊 Database Schema

### Main Models
- **User** - Accounts (creator/brand/admin)
- **Upload** - Podcast episodes
- **AIOutput** - Generated content
- **Analytics** - Performance metrics
- **Brand** - Brand profiles
- **Campaign** - Sponsorship offers
- **Application** - Creator applications
- **Subscription** - Billing info

See `prisma/schema.prisma` for full schema.

## 💳 Pricing

| Feature | Free | Pro | Premium | Enterprise |
|---------|------|-----|---------|------------|
| Price | $0 | $29 | $99 | $299 |
| Uploads/mo | 5 | 50 | 500 | ∞ |
| AI | ✗ | ✓ | ✓ | ✓ |
| Analytics | ✗ | ✓ | ✓ | ✓ |
| Platforms | 1 | 3 | 6 | 12 |
| Marketplace | ✗ | ✓ | ✓ | ✓ |

## 🎨 Design System

- **Colors**: Pink (#FADADD), Black (#000), White
- **Components**: Reusable in `src/components/common`
- **Responsive**: Mobile-first Tailwind CSS
- **Accessible**: WCAG 2.1 compliant

## 🤖 AI Module

Handles:
- Transcription → Summarization → Captions
- Social media post generation
- Hashtag suggestions
- Clip recommendations

**Mock data** provided for development without API keys.

## 🔒 Security

- NextAuth.js JWT authentication
- CSRF protection
- Password hashing
- Role-based access control
- Secure session tokens
- Environment isolation

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Git push triggers auto-deployment
```

### Manual
```bash
npm run build
npm start
```

### Environment Setup
Required for production:
- PostgreSQL database
- Firebase Storage bucket
- OpenAI API key
- Stripe keys (for payments)
- Google OAuth credentials
- Email service (SendGrid)

## 📦 Dependencies

Key packages:
- `next` - 14+ ≤ 15
- `react` - 18+
- `next-auth` - 4.24+
- `@prisma/client` - 5+
- `tailwindcss` - 3+
- `typescript` - 5+

## 🧪 Development

### Local Setup
```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Database
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset (dev only)
npx prisma migrate reset

# Seed
npx prisma db seed
```

### Environment Variables
See `.env.example` for all required variables.

## 📱 Pages

### Public
- `/` - Landing page
- `/auth/login` - Sign in
- `/auth/signup` - Register

### Protected (Dashboard)
- `/dashboard` - Overview
- `/dashboard/studio` - Upload & AI
- `/dashboard/analytics` - Metrics
- `/dashboard/marketplace` - Brands
- `/dashboard/monetization` - Billing
- `/dashboard/settings` - Account

## 🔧 Configuration

### Next.js
- App Router enabled
- TypeScript strict mode
- ESLint configured
- Route handlers for API

### Tailwind CSS
- Custom theme colors
- Responsive utilities
- Smooth animations

### Prisma
- PostgreSQL provider
- Auto-generated types
- Migration tracking

## 📈 Scaling Considerations

- **Serverless**: Auto-scaling API routes
- **Database**: Connection pooling
- **Storage**: CDN via Cloudinary
- **Cache**: Session caching ready
- **Load**: Request batching ready

## 🤝 Support

- GitHub Issues for bugs/features
- Email: support@castreach.app
- Discord community (coming soon)

## 📄 License

MIT License - see LICENSE file

## 🙏 Acknowledgments

Built with:
- Next.js & Vercel
- OpenAI & Whisper
- Prisma & PostgreSQL
- Tailwind CSS
- NextAuth.js

---

**The all-in-one platform for podcast creators to grow, automate, and monetize.**

Created by [Your Team] | [Website] | [GitHub]
