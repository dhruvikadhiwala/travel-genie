# Travel Genie 🧞‍♂️

**🌐 Live Demo:** [https://travel-genie-chi.vercel.app/](https://travel-genie-chi.vercel.app/)

## Project Description

Travel Genie is a personalized trip explorer web application that unifies event discovery, points of interest, weather forecasts, and destination photography into a single, interactive trip planning interface. Instead of juggling multiple tabs and apps, users can explore everything they need for their trip in one place.

### Problem Statement

Planning a trip typically requires bouncing between multiple tabs: one for events, another for attractions, a separate one for weather forecasts, and scrolling through photos on various platforms. This fragmented approach is time-consuming and overwhelming, often causing users to miss out on great experiences or give up on planning altogether.

### Solution

Travel Genie solves this by aggregating data from multiple APIs (Ticketmaster, OpenTripMap, Open-Meteo, Unsplash) into a unified, shareable trip board. Users can search for any city worldwide, view upcoming events, discover attractions, check weather forecasts, browse destination photos, and explore everything on an interactive map—all in one application.

### Target Browsers

Travel Genie is designed to work on all contemporary desktop and mobile browsers:

- **Desktop Browsers:**
  - Chrome 90+ (recommended)
  - Firefox 88+
  - Safari 14+
  - Edge 90+

- **Mobile Browsers:**
  - iOS Safari 14+
  - Chrome Mobile (Android)
  - Samsung Internet

The application uses modern web standards and responsive design principles, ensuring a consistent experience across all supported platforms. Mobile-first CSS ensures optimal performance on smaller screens.

### Developer Manual

**Link to Developer Manual:** See [Developer Manual section below](#developer-manual)

---

# Developer Manual

## Overview

This manual is designed for developers who will take over or contribute to the Travel Genie project. It assumes familiarity with web development, React, TypeScript, and modern JavaScript, but provides specific details about this application's architecture and setup.

## Installation

### Prerequisites

Before setting up Travel Genie, ensure you have the following installed:

- **Node.js** version 16.0 or higher
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control
- A code editor (VS Code recommended)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd travel-genie
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies, including:
- React and React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- TanStack Query (React Query)
- Leaflet and React-Leaflet
- Recharts
- Supabase client library
- Other development dependencies

### Step 3: Environment Variables Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your API keys:

```env
# External API Keys
VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key_here
VITE_OPENTRIPMAP_API_KEY=your_opentripmap_api_key_here
VITE_UNSPLASH_API_KEY=your_unsplash_api_key_here

# Supabase Configuration (for database and authentication)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to obtain API keys:**

1. **Ticketmaster API**: Sign up at [developer.ticketmaster.com](https://developer.ticketmaster.com/)
2. **OpenTripMap API**: Register at [opentripmap.io](https://opentripmap.io/product)
3. **Unsplash API**: Create an application at [unsplash.com/developers](https://unsplash.com/developers)
4. **Supabase**: Create a project at [supabase.com](https://supabase.com) and copy your project URL and anon key

### Step 4: Set Up Supabase Database

1. Log into your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the SQL schema provided in `supabase-schema.sql` (if available) or create the following tables:
   - `trips` (id, user_id, city, country, lat, lon, notes, is_public, share_token, created_at, updated_at)
   - `favorites` (id, user_id, trip_id, type, item_id, item_data, created_at)
   - `search_history` (id, user_id, query, city, country, lat, lon, created_at)

**Note:** Authentication features require Supabase to be properly configured. See known issues section for production limitations.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will start at `http://localhost:3000`. The dev server includes:
- Hot module replacement (HMR) for instant updates
- Source maps for debugging
- Fast refresh for React components

### Production Build

To create a production build:

```bash
npm run build
```

This creates an optimized bundle in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Linting

Check code quality:

```bash
npm run lint
```

## Testing

### Current Testing Status

At the time of submission, automated tests have not been implemented. Manual testing procedures include:

1. **Functional Testing:**
   - City search functionality
   - Event loading and display
   - Points of interest retrieval
   - Weather data visualization
   - Photo gallery rendering
   - Map interaction

2. **Integration Testing:**
   - API endpoint connectivity
   - Supabase database operations (in development)
   - Authentication flows (in development)

3. **Browser Compatibility Testing:**
   - Test across target browsers listed above
   - Verify responsive design on mobile devices
   - Check for console errors

### Future Testing Recommendations

Developers should implement:

```bash
# Install testing dependencies (future)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests (future)
npm test
```

Recommended test coverage:
- Unit tests for utility functions (`lib/fetcher.ts`)
- Component tests for UI components
- Integration tests for API calls
- E2E tests for critical user flows

## API Documentation

### Frontend API Calls

The frontend makes multiple FetchAPI calls to external services:

1. **City Search** (`searchCity`)
   - Uses Nominatim (OpenStreetMap) for geocoding
   - Returns city information with coordinates

2. **Events** (`getEvents`)
   - Calls Ticketmaster Discovery API
   - Fetches upcoming events for a city

3. **Points of Interest** (`getPointsOfInterest`)
   - Uses OpenTripMap API
   - Falls back to Overpass API for broader coverage

4. **Weather** (`getWeather`)
   - Calls Open-Meteo API
   - Retrieves 7-day weather forecast

5. **Photos** (`getPhotos`)
   - Uses Unsplash API
   - Fetches destination photos

### Custom API Endpoints (Vercel Serverless Functions)

Travel Genie includes two custom API endpoints deployed as Vercel serverless functions:

#### 1. GET/POST `/api/trips`

**GET Request - Retrieve Trips from Database**

```
GET /api/trips?userId=<user_id>
GET /api/trips?shareToken=<token>
```

**Query Parameters:**
- `userId` (string, required for user trips): User ID to fetch trips for
- `shareToken` (string, required for public trips): Share token for public trip access

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "city": "Paris",
    "country": "France",
    "lat": 48.8566,
    "lon": 2.3522,
    "notes": "Trip notes",
    "is_public": false,
    "share_token": "abc123",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

**POST Request - Create New Trip**

```
POST /api/trips
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": "uuid",
  "city": "Paris",
  "country": "France",
  "lat": 48.8566,
  "lon": 2.3522,
  "notes": "Optional trip notes"
}
```

**Response:** Returns the created trip object (201 status)

---

#### 2. GET/POST `/api/search-history`

**GET Request - Retrieve and Enrich Search History**

```
GET /api/search-history?userId=<user_id>&limit=10
```

**Query Parameters:**
- `userId` (string, required): User ID to fetch search history for
- `limit` (number, optional): Maximum number of results (default: 10)

**Functionality:** This endpoint retrieves search history from the Supabase database and enriches each record with additional data from the Nominatim (OpenStreetMap) API, including display name, place rank, and importance scores.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "query": "Paris",
    "city": "Paris",
    "country": "France",
    "lat": 48.8566,
    "lon": 2.3522,
    "created_at": "2024-01-01T00:00:00Z",
    "enriched": {
      "display_name": "Paris, France",
      "place_rank": 16,
      "importance": 0.915
    }
  }
]
```

**POST Request - Save Search to Database**

```
POST /api/search-history
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": "uuid",
  "query": "Paris",
  "city": "Paris",
  "country": "France",
  "lat": 48.8566,
  "lon": 2.3522
}
```

**Response:** Returns the saved search record (201 status)

---

### API Usage in Frontend

These endpoints are designed to be called from the frontend using FetchAPI. Example:

```typescript
// Fetch user's trips
const response = await fetch(`/api/trips?userId=${userId}`)
const trips = await response.json()

