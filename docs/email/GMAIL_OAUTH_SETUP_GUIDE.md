# Gmail OAuth Setup Guide

**Complete step-by-step guide to enable Gmail integration in Stratos**

---

## 📋 Prerequisites

- Google Account (Gmail)
- Access to Google Cloud Console
- Admin access to Stratos codebase
- `.env.local` file ready for editing

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console:**
   - Navigate to: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project:**
   - Click the project dropdown at the top
   - Click "New Project"
   - **Project Name:** `Stratos Email` (or your app name)
   - **Organization:** Leave as "No organization" (unless you have one)
   - Click "Create"
   - Wait 10-30 seconds for project creation

3. **Select Your Project:**
   - Click the project dropdown again
   - Select "Stratos Email" from the list

---

### Step 2: Enable Gmail API

1. **Navigate to API Library:**
   - Direct link: https://console.cloud.google.com/apis/library/gmail.googleapis.com
   - OR: Click "☰ Menu" → "APIs & Services" → "Library"

2. **Find Gmail API:**
   - Search for "Gmail API"
   - Click on "Gmail API" card

3. **Enable the API:**
   - Click blue "Enable" button
   - Wait 5-10 seconds for activation
   - You'll see "API enabled" message

---

### Step 3: Configure OAuth Consent Screen

1. **Navigate to Consent Screen:**
   - Click "☰ Menu" → "APIs & Services" → "OAuth consent screen"
   - Direct link: https://console.cloud.google.com/apis/credentials/consent

2. **Select User Type:**
   - Choose "**External**" (for public app)
   - Click "Create"

3. **Fill Out App Information:**

   **Page 1: OAuth consent screen**
   - **App name:** `Stratos` (or your app name)
   - **User support email:** Your email address
   - **App logo:** (Optional - upload your logo)
   - **Application home page:** `https://your-domain.com`
   - **Application privacy policy link:** `https://your-domain.com/privacy`
   - **Application terms of service link:** `https://your-domain.com/terms`
   - **Authorized domains:**
     - Add `your-domain.com` (without https://)
     - For development, you can skip this
   - **Developer contact email:** Your email address
   - Click "Save and Continue"

4. **Add OAuth Scopes:**

   **Page 2: Scopes**
   - Click "Add or Remove Scopes"
   - **Search and add these scopes:**
     - `https://www.googleapis.com/auth/gmail.send` ✅
     - `https://www.googleapis.com/auth/gmail.readonly` ✅
     - `https://www.googleapis.com/auth/userinfo.email` ✅
     - `https://www.googleapis.com/auth/userinfo.profile` ✅
   - Click "Update"
   - Click "Save and Continue"

5. **Add Test Users (Development Only):**

   **Page 3: Test users**
   - Click "Add Users"
   - Add your email addresses (comma-separated):
     - `your-email@gmail.com`
     - `teammate@gmail.com`
   - Click "Add"
   - Click "Save and Continue"

6. **Review Summary:**
   - Review all information
   - Click "Back to Dashboard"

---

### Step 4: Create OAuth 2.0 Credentials

1. **Navigate to Credentials:**
   - Click "☰ Menu" → "APIs & Services" → "Credentials"
   - Direct link: https://console.cloud.google.com/apis/credentials

2. **Create Credentials:**
   - Click "**+ Create Credentials**" at top
   - Select "**OAuth client ID**"

3. **Configure OAuth Client:**

   **Application type:** `Web application`

   **Name:** `Stratos Web Client`

   **Authorized JavaScript origins:** (Optional)
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)

   **Authorized redirect URIs:** (CRITICAL!)
   ```
   http://localhost:3000/api/gmail/callback
   http://localhost:3000/api/gmail/oauth/user/callback
   https://your-domain.com/api/gmail/callback
   https://your-domain.com/api/gmail/oauth/user/callback
   ```

   **Notes:**
   - `/api/gmail/callback` is for company-level Gmail
   - `/api/gmail/oauth/user/callback` is for per-user Gmail
   - Add both localhost (dev) and production URLs

