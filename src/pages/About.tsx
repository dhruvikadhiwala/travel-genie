import { Header } from '../components/Header'

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="About Travel Genie" showBackButton />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Travel Genie</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 text-lg mb-6">
              Travel Genie is a personalized trip explorer that blends events, points of interest, 
              photos, and weather into a single, shareable trip board. Say goodbye to juggling multiple 
              tabs and apps when planning your next adventure!
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              Planning a trip usually means bouncing between a ton of tabs: one for events, one for 
              things to do, another for weather, and maybe scrolling through photos on Instagram. 
              It's messy and tiring, and a lot of times people end up giving up or missing out because 
              it's just too much to organize. Travel Genie unifies everything you need to plan the perfect trip.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>City Search:</strong> Find information for any city worldwide with intelligent search</li>
              <li><strong>Events:</strong> Discover upcoming concerts, sports, and cultural events</li>
              <li><strong>Attractions:</strong> Explore top-rated points of interest and must-see locations</li>
              <li><strong>Weather Forecast:</strong> Plan your visit with 7-day weather predictions</li>
              <li><strong>Photo Gallery:</strong> Get inspired with beautiful photos of your destination</li>
              <li><strong>Interactive Maps:</strong> Visualize attractions and plan your route</li>
              <li><strong>Save & Share:</strong> Save your favorite trips and share them with friends</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>React 18 with TypeScript</li>
                  <li>Vite for fast development</li>
                  <li>Tailwind CSS for styling</li>
                  <li>React Router for navigation</li>
                  <li>TanStack Query for data management</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Libraries & Tools</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Leaflet & React-Leaflet (Maps)</li>
                  <li>Recharts (Weather Charts)</li>
                  <li>Heroicons (Icons)</li>
                  <li>Supabase (Database & Auth)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Sources</h2>
            <p className="text-gray-700 mb-4">
              Travel Genie aggregates data from multiple reliable sources:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Ticketmaster:</strong> Event listings and concerts</li>
              <li><strong>OpenTripMap:</strong> Points of interest and attractions</li>
              <li><strong>Open-Meteo:</strong> Weather forecasts</li>
              <li><strong>Unsplash:</strong> High-quality destination photos</li>
              <li><strong>Nominatim/OpenStreetMap:</strong> Geocoding and city data</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Who We're For</h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Students & Professionals</h3>
                <p className="text-gray-700 text-sm">
                  Perfect for planning short trips or weekend getaways
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Travel Bloggers</h3>
                <p className="text-gray-700 text-sm">
                  Create and share curated trip boards with your audience
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Trip Organizers</h3>
                <p className="text-gray-700 text-sm">
                  Student orgs and groups can plan and share trip details
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Built with ❤️ for travelers who want to explore the world with ease.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

