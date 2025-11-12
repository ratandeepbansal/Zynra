# PocketBase Setup Guide for Zynra

This guide will help you set up PocketBase for Zynra's authentication and data storage.

## 1. Download and Install PocketBase

### Download PocketBase
1. Visit https://pocketbase.io/docs/
2. Download the PocketBase executable for your operating system
3. Extract the executable to a folder (e.g., `pocketbase`)

### Start PocketBase
```bash
# Navigate to the pocketbase folder
cd pocketbase

# Run PocketBase (this will start the server on port 8090)
./pocketbase serve
```

The admin UI will be available at: http://127.0.0.1:8090/_/

## 2. Initial Setup

1. Open http://127.0.0.1:8090/_/ in your browser
2. Create your admin account (email + password)
3. You'll see the PocketBase dashboard

## 3. Configure OAuth (Google Login)

### Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if prompted
6. Application type: Web application
7. Add authorized redirect URIs:
   - `http://127.0.0.1:8090/api/oauth2-redirect`
   - `http://localhost:8090/api/oauth2-redirect`
8. Copy your Client ID and Client Secret

### Configure in PocketBase
1. In PocketBase admin UI, go to **Settings** → **Auth providers**
2. Find **Google** and click to configure
3. Enable Google OAuth
4. Paste your Client ID and Client Secret
5. Save

## 4. Create Collections

### Users Collection
The `users` collection is created automatically. No additional setup needed.

### Charts Collection
Create a new collection for storing user charts:

1. Go to **Collections** → **New collection**
2. Collection name: `charts`
3. Collection type: **Base**
4. Add the following fields:

| Field Name | Type | Required | Options |
|------------|------|----------|---------|
| user | Relation | Yes | Single, users collection |
| fullName | Text | Yes | - |
| dateOfBirth | Text | Yes | - |
| birthTime | JSON | Yes | - |
| location | JSON | Yes | - |
| birthChart | JSON | Yes | - |
| numerologyProfile | JSON | Yes | - |

5. **API Rules** (important for security):
   - List rule: `@request.auth.id != "" && user = @request.auth.id`
   - View rule: `@request.auth.id != "" && user = @request.auth.id`
   - Create rule: `@request.auth.id != ""`
   - Update rule: `@request.auth.id != "" && user = @request.auth.id`
   - Delete rule: `@request.auth.id != "" && user = @request.auth.id`

These rules ensure users can only access their own charts.

## 5. Environment Variables

Create a `.env.local` file in your Zynra project root:

```env
# PocketBase
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090

# OpenAI (if not already configured)
OPENAI_API_KEY=your_openai_api_key_here
```

## 6. Test the Setup

1. Make sure PocketBase is running: `./pocketbase serve`
2. Start your Next.js app: `npm run dev`
3. Navigate to your app at http://localhost:3000
4. Click "Sign in with Google" in the header
5. Complete the Google OAuth flow
6. You should be logged in!

## 7. Verify Data Storage

After creating a birth chart while logged in:
1. Go to PocketBase admin UI
2. Navigate to **Collections** → **charts**
3. You should see your saved chart data

## Production Deployment

For production, you'll need to:

1. Deploy PocketBase to a server (VPS, cloud platform, etc.)
2. Update `NEXT_PUBLIC_POCKETBASE_URL` to your production URL
3. Add production URLs to Google OAuth redirect URIs
4. Set up proper HTTPS/SSL certificates
5. Configure backups for your PocketBase data

## Troubleshooting

### Can't login with Google
- Check that OAuth credentials are correct
- Verify redirect URIs match exactly
- Ensure PocketBase is running on the correct port

### Charts not saving
- Check browser console for errors
- Verify you're logged in
- Check PocketBase collection rules
- Ensure all required fields are present

### Connection errors
- Verify PocketBase is running
- Check `NEXT_PUBLIC_POCKETBASE_URL` is correct
- Look for CORS issues (PocketBase allows all origins by default in dev)

## Additional Resources

- [PocketBase Documentation](https://pocketbase.io/docs/)
- [PocketBase SDKs](https://pocketbase.io/docs/client-side-sdks/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
