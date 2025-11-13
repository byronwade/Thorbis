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
│   └── archive/root-updates/  # Historical reports previously stored in the repo root
├── scripts/              # Build and utility scripts
│   ├── database/manual/       # One-off migration helpers (apply-owner-fix, test-migration, etc.)
│   └── maintenance/           # Local environment tooling (PowerShell/Bash fix scripts)
└── public/               # Static assets
```

## 🧹 Root Housekeeping

- All legacy Markdown/TXT status reports now live under `docs/archive/root-updates` to keep `/` focused on source.
- Manual Supabase helpers (`apply-migrations.js`, `apply-owner-fix.js`, `test-migration.js`) moved to `scripts/database/manual`.
- The Windows installation helpers (`fix-install*.ps1/.bat`) are consolidated under `scripts/maintenance/`.

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
