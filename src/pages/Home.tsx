import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { CitySearch } from '../components/CitySearch'
import { CityInfo } from '../lib/types'

export function Home() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCitySelect = async (city: CityInfo) => {
    setLoading(true)
    try {
      // Navigate to trip page with city name
      navigate(`/trip/${encodeURIComponent(city.name)}`)
    } catch (error) {
      console.error('Error navigating to trip page:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Discover Your Next
            <span className="text-primary-600 block">Adventure</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Travel Genie combines events, attractions, weather, and stunning photos 
            into one beautiful trip planner. Plan your perfect getaway in minutes.
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-16">
          <CitySearch
            onCitySelect={handleCitySelect}
            loading={loading}
            placeholder="Where would you like to go?"
            className="text-lg"
          />
          
          {loading && (
            <div className="mt-4 text-center">
              <div className="loading-spinner mx-auto mb-2" />
              <p className="text-gray-600">Preparing your trip...</p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Events & Activities</h3>
            <p className="text-gray-600">
              Find concerts, festivals, and local events happening during your stay.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Points of Interest</h3>
            <p className="text-gray-600">
              Discover museums, landmarks, restaurants, and hidden gems.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Weather Forecast</h3>
            <p className="text-gray-600">
              Plan your activities with accurate 7-day weather predictions.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Beautiful Photos</h3>
            <p className="text-gray-600">
              Get inspired by stunning photos of your destination.
            </p>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Destinations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Paris', country: 'France', image: '🇫🇷' },
              { name: 'Tokyo', country: 'Japan', image: '🇯🇵' },
              { name: 'New York', country: 'United States', image: '🇺🇸' },
              { name: 'London', country: 'United Kingdom', image: '🇬🇧' },
              { name: 'Rome', country: 'Italy', image: '🇮🇹' },
              { name: 'Barcelona', country: 'Spain', image: '🇪🇸' },
              { name: 'Sydney', country: 'Australia', image: '🇦🇺' },
              { name: 'Amsterdam', country: 'Netherlands', image: '🇳🇱' },
            ].map((destination) => (
              <button
                key={destination.name}
                onClick={() => handleCitySelect({
                  name: destination.name,
                  country: destination.country,
                  lat: 0, // These will be resolved by the API
                  lon: 0,
                })}
                className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="text-4xl mb-3">{destination.image}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {destination.name}
                </h3>
                <p className="text-sm text-gray-600">{destination.country}</p>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Plan Your Perfect Trip?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of travelers who use Travel Genie to discover amazing destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary px-8 py-3">
              Start Planning Now
            </button>
            <button className="btn btn-outline px-8 py-3">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-primary-600 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Travel Genie</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your personal trip explorer for discovering amazing destinations.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Travel Genie. Built with ❤️ for travelers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
