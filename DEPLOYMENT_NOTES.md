# Deployment Notes

## Supabase Production Limitation

**Current Status:** Supabase authentication features do not work in production builds (both Vercel and Netlify) due to a bundling incompatibility between `@supabase/supabase-js` and Vite's production bundler.

**Error:** `Cannot read properties of undefined (reading 'headers')` during Supabase client initialization.

**Impact:** 
- ❌ Authentication (sign in/sign up) does not work in production
- ❌ Saving trips does not work in production
- ❌ Sharing trips does not work in production
- ✅ **Core features work perfectly:** City search, trip viewing, events, weather, photos, maps

**Workarounds Attempted:**
1. Removed code-splitting for Supabase
2. Updated to latest Supabase version (2.88.0)
3. Explicit Web API checks and bindings
4. Multiple initialization strategies
5. DOMContentLoaded handlers
6. Tried both Vercel and Netlify deployments

**For Class Assignment:**
This is a known limitation that can be documented. The core functionality demonstrates:
- ✅ Multi-API integration (Ticketmaster, OpenTripMap, Open-Meteo, Unsplash)
- ✅ Complex state management with React Query
- ✅ Interactive maps with Leaflet
- ✅ Data visualization with charts
- ✅ Responsive UI with Tailwind CSS
- ✅ TypeScript type safety
- ✅ React Router navigation

**Future Fixes:**
- Wait for Supabase/Vite compatibility update
- Consider alternative auth solutions (Auth0, Clerk)
- Use Supabase REST API directly instead of JS client