4. **Create and Save Credentials:**
   - Click "Create"
   - **IMPORTANT:** Copy the credentials shown:
     - **Client ID:** `1234567890-abcdefg.apps.googleusercontent.com`
     - **Client Secret:** `GOCSPX-abcdefghijklmnopqrstuvwxyz`
   - Click "Download JSON" (optional backup)
   - Click "OK"

---

### Step 5: Add Credentials to .env.local

1. **Open `.env.local` file:**
   ```bash
   # In your Stratos project
   nano .env.local
   # or
   code .env.local
   ```

2. **Find the Gmail OAuth section:**
   - Look for `# GMAIL OAUTH (PER-USER EMAIL INTEGRATION)`

3. **Add your credentials:**
   ```bash
   # OAuth Client Credentials (from Google Cloud Console)
   GOOGLE_CLIENT_ID="1234567890-abcdefg.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz"

   # App URL for OAuth redirects
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Verify Token Encryption Key:**
   - Should already be set (auto-generated):
   ```bash
   TOKEN_ENCRYPTION_KEY="8681f1aaf474196f03a879a1aff5d40ed5ff25e402d42979d46e79177fd4414e"
   ```

5. **Save the file:**
   - Press `Ctrl+X`, then `Y`, then `Enter` (nano)
   - Or `Cmd+S` (VS Code)

---

### Step 6: Restart Development Server

```bash
# Stop the current server (Ctrl+C)

# Restart with new environment variables
npm run dev
# or
pnpm dev
```

---

## ✅ Verify Setup

### Test Token Encryption

```bash
# In your project root
node -e "
const { testEncryption, isEncryptionConfigured } = require('./src/lib/email/token-encryption');

console.log('Encryption configured:', isEncryptionConfigured());
console.log('Encryption test:', testEncryption() ? '✅ PASS' : '❌ FAIL');
"
```

**Expected output:**
```
Encryption configured: true
Encryption test: ✅ PASS
```

### Test OAuth Flow (Manual)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:**
   ```
   http://localhost:3000/api/gmail/oauth/user/authorize
   ```

3. **You should see:**
   - Redirect to Google OAuth consent screen
   - "Stratos wants to access your Google Account"
   - List of requested permissions

4. **Test scenarios:**
   - ✅ If you're a test user: Should show consent screen
   - ❌ If not a test user: Will show "Access blocked" (expected)

---

## 🔐 Security Checklist

- [x] `TOKEN_ENCRYPTION_KEY` is set (32-byte hex string)
- [x] `GOOGLE_CLIENT_ID` is set
- [x] `GOOGLE_CLIENT_SECRET` is set
- [x] `.env.local` is in `.gitignore` (should already be)
- [x] OAuth redirect URIs match exactly
- [x] Both `/api/gmail/callback` and `/api/gmail/oauth/user/callback` added

**NEVER commit these to git:**
- ❌ `GOOGLE_CLIENT_SECRET`
- ❌ `TOKEN_ENCRYPTION_KEY`

---

## 🚀 Production Deployment

### Before Going Live:

1. **Update OAuth Consent Screen:**
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Add production URLs to "Authorized domains"
   - Update app home page, privacy policy, terms URLs

2. **Update OAuth Client:**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Edit your OAuth client
   - Add production redirect URIs:
     ```
     https://your-domain.com/api/gmail/callback
     https://your-domain.com/api/gmail/oauth/user/callback
     ```

3. **Set Production Environment Variables:**
   - In Vercel/Production:
     ```bash
     GOOGLE_CLIENT_ID="your-client-id"
     GOOGLE_CLIENT_SECRET="your-client-secret"
     TOKEN_ENCRYPTION_KEY="different-key-than-dev"
     NEXT_PUBLIC_APP_URL="https://your-domain.com"
     ```

4. **Generate New Production Encryption Key:**
   ```bash
   # On production server or locally
   openssl rand -hex 32

   # Add to production environment (NOT dev!)
   TOKEN_ENCRYPTION_KEY="new-production-key-here"
   ```

5. **Publish OAuth App (Optional):**
   - Go to OAuth consent screen
   - Click "Publish App"
   - **Note:** Requires Google verification if >100 users
   - Verification can take 1-2 weeks

---

## 🐛 Troubleshooting

### Issue: "Access blocked: This app's request is invalid"

**Cause:** Redirect URI mismatch

**Solution:**
1. Check OAuth client redirect URIs exactly match:
   ```
   http://localhost:3000/api/gmail/oauth/user/callback
   ```
2. No trailing slashes
3. Exact port number (3000)
4. Check for typos in URL

---

### Issue: "Error 400: redirect_uri_mismatch"

**Cause:** Redirect URI not in authorized list

**Solution:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth client
3. Add missing redirect URI
4. Save and try again

---

### Issue: "Access blocked: Stratos has not completed the Google verification process"

**Cause:** App not published or you're not a test user

**Solution (Development):**
1. Go to OAuth consent screen
2. Add yourself as test user
3. Try again

**Solution (Production):**
1. Click "Publish App" on consent screen
2. Submit for verification (if >100 users)

---

### Issue: "TOKEN_ENCRYPTION_KEY not set"

**Cause:** Environment variable missing

**Solution:**
```bash
# Generate new key
openssl rand -hex 32

