# CastReach Development Guidelines

## Project Overview

CastReach is a production-grade SaaS platform for podcast growth, automation, and monetization. It combines modern web technologies with AI-powered content generation and multi-platform distribution.

## Tech Stack & Tools

- **Language**: TypeScript
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Storage**: Firebase Storage / Cloudinary
- **AI**: OpenAI Whisper API
- **Hosting**: Vercel
- **APIs**: RESTful with Next.js Route Handlers

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # Backend routes
│   │   ├── auth/[...nextauth]/   # Authentication
│   │   ├── upload/               # File uploads
│   │   ├── analytics/            # Analytics
│   │   ├── marketplace/          # Brands & campaigns
│   │   └── subscription/         # Billing
│   ├── auth/
│   │   ├── login/                # Sign in page
│   │   └── signup/               # Register page
│   ├── dashboard/
│   │   ├── studio/               # Upload & AI processing
│   │   ├── analytics/            # Performance dashboard
│   │   ├── marketplace/          # Brand opportunities
│   │   ├── monetization/         # Billing & earnings
│   │   ├── settings/             # Account settings
│   │   └── page.tsx              # Main dashboard
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # React Components
│   ├── common/                   # Reusable components
│   │   ├── index.tsx            # Button, Input, Card, Badge, Modal, etc.
│   │   └── Layout.tsx           # Sidebar, Header, DashboardLayout
│   ├── auth/                     # Auth components
│   │   └── index.tsx            # LoginForm, SignupForm, OAuthButtons
│   ├── dashboard/                # Dashboard components
│   │   └── index.tsx            # StatsCard, RecentUploads, QuickAction
│   ├── studio/                   # Upload components
│   │   └── index.tsx            # UploadForm, AIOutputDisplay
│   ├── analytics/                # Analytics components
│   │   └── index.tsx            # AnalyticsChart, PlatformBreakdown
│   └── marketplace/              # Marketplace components
│       └── index.tsx            # CampaignCard, ApplicationForm
│
├── lib/                          # Utilities & Services
│   ├── ai/                       # AI processing pipeline
│   │   └── index.ts             # Transcription, summarization, etc.
│   ├── db/                       # Database utilities
│   │   └── index.ts             # Prisma queries & helpers
│   ├── auth.ts                   # NextAuth configuration
│   └── utils/
│       └── constants.ts          # Plans, constants, helpers
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
├── middleware.ts                 # NextAuth middleware
├── globals.css                   # Global styles
```

## Key Features Implementation

### 1. Authentication Flow
- **Location**: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]`
- **Methods**: Email/Password + Google OAuth
- **Protected Routes**: Use `useSession()` hook with redirect
- **Session Strategy**: JWT with 30-day expiry

### 2. Podcast Upload
- **Location**: `src/app/api/upload`, `src/components/studio`
- **Process**: File validation → Storage → Database record → AI processing
- **Limits**: 500MB max, MP3/WAV/OGG audio, MP4/MOV video
- **Async AI**: Background processing with progress tracking

### 3. AI Processing Pipeline
- **Location**: `src/lib/ai/index.ts`
- **Tasks**: Transcribe → Summarize → Generate captions/posts/hashtags
- **Fallback**: Mock data when APIs unavailable
- **Cost**: Track API usage for quota management

### 4. Analytics Dashboard
- **Location**: `src/app/api/analytics`, `src/components/analytics`
- **Metrics**: Views, engagement, shares per platform
- **Updates**: Real-time or batch processing
- **Visualization**: Charts, trends, platform breakdown

### 5. Brand Marketplace
- **Location**: `src/app/api/marketplace`, `src/components/marketplace`
- **Features**: Campaign listing, AI matching, application tracking
- **Earnings**: Commission tracking, payout management
- **Status**: Application workflow (pending → accepted/rejected → completed)

### 6. Monetization
- **Plans**: Free (5 uploads) → Pro ($29) → Premium ($99) → Enterprise ($299)
- **Features**: Gated by plan features
- **Payments**: Stripe integration (setup ready)
- **Earnings**: Brand commissions + subscription revenue

## Component Development

### Creating Components

