# Debugging Blank Page on Vercel

## Step 1: Check Browser Console

1. Open your deployed site: https://travel-genie-chi.vercel.app
2. Press `F12` or right-click → Inspect → Console tab
3. Look for any red error messages
4. Take a screenshot or copy the errors

Common errors:
- "Failed to fetch" → Missing API keys
- "Supabase not configured" → Missing Supabase environment variables
- CORS errors → Supabase CORS not configured
- Module not found → Build issue

## Step 2: Check Environment Variables in Vercel

1. Go to: https://vercel.com/dhruvi-kadhiwalas-projects/travel-genie/settings/environment-variables
2. Verify these are set:
   - ✅ VITE_TICKETMASTER_API_KEY
   - ✅ VITE_OPENTRIPMAP_API_KEY
   - ✅ VITE_UNSPLASH_API_KEY
   - ✅ VITE_SUPABASE_URL
   - ✅ VITE_SUPABASE_ANON_KEY
3. Make sure they're enabled for **Production**
4. If you just added them, **redeploy** the site

## Step 3: Check Vercel Deployment Logs

1. Go to: https://vercel.com/dhruvi-kadhiwalas-projects/travel-genie
2. Click on the latest deployment
3. Check "Build Logs" for any errors
4. Check "Runtime Logs" for runtime errors

## Step 4: Network Tab Check

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for failed requests (red entries)
5. Check if `index.html` loads (should be 200)
6. Check if JavaScript files load (should be 200)

## Step 5: Quick Fix - Redeploy

If you just added environment variables:
1. Go to Vercel dashboard
2. Click on your project
3. Go to "Deployments"
4. Click "..." on latest deployment
5. Click "Redeploy"
6. Wait for it to finish

