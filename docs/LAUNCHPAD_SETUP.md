# Launchpad Infrastructure Setup

This document covers the one-time setup required for Launchpad's dynamic subdomain routing and shared infrastructure.

## Overview

Launchpad uses a single Vercel project with dynamic subdomain routing:
- `guildry.theaiethos.com` → Guildry app (existing product)
- `invoice-nudge.theaiethos.com` → Landing page for Launchpad apps
- `invoice-nudge.theaiethos.com/app` → Auth-gated app shell
- `invoice-nudge.theaiethos.com/docs` → Auto-generated docs

## One-Time Setup Steps

### 1. DNS Configuration (GoDaddy)

Add a wildcard CNAME record to route all subdomains to Vercel:

1. Go to GoDaddy → DNS Management for `theaiethos.com`
2. Add a new CNAME record:
   - **Type:** CNAME
   - **Name:** `*` (asterisk for wildcard)
   - **Value:** `cname.vercel-dns.com`
   - **TTL:** 1 Hour (or default)
3. Save and wait for propagation (up to 48 hours, usually faster)

To verify:
```bash
dig invoice-nudge.theaiethos.com
# Should show CNAME pointing to cname.vercel-dns.com
```

### 2. Vercel Project Configuration

#### Add Wildcard Domain

1. Go to Vercel Dashboard → ethos project → Settings → Domains
2. Add domain: `*.theaiethos.com`
3. Vercel will automatically handle SSL for all subdomains

#### Environment Variables

Ensure these are set in Vercel project settings:

```
# Existing
ANTHROPIC_API_KEY=sk-...
GITHUB_TOKEN=ghp_...
DEV_AUTH_TOKEN=your-secret-token

# New for Launchpad
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # For server-side operations

# Optional: Vercel API for programmatic subdomain management
VERCEL_TOKEN=xxx
VERCEL_PROJECT_ID=prj_xxx
```

### 3. Database Setup (Supabase)

Run the schema in Supabase SQL Editor:

```bash
# Location: packages/database/schema/launchpad.sql
```

This creates:
- `launchpad_apps` - App configurations
- `feedback` - User feedback across all apps
- `waitlist` - Waitlist signups per app
- `onboarding_progress` - User onboarding tracking

### 4. Local Development

For local testing of subdomains, use query parameters:

```
http://localhost:3000?subdomain=invoice-nudge
```

The middleware detects this and rewrites to the correct app route.

## Architecture

### File Structure

```
apps/ethos/
├── middleware.js          # Subdomain routing
├── lib/
│   └── launchpad-apps.js  # App registry (will be Supabase-backed)
├── app/
│   ├── a/[slug]/          # Dynamic app routes
│   │   ├── page.jsx       # Landing page
│   │   ├── app/page.jsx   # Auth-gated app shell
│   │   └── docs/page.jsx  # Auto-generated docs
│   └── api/
│       ├── feedback/      # Feedback collection
│       ├── onboarding/    # Onboarding progress
│       └── og/            # Dynamic OG image generation
```

### Shared Packages

```
packages/
├── feedback/    # FeedbackWidget component + API utilities
├── meta/        # OG metadata + image generation
├── onboarding/  # OnboardingWizard component + progress tracking
└── database/
    └── schema/
        └── launchpad.sql  # Database schema
```

## URL Routing

| URL | Routes To |
|-----|-----------|
| `theaiethos.com` | Main AI Ethos site |
| `{slug}.theaiethos.com` | `/a/{slug}` (landing page) |
| `{slug}.theaiethos.com/app` | `/a/{slug}/app` (app shell) |
| `{slug}.theaiethos.com/docs` | `/a/{slug}/docs` (docs page) |

## Adding a New App

Currently apps are registered in `lib/launchpad-apps.js`. In the future, Launchpad will:

1. Take an app idea as input
2. Generate app config with AI
3. Save to Supabase `launchpad_apps` table
4. Create necessary files/routes
5. Add subdomain to Vercel via API
6. Commit to GitHub

## API Endpoints

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback?app={slug}` - Get feedback for an app

### Onboarding
- `GET /api/onboarding?app={slug}&user={userId}` - Get progress
- `POST /api/onboarding` - Save progress

### OG Images
- `GET /api/og?title=...&desc=...&icon=...&color=...` - Generate OG image

## Testing

1. Add a test app to `lib/launchpad-apps.js`:

```javascript
"test-app": {
  slug: "test-app",
  name: "Test App",
  tagline: "Testing Launchpad infrastructure",
  color: "#0ea5e9",
  icon: "🧪",
  landing: {
    headline: "Test headline",
    problem: "Test problem",
    solution: "Test solution",
    features: [
      { icon: "✨", title: "Feature 1", description: "Description" }
    ],
    cta: "Join Waitlist"
  },
  infrastructure: {
    auth: true,
    feedback: true,
    onboarding: true,
    payments: false
  },
  meta: {
    title: "Test App - Testing Launchpad",
    description: "A test app for Launchpad infrastructure"
  }
}
```

2. Visit:
   - Local: `http://localhost:3000?subdomain=test-app`
   - Production: `https://test-app.theaiethos.com`

## Troubleshooting

### Subdomain not resolving
- Check DNS propagation: `dig {slug}.theaiethos.com`
- Verify wildcard CNAME is set correctly
- Wait up to 48 hours for propagation

### App not found (404)
- Ensure app is registered in `launchpad-apps.js` or Supabase
- Check slug matches exactly (case-sensitive)

### Feedback/Onboarding not saving
- Verify Supabase credentials in Vercel
- Check tables exist (run schema SQL)
- Look for errors in Vercel function logs
