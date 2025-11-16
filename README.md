# Thorbis - Field Service Management Platform

Enterprise-grade field service management platform for field and home services teams, built with Next.js 16, React 19, and Supabase.

Thorbis is designed for:
- **Operational reliability**: strong data model, RLS-by-default, safe server-side mutations
- **Performance**: App Router, Partial Prerendering (PPR), streaming, and aggressive caching
- **Real-world workflows**: scheduling, communications, billing, and mobile-first UX

## 🧭 Table of Contents

- [🚀 Quick Start](#-quick-start)
- [📋 Tech Stack](#-tech-stack)
- [🏗️ Project Structure](#-project-structure)
- [📦 Key Features](#-key-features)
- [🛠️ Development](#-development)
- [🔑 API Configuration](#-api-configuration)
- [📚 Documentation](#-documentation)
- [🔒 Security](#-security)
- [🎨 Code Standards](#-code-standards)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
# See docs/ENVIRONMENT_VARIABLES.md for detailed configuration guide

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

> **Tip:** After big branch switches or dependency changes, run **`pnpm dev:clean`** once to reset build artifacts.

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
thorbis/
├── src/
│   ├── app/                  # Next.js App Router (routes/layouts/api)
│   │   ├── (dashboard)/      # Protected dashboard routes
│   │   ├── (marketing)/      # Public marketing pages
│   │   └── api/              # Route handlers (webhooks, APIs)
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui primitives
│   │   └── features/         # Feature components
│   ├── lib/                  # Utilities, clients, configuration
│   ├── actions/              # Server Actions (mutations, workflows)
│   ├── hooks/                # Custom React hooks (client-only)
│   └── types/                # Shared TypeScript types
├── supabase/
│   ├── migrations/           # Database migrations
│   ├── seeds/                # Seed data
│   └── manual/               # One-off SQL helpers
├── docs/                     # 📚 Organized documentation
│   ├── README.md             # Documentation index
│   ├── migrations/           # Migration & upgrade guides
│   ├── performance/          # Performance optimization
│   ├── architecture/         # System architecture
│   ├── status/               # Implementation status
│   └── troubleshooting/      # Error resolution guides
├── notes/                    # Implementation notes
├── scripts/                  # Build and utility scripts
├── emails/                   # React Email templates & layouts
└── public/                   # Static assets
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

**Recommended workflow**

- **Feature work**
  - Run `pnpm dev`
  - Use Server Components by default; add `"use client"` only for interactive islands
  - Prefer Server Actions over ad-hoc API routes for authenticated mutations

- **Schema changes**
  - Evolve the Supabase schema via migrations
  - Run `pnpm db:generate` then `pnpm db:push`
  - Keep RLS policies up-to-date with schema changes

- **Performance tuning**
  - Use `pnpm build:analyze` to inspect bundle size
  - Prefer server data fetching, PPR, and streaming where possible

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
   move C:\Users\YourName\OneDrive\Desktop\Thorbis C:\Projects\Thorbis
   ```

3. **Use PowerShell script**:

   ```powershell
   # Run the cleanup script
   ./scripts/clean-next.ps1
   ```

## 🔑 API Configuration

### Google Maps Services (Autocomplete, Street View, Suppliers, Time Zone)

The application uses multiple Google Maps APIs for comprehensive location intelligence:

**Features:**
- 📍 **Address Autocomplete** - Quick property address entry (Places API)
- 📸 **Street View Photos** - Actual property photos (Street View Static API)
- 🏪 **Nearby Suppliers** - Home Depot, Lowe's, etc. with reviews & ratings (Places API)
- 🌐 **Time Zone Detection** - Automatic timezone for scheduling (Time Zone API)
- 🗺️ **Geocoding** - Address to coordinates conversion (Geocoding API)

**Setup:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - ✅ **Places API** (address autocomplete & supplier search)
   - ✅ **Maps JavaScript API** (required for autocomplete)
   - ✅ **Street View Static API** (property photos)
   - ✅ **Time Zone API** (timezone detection)
   - ✅ **Geocoding API** (address to coordinates)
4. Create an API key:
   - Navigate to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API Key**
   - (Recommended) Restrict the key to your domain and the enabled APIs
5. Add to your `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

**Cost:** ALL FREE within generous limits:
- 🆓 Street View: 25,000 requests/month
- 🆓 Places API: $200/month credit ≈ 8,000 requests
- 🆓 Time Zone: **UNLIMITED** (no charge)
- 🆓 Geocoding: $200/month credit ≈ 40,000 requests

Every Google Cloud account gets $200/month free credit - more than enough for typical usage!

### Optional: Free Data APIs (No Keys Required)

The operational intelligence panel also uses these **100% free, zero-config APIs**:

- 📊 **US Census Bureau** - Demographics (population, income, education)
- 🌬️ **AirNow** - Air quality index and pollutants
- 🏔️ **USGS Elevation** - Elevation data
- 🏫 **OpenStreetMap** - Schools, walkability scores, building data
- 🚰 **USGS Water Services** - Water quality data
- 🌊 **FEMA NFHL** - Flood zone information
- 🌦️ **National Weather Service** - Weather forecasts and alerts

**No API keys needed!** These services work out of the box. The app gracefully handles rate limits or regional unavailability - if any service fails, the rest continue working normally.

### RentCast API (Property Information) - RECOMMENDED

The operational intelligence panel displays property characteristics, tax assessments, and market data using the RentCast API.

**Setup:**

1. Go to [RentCast](https://rentcast.io/api)
2. Create a free account
3. Generate an API key from your dashboard
4. Add to your `.env.local`:
   ```
   RENTCAST_API_KEY=your_api_key_here
   ```

**Free Tier (Forever, No Trial):**
- ✅ **50 requests per month** - PERMANENT free tier
- ✅ Property details (year built, bedrooms, bathrooms, square footage, etc.)
- ✅ Tax assessment data & annual property taxes
- ✅ Market valuations & sale history
- ✅ Owner information
- ✅ Rental estimates

**With 30-day caching:** 50 requests = ~1,500 effective property lookups per month!

**Paid Tier (Optional):**
- $99/month for 1,000 requests
- Much cheaper than alternatives

**Without API Key:** The system will still work but won't display detailed property information.

---

### Attom Data API (Optional Fallback)

If you also add an Attom API key, the system will use it as a fallback if RentCast fails.

**Setup:**

1. Go to [Attom Data Solutions](https://api.developer.attomdata.com/)
2. Create account (30-day trial)
3. Add to your `.env.local`:
   ```
   ATTOM_API_KEY=your_api_key_here
   ```

**Note:** Attom's free tier is only a 30-day trial. RentCast is recommended as the primary source.

**Features:**
- Real-time address autocomplete
- Automatic geocoding (latitude/longitude)
- US address validation
- Seamless property creation from search

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory, organized by category:

- **📖 Getting Started**
  - [Documentation Index](docs/README.md) - Complete guide to all documentation
  - [Quick Start Guide](docs/QUICK_START.md)
  - [Environment Variables](docs/ENVIRONMENT_VARIABLES.md) - Configuration guide & best practices
  - [Authentication Setup](docs/AUTHENTICATION_SETUP_GUIDE.md)
  - [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)

- **🔧 Integration Guides**
  - [Stripe Integration](docs/STRIPE_QUICK_START.md)
  - [Telnyx Communications](docs/TELNYX_QUICK_REFERENCE.md)
  - [Settings System](docs/SETTINGS_README.md)

- **📁 Organized Topics**
  - [**Migrations**](docs/migrations/) - Next.js 16 upgrade, PPR conversion, PPR architecture
  - [**Performance**](docs/performance/) - Optimization strategies, dashboards, audits
  - [**Architecture**](docs/architecture/) - Layout system, routing, offline architecture
  - [**Status**](docs/status/) - Implementation status, rollout notes, setup completion
  - [**Troubleshooting**](docs/troubleshooting/) - Runtime errors, webhooks, WebRTC issues

- **💡 Development Notes**
  - [Implementation Notes](notes/) - Working notes and deep dives for specific features

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