# Add to .env.local
TOKEN_ENCRYPTION_KEY="generated-key-here"

# Restart server
npm run dev
```

---

### Issue: "Failed to decrypt token"

**Cause:** Token encrypted with different key

**Solution:**
- If key was rotated, all users must reconnect Gmail
- Check `TOKEN_ENCRYPTION_KEY` matches what was used to encrypt
- For migration, use `decryptTokenSafe()` for backward compatibility

---

### Issue: OAuth works locally but not in production

**Checklist:**
1. Production redirect URIs added to OAuth client
2. Production domain added to authorized domains
3. `NEXT_PUBLIC_APP_URL` set correctly in production
4. `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` set in production env
5. `TOKEN_ENCRYPTION_KEY` set in production env (different from dev!)

---

## 📊 Monitoring

### Check OAuth Status

```bash
# Check if credentials are configured
curl http://localhost:3000/api/gmail/oauth/user/authorize

# Should redirect to Google (not error page)
```

### Check Rate Limiter

```typescript
import { getRateLimiterStats } from '@/lib/email/gmail-rate-limiter';

const stats = getRateLimiterStats();
console.log('Active syncs:', stats.activeSyncs);
console.log('Rate limits:', stats.apiRateLimits);
```

---

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- [Gmail API Quotas](https://developers.google.com/gmail/api/reference/quota)
- [OAuth Verification Process](https://support.google.com/cloud/answer/9110914)

---

## 📞 Support

If you encounter issues:

1. **Check logs:**
   ```bash
   # Search for OAuth errors
   grep -r "Gmail OAuth" logs/
   ```

2. **Verify environment:**
   ```bash
   node -e "console.log('CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing')"
   node -e "console.log('CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Missing')"
   node -e "console.log('ENCRYPTION_KEY:', process.env.TOKEN_ENCRYPTION_KEY ? '✅ Set' : '❌ Missing')"
   ```

3. **Test encryption:**
   ```bash
   npm run test:encryption
   ```

---

## ✅ Setup Complete!

You're now ready to test Gmail OAuth integration:

1. Navigate to: `/dashboard/settings/personal/email`
2. Click "Connect Gmail"
3. Authorize with Google
4. Should redirect back with "Gmail connected successfully"

**Next Steps:**
- Test inbox sync
- Review audit logs
- Monitor rate limiting
- Deploy to production

🎉 **Gmail Integration is Live!**
