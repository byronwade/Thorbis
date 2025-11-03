# Stratos - Field Service Management Platform

Enterprise-grade field service management platform built with Next.js 16, React 19, and Supabase.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Payments**: Stripe
- **Communications**: Telnyx (Voice + SMS)
- **Email**: Resend + React Email
- **AI**: Vercel AI SDK (Anthropic, OpenAI, Google, xAI)

## 🏗️ Project Structure

```
stratos/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (dashboard)/  # Protected dashboard routes
│   │   ├── (marketing)/  # Public marketing pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui primitives
│   │   └── features/     # Feature components
│   ├── lib/              # Utilities and configurations
│   ├── actions/          # Server Actions
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript types
├── supabase/
│   ├── migrations/       # Database migrations
│   └── seeds/            # Seed data
├── docs/                 # Project documentation
├── scripts/              # Build and utility scripts
└── public/               # Static assets
```

## 📦 Key Features

- **Customer Management**: Complete CRM with properties, contacts, and history
- **Work Management**: Jobs, estimates, invoices, and scheduling
- **Communications**: Integrated voice, SMS, and email
- **Payments**: Stripe integration with subscriptions and metering
- **Field Service**: Mobile-optimized scheduling and dispatch
- **Reporting**: Real-time analytics and dashboards
- **Multi-tenant**: Organization-based access control
- **Offline Support**: PWA with offline capabilities

## 🛠️ Development

```bash
# Development server
pnpm dev

# Clean build artifacts and start dev server
pnpm dev:clean

# Build for production
pnpm build

# Lint code
pnpm lint

# Analyze bundle size
pnpm build:analyze

# Database commands
pnpm db:generate  # Generate migrations
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Drizzle Studio
pnpm db:seed      # Seed database
```

### Troubleshooting

#### EPERM Errors on Windows/OneDrive

If you see `EPERM: operation not permitted` errors when running `pnpm dev`, this is caused by OneDrive syncing conflicts with the `.next` directory.

**Quick Fix:**

```bash
# Clean and restart
pnpm dev:clean
```

**Permanent Solution (choose one):**

1. **Exclude .next from OneDrive** (Recommended):
   - Right-click the `.next` folder in File Explorer
   - Select "Free up space" to exclude it from OneDrive sync

2. **Move project outside OneDrive**:

   ```bash
   # Move to C:\Projects or another non-OneDrive location
   move C:\Users\YourName\OneDrive\Desktop\Stratos C:\Projects\Stratos
   ```

3. **Use PowerShell script**:

   ```powershell
   # Run the cleanup script
   ./scripts/clean-next.ps1
   ```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Quick Start Guide](docs/QUICK_START.md)
- [Authentication Setup](docs/AUTHENTICATION_SETUP_GUIDE.md)
- [Stripe Integration](docs/STRIPE_QUICK_START.md)
- [Telnyx Communications](docs/TELNYX_QUICK_REFERENCE.md)
- [Settings System](docs/SETTINGS_README.md)
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Server-side validation with Zod
- Secure session management with Supabase Auth
- Environment variables for secrets
- CSRF protection on forms
- Rate limiting on API routes

## 🎨 Code Standards

This project follows strict coding standards:

- **Server Components First**: Use Server Components by default
- **Performance**: Bundle size < 200KB, Core Web Vitals optimized
- **Security**: RLS policies required, server-side validation always
- **TypeScript**: Strict mode, no `any` types
- **Accessibility**: WCAG AA compliance
- **Testing**: 80% code coverage target

See [AGENTS.md](docs/AGENTS.md) for complete coding guidelines.

## 📄 License

Proprietary - All rights reserved

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.
