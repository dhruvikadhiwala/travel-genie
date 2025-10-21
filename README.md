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

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

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
│   └── Header.tsx       # Navigation header
├── pages/               # Page components
│   ├── Home.tsx         # Landing page
│   └── Trip.tsx         # Trip details page
├── lib/                 # Utility functions
│   ├── types.ts         # TypeScript type definitions
│   └── fetcher.ts       # API integration functions
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

## 🔮 Future Enhancements

- [ ] User authentication with Supabase
- [ ] Save and share trip boards
- [ ] Trip recommendations based on preferences
- [ ] Offline support with service workers
- [ ] Social features and trip sharing
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
