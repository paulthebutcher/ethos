# The AI Ethos

Solo AI product incubator. One developer, many experiments, shipping fast.

## 🚀 Quick Start: Create a New App

```bash
# Create a new app in seconds
npm run new-app invoice-ai "Invoice AI" "Smart invoice processing" 3005

# Then:
cd apps/invoice-ai
cp .env.local.example .env.local  # Add your keys
npm install
npm run dev --workspace=@guildry/invoice-ai
```

## 📦 Monorepo Structure

```
├── apps/
│   ├── ethos/              # theaiethos.com - Hub site
│   ├── guildry/            # guildry.theaiethos.com - Project intelligence
│   └── [your-app]/         # your-app.theaiethos.com
├── packages/
│   ├── auth/               # Clerk integration, middleware, hooks
│   ├── database/           # Supabase client & types
│   ├── ai/                 # Claude client, prompts, tools
│   ├── ui/                 # Shared React components
│   └── config/             # Shared Tailwind, ESLint, TypeScript
├── templates/
│   └── nextjs-app/         # App template for scaffolding
├── scripts/
│   └── new-app.sh          # App scaffolding script
└── docs/
```

## 🧱 Shared Packages

### @guildry/auth
```typescript
// Server-side
import { requireAuth, getAuthContext } from "@guildry/auth";

// Client-side
import { SignIn, UserButton, useAuth } from "@guildry/auth";

// Middleware
import { createAuthMiddleware } from "@guildry/auth/middleware";
```

### @guildry/ui
```typescript
import {
  Button,
  Card, CardHeader, CardTitle,
  Input, Textarea,
  Spinner, PageLoader,
  PageContainer, PageHeader, Section
} from "@guildry/ui";
```

### @guildry/database
```typescript
import { createServiceClient } from "@guildry/database";
```

### @guildry/ai
```typescript
import { createAIClient } from "@guildry/ai";
```

### @guildry/config
```javascript
// tailwind.config.js
const sharedConfig = require("@guildry/config/tailwind");
module.exports = { ...sharedConfig };

// tsconfig.json
{ "extends": "@guildry/config/typescript/nextjs" }
```

## 🛠️ Development

```bash
# Install all dependencies
npm install

# Run all apps
npm run dev

# Run specific app
npm run dev --workspace=@guildry/ethos

# Build all
npm run build

# Create new app
npm run new-app <name> [title] [description] [port]
```

## 🌐 Deployments

| App | Domain | Vercel Root |
|-----|--------|-------------|
| Hub | theaiethos.com | `apps/ethos` |
| Guildry | guildry.theaiethos.com | `apps/guildry` |
| New App | newapp.theaiethos.com | `apps/newapp` |

### Deploy a New App to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `paulthebutcher/ethos`
3. Root Directory: `apps/your-app`
4. Add environment variables
5. Settings → Domains → `your-app.theaiethos.com`

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Monorepo**: npm workspaces
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Clerk
- **AI**: Anthropic Claude API
- **Deployment**: Vercel

## 🔑 Environment Variables

Each app needs:
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Optional: Anthropic (for AI features)
ANTHROPIC_API_KEY=
```

## 📝 License

Private - All rights reserved.

---

Built in public by [@paulbutcher](https://github.com/paulthebutcher)
