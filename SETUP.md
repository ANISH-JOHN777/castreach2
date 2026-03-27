# CastReach - Complete Setup Guide

This guide will walk you through setting up and running the CastReach platform locally.

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **PostgreSQL** 14+ or **MongoDB** 5+ (for database)
- **An IDE** like VS Code

## Step 1: Project Initialization

The project is already scaffolded with Next.js 14. Skip to Step 2 if you're continuing a setup.

```bash
cd castreach2
```

## Step 2: Install Dependencies

```bash
npm install
```

All required packages including Next.js, NextAuth.js, Prisma, Tailwind CSS, etc. will be installed.

**Key packages installed:**
- `next` 14+ - React framework
- `react` 18+ - UI library
- `next-auth` - Authentication
- `@prisma/client` - Database ORM
- `prisma` - Migrations and schema
- `tailwindcss` - Styling
- `typescript` - Type safety

## Step 3: Environment Configuration

### Copy template
```bash
cp .env.example .env.local
```

### Edit `.env.local` with your values

#### Essential Variables (Required)
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with: openssl rand -base64 32

# Database (choose one)
DATABASE_URL=postgresql://user:password@localhost:5432/castreach
# OR
# DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/castreach
```

#### Authentication
```
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Get from: https://console.cloud.google.com
```

#### Optional (for full features)
```
# AI Processing
OPENAI_API_KEY=sk-...

# File Storage
FIREBASE_PROJECT_ID=your-project-id
CLOUDINARY_CLOUD_NAME=your-cloud-name

# Payments
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

## Step 4: Database Setup

### Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# View database
npx prisma studio
```

This will:
1. Create database tables
2. Generate TypeScript types
3. Open Prisma Studio at http://localhost:5555 (optional)

### Seed Sample Data (Optional)

```bash
npx prisma db seed
```

## Step 5: Run Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Quick Test

1. **Landing Page** - http://localhost:3000
2. **Sign Up** - http://localhost:3000/auth/signup
3. **Create Account** - Use email: `test@example.com`, password: `password123`, role: `Creator`
4. **Dashboard** - http://localhost:3000/dashboard

## Database Configuration

### PostgreSQL (Recommended)

```bash
# Create local database
createdb castreach

# Update .env.local
DATABASE_URL="postgresql://localhost/castreach"
```

### MongoDB

```bash
# MongoDB Atlas connection
DATABASE_URL="mongodb+srv://user:password@cluster0.mongodb.net/castreach?retryWrites=true&w=majority"
```

## Authentication Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable "Google+ API"
4. Create OAuth 2.0 Credentials:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3000/api/auth/signin/google`
5. Copy Client ID and Secret to `.env.local`

### NextAuth Secret

```bash
# Generate on macOS/Linux
openssl rand -base64 32

# Or use online: https://generate-secret.vercel.app/32
```

## File Structure Verification

Verify these directories exist:

```
castreach2/
✓ src/
  ✓ app/
  ✓ components/
  ✓ lib/
  ✓ types/
✓ prisma/
✓ public/
✓ .env.example
✓ package.json
✓ tsconfig.json
✓ tailwind.config.ts
```

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Database Prisma Studio
npx prisma studio

# Database migrations
npx prisma migrate dev --name migration_name
npx prisma migrate reset
```

## API Testing

### Login Endpoint
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Upload Endpoint
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@podcast.mp3" \
  -F "title=My Podcast Episode"
```

## Troubleshooting

### Database Connection
```bash
# Check PostgreSQL is running
psql -U postgres

# Test connection
psql -U user -d castreach -h localhost
```

### Port Already in Use
```bash
# Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### TypeScript Errors
```bash
# Regenerate Prisma types
npx prisma generate

# Check types
npx tsc --noEmit
```

### NextAuth Issues
- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches current environment
- Verify Google OAuth credentials
- Clear `.next` cache: `rm -rf .next`

## Next Steps

1. **Create test user** - Visit http://localhost:3000/auth/signup
2. **Upload podcast** - Go to Dashboard → Studio
3. **View analytics** - Go to Dashboard → Analytics
4. **Explore marketplace** - Go to Dashboard → Marketplace

## Environment Checklist

- [ ] `.env.local` created and configured
- [ ] Database connection working (`npx prisma studio` opens)
- [ ] Google OAuth credentials added (optional)
- [ ] OpenAI key added (optional, for AI features)
- [ ] Development server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can create account and login

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `NEXTAUTH_SECRET is not defined` | Generate and add to .env.local |
| Database connection refused | Start PostgreSQL, check DATABASE_URL |
| Port 3000 in use | Use `PORT=3001 npm run dev` |
| Google OAuth fails | Verify credentials and redirect URLs |
| Prisma type errors | Run `npx prisma generate` |

## Performance Tips

- Use `npx prisma studio` to debug database queries
- Enable TypeScript strict mode
- Use Tailwind CSS utilities (minimal custom CSS)
- Lazy load components with `dynamic()`

## Security Notes

- Never commit `.env.local` to git
- Use strong `NEXTAUTH_SECRET`
- Validate all user inputs
- Keep dependencies updated: `npm update`
- Use HTTPS in production

## Documentation

- [README.md](../README.md) - Project overview
- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Development guidelines
- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth Docs](https://next-auth.js.org/)

## Getting Help

- 📖 Check [README.md](../README.md)
- 🐛 Search GitHub Issues
- 💬 Check Discord community (coming soon)
- 📧 Email: support@castreach.app

---

**Happy coding! 🚀**
