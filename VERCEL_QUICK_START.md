# Vercel Monorepo Quick Start

## Quick Configuration Checklist

### Web App (thorbis) - Project ID: `togejqdwggezkxahomeh`

**Vercel Dashboard:** https://vercel.com/wades-web-dev/thorbis/settings

**Settings:**
- **Root Directory:** `apps/web`
- **Build Command:** `cd ../.. && turbo build --filter @stratos/web`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`
- **Framework:** Next.js

### Admin App (thorbis-admin) - Project ID: `iwudmixxoozwskgolqlz`

**Vercel Dashboard:** https://vercel.com/wades-web-dev/thorbis-admin/settings

**Settings:**
- **Root Directory:** `apps/admin`
- **Build Command:** `cd ../.. && turbo build --filter @stratos/admin`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`
- **Framework:** Next.js

## Configuration Files Created

✅ `vercel.json` - Root config with cron jobs for web app
✅ `apps/web/vercel.json` - Web app specific config
✅ `apps/admin/vercel.json` - Admin app specific config

## Git Integration

Both projects should:
- ✅ Be connected to the same Git repository
- ✅ Have **Production Branch** set to `main` or `master`
- ✅ Have **Automatic deployments from Git** enabled
- ✅ Have **Preview deployments** enabled

## Environment Variables

Add all required environment variables in Vercel Dashboard for each project:
- Production environment
- Preview environment
- Development environment (optional)

## Testing the Setup

1. **Run verification script:**
   ```bash
   ./scripts/vercel/verify-setup.sh
   ```

2. **Test deployment:**
   - Push a commit to main branch
   - Check Vercel dashboard for deployment status
   - Verify both apps deploy successfully

3. **Check cron jobs (web app only):**
   - Verify cron jobs are configured in Vercel dashboard
   - Monitor first execution

## Troubleshooting

### Build Fails
- Check Root Directory is set correctly
- Verify build command includes `cd ../..` to reach monorepo root
- Ensure `pnpm install` runs at root level
- Check build logs in Vercel dashboard

### Wrong App Deploying
- Verify Root Directory matches the app directory
- Check that build command filters the correct app

### Missing Dependencies
- Ensure `pnpm install` runs at monorepo root
- Check workspace packages are properly linked
- Verify `pnpm-workspace.yaml` configuration

## Next Steps

1. ✅ Configuration files created
2. ⏳ Update Vercel Dashboard settings (manual step)
3. ⏳ Add environment variables
4. ⏳ Test deployment
5. ⏳ Verify cron jobs

For detailed instructions, see [VERCEL_SETUP.md](./VERCEL_SETUP.md)

