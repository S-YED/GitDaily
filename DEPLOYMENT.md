# GitDaily Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+
- Supabase account
- GitHub account (for automation)

### Environment Setup

1. **Copy environment template**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

### Database Setup

1. **Run migrations in Supabase**
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL from `supabase/migrations/20251112195748_91b0e403-8e16-4ca3-a236-226a0a699d92.sql`

2. **Configure GitHub OAuth** (optional)
   - Follow instructions in `GITHUB_AUTH_SETUP.md`

### Build & Deploy

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Deploy to hosting platform**
   - Upload `dist/` folder to your hosting service
   - Configure environment variables on hosting platform

### GitHub Actions Setup

1. **Add repository secrets**
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

2. **Enable daily automation**
   - The workflow in `.github/workflows/daily-fetch.yml` will run automatically

### Security Checklist

- ✅ `.env` files are in `.gitignore`
- ✅ No hardcoded secrets in code
- ✅ Service role key only in GitHub Secrets
- ✅ RLS policies enabled on all tables
- ✅ HTTPS enabled on production domain

### Performance Optimization

- Bundle size: ~624KB (consider code splitting for larger apps)
- Images optimized and compressed
- CSS minified and gzipped
- Static assets cached

### Monitoring

- Check GitHub Actions for daily automation
- Monitor Supabase usage and quotas
- Set up error tracking (optional)

---

**Built by [Syed Khaja Moinuddin](https://github.com/S-YED)**