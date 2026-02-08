#!/bin/bash

# AI Ethos - New App Scaffolding Script
# Usage: ./scripts/new-app.sh my-app-name "My App Title" "Description of my app" 3005

set -e

APP_NAME=$1
APP_TITLE=${2:-$APP_NAME}
APP_DESCRIPTION=${3:-"An AI Ethos application"}
PORT=${4:-3000}

if [ -z "$APP_NAME" ]; then
  echo "Usage: ./scripts/new-app.sh <app-name> [title] [description] [port]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/new-app.sh invoice-ai \"Invoice AI\" \"Smart invoice processing\" 3005"
  echo "  ./scripts/new-app.sh quick-crm"
  exit 1
fi

# Check if app already exists
if [ -d "apps/$APP_NAME" ]; then
  echo "Error: apps/$APP_NAME already exists"
  exit 1
fi

echo "🚀 Creating new app: $APP_NAME"
echo "   Title: $APP_TITLE"
echo "   Description: $APP_DESCRIPTION"
echo "   Dev port: $PORT"
echo ""

# Create app directory
mkdir -p "apps/$APP_NAME/app"
mkdir -p "apps/$APP_NAME/lib"
mkdir -p "apps/$APP_NAME/components"
mkdir -p "apps/$APP_NAME/public"

# Copy and process templates
for template in templates/nextjs-app/*.template; do
  filename=$(basename "$template" .template)
  dest="apps/$APP_NAME/$filename"

  sed -e "s/{{APP_NAME}}/$APP_NAME/g" \
      -e "s/{{APP_TITLE}}/$APP_TITLE/g" \
      -e "s/{{APP_DESCRIPTION}}/$APP_DESCRIPTION/g" \
      -e "s/{{PORT}}/$PORT/g" \
      "$template" > "$dest"

  echo "   Created $dest"
done

# Copy app directory templates
for template in templates/nextjs-app/app/*.template; do
  filename=$(basename "$template" .template)
  dest="apps/$APP_NAME/app/$filename"

  sed -e "s/{{APP_NAME}}/$APP_NAME/g" \
      -e "s/{{APP_TITLE}}/$APP_TITLE/g" \
      -e "s/{{APP_DESCRIPTION}}/$APP_DESCRIPTION/g" \
      -e "s/{{PORT}}/$PORT/g" \
      "$template" > "$dest"

  echo "   Created $dest"
done

# Create postcss.config.js (no templating needed)
cat > "apps/$APP_NAME/postcss.config.js" << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF
echo "   Created apps/$APP_NAME/postcss.config.js"

# Create next.config.js
cat > "apps/$APP_NAME/next.config.js" << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@guildry/ui", "@guildry/auth", "@guildry/database"],
};

module.exports = nextConfig;
EOF
echo "   Created apps/$APP_NAME/next.config.js"

# Create .env.local template
cat > "apps/$APP_NAME/.env.local.example" << EOF
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
EOF
echo "   Created apps/$APP_NAME/.env.local.example"

echo ""
echo "✅ App created at apps/$APP_NAME"
echo ""
echo "Next steps:"
echo "  1. Copy .env.local.example to .env.local and fill in values"
echo "  2. Run: npm install"
echo "  3. Run: npm run dev --workspace=@guildry/$APP_NAME"
echo ""
echo "To add to Vercel:"
echo "  - Import repo, set root directory to: apps/$APP_NAME"
echo "  - Add domain: $APP_NAME.theaiethos.com"
