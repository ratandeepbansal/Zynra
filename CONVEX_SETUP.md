# Convex + Clerk Setup Guide

This guide walks you through setting up Convex (database & backend) and Clerk (authentication) for Zynra.

## Why Convex + Clerk?

- **Convex**: TypeScript-native backend with real-time subscriptions, automatic caching, and built-in auth
- **Clerk**: Production-ready authentication with OAuth providers (Google, GitHub, etc.)
- **Perfect Match**: Convex has first-class Clerk integration

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

## Step 1: Create a Convex Account

1. Go to [https://convex.dev](https://convex.dev)
2. Sign up for a free account (no credit card required)
3. Click "Create a project" and name it "Zynra"

## Step 2: Initialize Convex

Run the following command in your project root:

```bash
npx convex dev
```

This will:
- Create a new Convex deployment
- Generate the `convex/_generated` folder
- Add `NEXT_PUBLIC_CONVEX_URL` to your `.env.local`
- Start the Convex development server

**Important**: Keep this terminal running during development. It will:
- Watch for changes in the `convex/` folder
- Push schema and function updates automatically
- Show logs from your backend functions

## Step 3: Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Click "Create application"
4. Name it "Zynra"
5. Enable **Google** as an authentication provider

## Step 4: Configure Clerk for Convex

### In Clerk Dashboard:

1. Go to **JWT Templates** in the sidebar
2. Click "New template" → Select "Convex"
3. The template will be created with the correct claims
4. Copy the **Issuer URL** (looks like `https://your-app.clerk.accounts.dev`)

### In Convex Dashboard:

1. Go to your Convex project dashboard
2. Click **Settings** → **Authentication**
3. Click "Add Auth Provider" → Select "Clerk"
4. Paste the Issuer URL from Clerk
5. Save the configuration

## Step 5: Get API Keys

### Clerk API Keys

In your Clerk dashboard:
1. Go to **API Keys** in the sidebar
2. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

### Convex Deploy Key (for production)

In your Convex dashboard:
1. Go to **Settings** → **Deploy Keys**
2. Create a new deploy key
3. Copy the `CONVEX_DEPLOY_KEY`

## Step 6: Update Environment Variables

Create or update `.env.local` in your project root:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key-here

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenAI (for AI insights)
OPENAI_API_KEY=sk-...
```

**Security Note**: Never commit `.env.local` to git. It's already in `.gitignore`.

## Step 7: Configure Clerk OAuth

### Google OAuth Setup:

1. In Clerk dashboard, go to **User & Authentication** → **Social Connections**
2. Click on **Google**
3. Clerk provides test credentials for development, but for production:
   - Create a Google Cloud project at [console.cloud.google.com](https://console.cloud.google.com)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs from Clerk dashboard
   - Paste Client ID and Secret into Clerk

## Step 8: Test the Setup

1. Make sure `npx convex dev` is still running
2. Start your Next.js dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)
4. Click "Sign in" in the header
5. Sign in with Google
6. You should see your user avatar in the header

## Database Schema

The Convex schema is defined in `convex/schema.ts`:

### Users Table
- Stores user information from OAuth
- Indexed by `tokenIdentifier` for fast lookups

### Charts Table
- Stores birth charts with full astrology and numerology data
- Each chart is linked to a user via `userId`
- Indexed by user for efficient queries

## Available Functions

### Authentication (`convex/auth.ts`)

- `storeUser`: Creates or updates user from OAuth
- `getCurrentUser`: Gets the current authenticated user

### Charts (`convex/charts.ts`)

- `saveChart`: Save a new birth chart
- `getMyCharts`: Get all charts for the current user
- `getChartById`: Get a specific chart by ID
- `deleteChart`: Delete a chart (with ownership verification)

## Usage in Components

### Accessing Auth State

```tsx
import { useUser } from "@clerk/nextjs"

function MyComponent() {
  const { user, isSignedIn, isLoaded } = useUser()

  if (!isLoaded) return <div>Loading...</div>
  if (!isSignedIn) return <div>Please sign in</div>

  return <div>Hello {user.firstName}</div>
}
```

### Saving a Chart

```tsx
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

function SaveChartButton({ chartData }) {
  const saveChart = useMutation(api.charts.saveChart)

  const handleSave = async () => {
    await saveChart({
      fullName: chartData.fullName,
      dateOfBirth: chartData.dateOfBirth,
      birthTime: chartData.birthTime,
      location: chartData.location,
      birthChart: chartData.birthChart,
      numerologyProfile: chartData.numerologyProfile,
    })
  }

  return <button onClick={handleSave}>Save Chart</button>
}
```

### Querying Charts

```tsx
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

function MyChartsList() {
  const charts = useQuery(api.charts.getMyCharts)

  if (!charts) return <div>Loading...</div>

  return (
    <div>
      {charts.map(chart => (
        <div key={chart._id}>
          <h3>{chart.fullName}</h3>
          <p>{chart.dateOfBirth}</p>
        </div>
      ))}
    </div>
  )
}
```

## Production Deployment

### Deploy to Convex

```bash
npx convex deploy
```

This will:
- Deploy your functions to production
- Update your production database schema
- Generate a production URL

### Update Production Environment Variables

In your hosting provider (Vercel, Netlify, etc.):
1. Add all environment variables from `.env.local`
2. Replace `NEXT_PUBLIC_CONVEX_URL` with your production URL
3. Use production Clerk keys (starts with `pk_live_` instead of `pk_test_`)

## Troubleshooting

### "Failed to fetch" errors
- Ensure `npx convex dev` is running
- Check that `NEXT_PUBLIC_CONVEX_URL` is set correctly
- Restart Next.js dev server after adding env vars

### Authentication not working
- Verify Clerk Issuer URL is added in Convex dashboard
- Check that Clerk keys are correct in `.env.local`
- Ensure you're using the correct environment (test vs production)

### Schema changes not reflecting
- Wait a few seconds for `npx convex dev` to push changes
- Check the terminal running `convex dev` for errors
- Try stopping and restarting `npx convex dev`

## Convex vs PocketBase

| Feature | Convex | PocketBase |
|---------|--------|------------|
| Type Safety | ✅ Full TypeScript | ❌ Runtime only |
| Real-time | ✅ Built-in subscriptions | ✅ Subscriptions |
| Hosting | ☁️ Managed (free tier) | 🏠 Self-hosted |
| Auth | 🔐 Clerk/Auth0 integration | 🔐 Built-in OAuth |
| Scalability | ✅ Automatic | ⚠️ Manual |
| Local Development | ✅ `npx convex dev` | ✅ Single binary |

## Next Steps

1. **Create "My Charts" page**: Display all saved charts for the logged-in user
2. **Add "Save Chart" button**: Let users save their birth charts after generation
3. **Add chart history**: Show recent charts on the results page
4. **Export saved charts**: Generate PDFs from saved chart data

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Convex + Clerk Integration Guide](https://docs.convex.dev/auth/clerk)
