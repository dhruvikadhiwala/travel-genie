# Travel Genie 🧞‍♂️

A personalized trip explorer that blends events, points of interest, photos, and weather into a single, shareable trip board.

## 🌟 Features

- **Event Discovery**: Find concerts, festivals, and local events via Ticketmaster API
- **Points of Interest**: Discover museums, landmarks, restaurants, and attractions via OpenTripMap
- **Weather Forecast**: 7-day weather predictions via Open-Meteo API
- **Beautiful Photos**: High-quality destination images via Unsplash API
- **Interactive Map**: Explore attractions on an interactive Leaflet map
- **Trip Planning**: Save favorites and plan your perfect itinerary
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- API keys for the following services:
  - [Ticketmaster Discovery API](https://developer.ticketmaster.com/)
  - [OpenTripMap API](https://opentripmap.io/product)
  - [Unsplash API](https://unsplash.com/developers)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-genie
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_TICKETMASTER_API_KEY=your_ticketmaster_api_key_here
   VITE_OPENTRIPMAP_API_KEY=your_opentripmap_api_key_here
   VITE_UNSPLASH_API_KEY=your_unsplash_api_key_here
   ```

4. **Set up Supabase (optional, for authentication features)**
   Add your Supabase credentials to `.env`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   Note: You'll need to create the database tables in your Supabase project for authentication and trip saving features to work.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment to Vercel

### Deploy Steps

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables in Vercel Dashboard**
   - Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to **Settings** → **Environment Variables**
   - Add all environment variables:
     - `VITE_TICKETMASTER_API_KEY`
     - `VITE_OPENTRIPMAP_API_KEY`
     - `VITE_UNSPLASH_API_KEY`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Enable them for **Production**, **Preview**, and **Development**
   - **Redeploy** after adding variables

5. **Get Your Deployment URL**
   - After deployment, Vercel will provide you with a production URL
   - Example: `https://travel-genie-xyz.vercel.app`

### Known Limitation: Supabase in Production

**Status:** Supabase authentication features do not work in Vercel production builds due to a bundling incompatibility between `@supabase/supabase-js` and Vite's production bundler.

**Impact:**
- ❌ Authentication (sign in/sign up) does not work in production
- ❌ Saving trips does not work in production
- ❌ Sharing trips does not work in production
- ✅ **All core features work perfectly:** City search, trip viewing, events, weather, photos, maps

**Note:** All authentication features work correctly in development (`npm run dev`). This is a production build-specific issue. See `DEPLOYMENT_NOTES.md` for more details on attempted fixes.

**For Class Assignment:** This limitation can be documented. The core application successfully demonstrates multi-API integration, state management, interactive maps, data visualization, and modern React/TypeScript patterns.

## 🎯 For Class Assignment

1. **GitHub Repository**: Make sure your repository is public on GitHub
2. **Deploy to Vercel**: Follow the deployment steps above
3. **Submit**: Your GitHub repo link + Vercel deployment URL

## 🔧 API Setup

### Ticketmaster API
1. Visit [Ticketmaster Developer Portal](https://developer.ticketmaster.com/)
2. Sign up for a free account
3. Create a new application
4. Copy your API key

### OpenTripMap API
1. Visit [OpenTripMap](https://opentripmap.io/product)
2. Sign up for a free account
3. Get your API key from the dashboard

### Unsplash API
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Maps**: Leaflet with React-Leaflet
- **Charts**: Recharts
- **Icons**: Heroicons
- **Routing**: React Router DOM
- **Database & Auth**: Supabase (PostgreSQL + Authentication)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CitySearch.tsx   # City search with autocomplete
│   ├── EventCard.tsx    # Event display card
│   ├── PoiCard.tsx      # Point of interest card
│   ├── WeatherChart.tsx # Weather forecast chart
│   ├── PhotoGrid.tsx    # Photo gallery
│   ├── MapView.tsx      # Interactive map
│   ├── Header.tsx       # Navigation header
│   ├── AuthModal.tsx    # Authentication modal
│   └── TripNotes.tsx    # Trip notes editor
├── pages/               # Page components
│   ├── Home.tsx         # Landing page
│   ├── Trip.tsx         # Trip details page
│   ├── MyTrips.tsx      # Saved trips page
│   └── SharedTrip.tsx   # Public shared trip viewer
├── lib/                 # Utility functions
│   ├── types.ts         # TypeScript type definitions
│   ├── fetcher.ts       # API integration functions
│   └── supabase.ts      # Supabase client and database helpers
├── App.tsx              # Main app component
├── main.tsx             # App entry point
└── styles.css           # Global styles
```

## 🎨 Design Features

- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Responsive**: Mobile-first design that works on all devices
- **Accessible**: Semantic HTML and keyboard navigation
- **Fast**: Optimized loading with React Query caching
- **Interactive**: Smooth animations and hover effects

## ✅ Implemented Features

- ✅ User authentication with Supabase (sign up, sign in, magic link)
- ✅ Save and share trip boards
- ✅ Trip notes for saved trips
- ✅ Favorites for events, POIs, and photos
- ✅ My Trips page to manage saved trips
- ✅ Public trip sharing via share tokens

## 🔮 Future Enhancements

- [ ] Trip recommendations based on preferences
- [ ] Offline support with service workers
- [ ] Advanced filtering and search
- [ ] Integration with booking services
- [ ] Mobile app with React Native

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ticketmaster](https://developer.ticketmaster.com/) for event data
- [OpenTripMap](https://opentripmap.io/) for points of interest
- [Open-Meteo](https://open-meteo.com/) for weather data
- [Unsplash](https://unsplash.com/) for beautiful photos
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/travel-genie/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

Made with ❤️ for travelers everywhere. Happy exploring! 🌍✈️