// Create a new trip
const response = await fetch('/api/trips', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: userId,
    city: 'Paris',
    country: 'France',
    lat: 48.8566,
    lon: 2.3522
  })
})
const newTrip = await response.json()
```

## Project Structure

```
travel-genie/
├── api/                    # Vercel serverless functions
│   ├── trips/
│   │   └── index.ts       # Trips API endpoint
│   └── search-history/
│       └── index.ts       # Search history API endpoint
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── AuthModal.tsx
│   │   ├── CitySearch.tsx
│   │   ├── EventCard.tsx
│   │   ├── Header.tsx
│   │   ├── MapView.tsx
│   │   ├── PhotoGrid.tsx
│   │   ├── PoiCard.tsx
│   │   ├── TripNotes.tsx
│   │   └── WeatherChart.tsx
│   ├── pages/             # Page components
│   │   ├── About.tsx      # About page
│   │   ├── Home.tsx       # Home/Landing page
│   │   ├── MyTrips.tsx    # Saved trips page
│   │   ├── SharedTrip.tsx # Public shared trip viewer
│   │   └── Trip.tsx       # Main trip details page
│   ├── lib/               # Utility functions
│   │   ├── fetcher.ts     # External API integration
│   │   ├── supabase.ts    # Supabase client and helpers
│   │   └── types.ts       # TypeScript type definitions
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # Application entry point
│   └── styles.css         # Global styles
├── public/                # Static assets
├── vercel.json            # Vercel deployment configuration
├── vite.config.ts         # Vite build configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies and scripts
```

## Known Bugs and Limitations

### Critical Issues

1. **Supabase Authentication in Production Builds**
   - **Status:** Known limitation
   - **Description:** Supabase client initialization fails in Vercel production builds with error: "Cannot read properties of undefined (reading 'headers')"
   - **Impact:** Authentication, trip saving, and sharing features do not work in production
   - **Workaround:** All features work correctly in development mode (`npm run dev`)
   - **Root Cause:** Bundling incompatibility between `@supabase/supabase-js` and Vite's production bundler
   - **Attempted Fixes:**
     - Removed code-splitting for Supabase
     - Updated to latest Supabase version (2.88.0)
     - Added explicit Web API bindings
     - Tried multiple initialization strategies
   - **Future Solution:** Wait for Supabase/Vite compatibility update or migrate to alternative auth solution

2. **API Rate Limiting**
   - **Status:** Expected behavior
   - **Description:** External APIs (Ticketmaster, Unsplash, OpenTripMap) have rate limits
   - **Impact:** Excessive requests may be throttled
   - **Mitigation:** React Query caching reduces API calls

### Minor Issues

1. **Leaflet CSS Loading**
   - **Status:** Fixed
   - **Description:** Previously used CDN link with integrity check that failed
   - **Solution:** Moved to npm package import

2. **CORS Errors (Local Development)**
   - **Status:** Known issue with some browser extensions
   - **Description:** Browser extensions may interfere with Supabase API calls
   - **Workaround:** Test in incognito mode or disable extensions

## Roadmap for Future Development

### Short-term (Next 1-2 months)

- [ ] **Fix Supabase Production Issue**
  - Investigate alternative bundling strategies
  - Consider migrating to Auth0 or Clerk for authentication
  - Implement direct REST API calls as fallback

- [ ] **Add Automated Testing**
  - Set up Vitest for unit testing
  - Add React Testing Library for component tests
  - Implement E2E tests with Playwright

- [ ] **Improve Error Handling**
  - Add global error boundary
  - Implement retry logic for failed API calls
  - Better user-facing error messages

- [ ] **Performance Optimization**
  - Implement code splitting
  - Add image lazy loading
  - Optimize bundle size

### Medium-term (3-6 months)

- [ ] **Enhanced Trip Planning**
  - Drag-and-drop itinerary builder
  - Suggested routes based on POI locations
  - Estimated travel times between attractions

- [ ] **Social Features**
  - User reviews and ratings for attractions
  - Collaborative trip planning
  - Trip templates and recommendations

- [ ] **Offline Support**
  - Service worker for offline functionality
  - Cache trip data locally
  - Offline map support

- [ ] **Advanced Filtering**
  - Filter events by date, category, price
  - Filter POIs by type, rating, distance
  - Save filter preferences

### Long-term (6+ months)

- [ ] **Mobile App**
  - React Native mobile application
  - Push notifications for events
  - Native map integration

- [ ] **Booking Integration**
  - Direct booking links for events
  - Hotel recommendations
  - Restaurant reservations

- [ ] **AI-Powered Features**
  - Personalized trip recommendations
  - Smart itinerary generation
  - Weather-based activity suggestions

- [ ] **Analytics Dashboard**
  - User travel statistics
  - Popular destinations tracking
  - Trip completion rates

## Additional Resources

- **Vite Documentation:** [vitejs.dev](https://vitejs.dev/)
- **React Documentation:** [react.dev](https://react.dev/)
- **TypeScript Documentation:** [typescriptlang.org](https://www.typescriptlang.org/)
- **Tailwind CSS Documentation:** [tailwindcss.com](https://tailwindcss.com/)
- **Supabase Documentation:** [supabase.com/docs](https://supabase.com/docs)
- **Vercel Documentation:** [vercel.com/docs](https://vercel.com/docs)

## Contact and Support

For questions or issues:
1. Check the GitHub Issues page
2. Review the known bugs section above
3. Consult the API documentation
4. Contact the development team

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Maintained by:** Travel Genie Development Team