```tsx
// src/components/section/ComponentName.tsx
'use client';

interface ComponentProps {
  prop1: string;
  onAction?: () => void;
}

export const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  onAction
}) => {
  return (
    <div className="space-y-4">
      {/* Component content */}
    </div>
  );
};
```

### Using Reusable Components

```tsx
import { Button, Card, Input, Badge, Modal } from '@/components/common';

<Card className="p-6">
  <Input type="text" label="Name" />
  <Button onClick={handleSubmit}>Submit</Button>
  <Badge variant="success">Active</Badge>
</Card>
```

## API Development

### Creating API Routes

```tsx
// src/app/api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Process request
    const data = await fetchData();

    // Return response
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

## Database Operations

### Using Prisma

```tsx
import { prisma } from '@/lib/db';

// Create
const user = await prisma.user.create({
  data: { email, name, role }
});

// Read
const upload = await prisma.upload.findUnique({
  where: { id: uploadId },
  include: { aiOutput: true }
});

// Update
await prisma.upload.update({
  where: { id: uploadId },
  data: { status: 'COMPLETED' }
});

// Delete
await prisma.application.delete({
  where: { id: appId }
});
```

### Migrations

```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# Reset database (dev only)
npx prisma migrate reset

# View schema
npx prisma studio
```

## Frontend Patterns

### Protected Pages

```tsx
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/auth/login');

  return <DashboardLayout>{/* Content */}</DashboardLayout>;
}
```

### Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  try {
    // API call
  } finally {
    setIsLoading(false);
  }
};

<Button isLoading={isLoading}>Submit</Button>
```

## Environment Variables

### Required for Development
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Optional for Full Features
```
OPENAI_API_KEY=sk-...
FIREBASE_PROJECT_ID=...
STRIPE_PUBLIC_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
```

## Code Quality

### Type Safety
- Use TypeScript strictly
- Define interfaces for all data shapes
- Use types from `src/types/index.ts`

### Error Handling
- Try-catch in async functions
- Return meaningful error messages
- Log errors with context

### Performance
- Use React.memo for expensive components
- Memoize callbacks with useCallback
- Lazy load components with dynamic()
- Optimize images with next/image

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast ≥ 4.5:1

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Coverage
```bash
npm run test:coverage
```

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Vercel Deployment
```bash
git push origin main
# (Auto-deployed via Vercel webhook)
```

## Common Tasks

### Adding a New Feature
1. Create database schema in `prisma/schema.prisma`
2. Run migration: `npx prisma migrate dev --name feature_name`
3. Create API route in `src/app/api/feature/route.ts`
4. Create UI components in `src/components/section/`
5. Create page in `src/app/section/page.tsx`
6. Add types in `src/types/index.ts`

### Styling
- Use Tailwind CSS classes
- Follow BEM convention for custom CSS
- Use theme colors: `pink-400`, `gray-600`, etc.
- Responsive classes: `sm:`, `md:`, `lg:`, `xl:`

### Database Queries
- Use helpers from `src/lib/db/index.ts`
- Always include necessary relations
- Use `where`, `orderBy`, `take`, `skip` for filtering
- Log queries in development with Prisma config

## Best Practices

1. **Keep components small** - Max 200 lines
2. **Separate concerns** - Components, services, utilities
3. **DRY principle** - Extract reusable code
4. **Error boundaries** - Wrap risky components
5. **Lazy loading** - Load routes and components on demand
6. **Security** - Validate, sanitize, authenticate, authorize
7. **Performance** - Optimize images, lazy load, code split
8. **Accessibility** - WCAG 2.1 AA standard
9. **Documentation** - JSDoc comments, README
10. **Testing** - Unit tests, integration tests, E2E

## Troubleshooting

### Database Connection Issues
```bash
# Check connection
npx prisma db push

# Reset (dev only)
npx prisma migrate reset
```

### NextAuth Issues
- Check NEXTAUTH_SECRET is set
- Verify OAuth credentials are correct
- Check NEXTAUTH_URL matches deployment URL

### AI Processing Issues
- Check OpenAI API key is valid
- Verify file upload to storage succeeded
- Check API rate limits
- Review error logs in console

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Contact

Questions or need clarification? Open an issue or contact the team.
