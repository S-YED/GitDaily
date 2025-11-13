# GitHub OAuth Setup Instructions

To enable GitHub authentication, follow these steps:

## 1. Configure GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: GitDaily
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Authorization callback URL**: `https://zptpzlzcutvkqjjqsgjm.supabase.co/auth/v1/callback`

4. Copy the **Client ID** and **Client Secret**

## 2. Configure Supabase

1. Go to your Supabase dashboard → Authentication → Providers
2. Enable **GitHub** provider
3. Enter your GitHub **Client ID** and **Client Secret**
4. Save the configuration

## 3. Update Site URL

In Supabase → Authentication → URL Configuration:

**For Local Development:**
- **Site URL**: `http://localhost:5173`
- **Redirect URLs**: `http://localhost:5173`, `http://localhost:5173/**`

**For Production:**
- **Site URL**: `https://yourdomain.com`
- **Redirect URLs**: `https://yourdomain.com`, `https://yourdomain.com/**`

That's it! GitHub authentication will now work in your app.