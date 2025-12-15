# Deployment Steps - Travel Genie

## ✅ Step 1: Preview Deployment Complete
Your app is deployed to a preview URL:
**Preview**: https://travel-genie-mk69pu8ad-dhruvi-kadhiwalas-projects.vercel.app

## 🔧 Step 2: Set Environment Variables in Vercel

You need to add your environment variables in the Vercel dashboard:

1. Go to: https://vercel.com/dhruvi-kadhiwalas-projects/travel-genie/settings/environment-variables
2. Add these variables (get values from your `.env` file):

```
VITE_TICKETMASTER_API_KEY=your_key_here
VITE_OPENTRIPMAP_API_KEY=your_key_here
VITE_UNSPLASH_API_KEY=your_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

3. Make sure to select:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
   - Click "Save"

## 🔐 Step 3: Update Supabase CORS Settings

1. Go to your Supabase Dashboard
2. Settings → API → CORS Configuration
3. Add your production domain:
   - `https://travel-genie-chi.vercel.app` (your production domain)
   - `https://travel-genie-*.vercel.app` (for preview deployments)
4. Save

## 🚀 Step 4: Deploy to Production

Run this command to deploy to production:
```bash
vercel --prod
```

Or deploy from the dashboard:
- Go to: https://vercel.com/dhruvi-kadhiwalas-projects/travel-genie/deployments
- Click on the latest deployment
- Click "Promote to Production"

## ✅ Step 5: Test Your Production Site

Once deployed, visit your production URL and test:
- Search for cities
- Sign up/Login
- Save trips
- Share trips
- Add notes

---

## Quick Commands Reference

```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel inspect [deployment-url] --logs

# List all deployments
vercel ls
```

