import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { EventCard } from '../components/EventCard'
import { PoiCard } from '../components/PoiCard'
import { WeatherChart } from '../components/WeatherChart'
import { PhotoGrid } from '../components/PhotoGrid'
import { MapView } from '../components/MapView'
import { getCityData } from '../lib/fetcher'
import { db } from '../lib/supabase'
import { 
  CalendarIcon, 
  MapPinIcon, 
  CloudIcon, 
  PhotoIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'

export function SharedTrip() {
  const { shareToken } = useParams<{ shareToken: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'pois' | 'weather' | 'photos' | 'map'>('overview')

  const { data: trip, isLoading: tripLoading } = useQuery({
    queryKey: ['sharedTrip', shareToken],
    queryFn: async () => {
      if (!shareToken) return null
      return await db.getPublicTrip(shareToken)
    },
    enabled: !!shareToken,
  })

  const { 
    data: cityData, 
    isLoading: cityDataLoading
  } = useQuery({
    queryKey: ['cityData', trip?.city],
    queryFn: () => trip ? getCityData(trip.city) : Promise.reject('No trip data'),
    enabled: !!trip,
  })

  if (tripLoading || cityDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Shared Trip" showBackButton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading shared trip...</h2>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!trip || !cityData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Trip Not Found" showBackButton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h2>
            <p className="text-gray-600 mb-8">
              This shared trip doesn't exist or is no longer available.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { city: cityInfo, events, pois, weather, photos } = cityData

  const tabs = [
    { id: 'overview', label: 'Overview', icon: CalendarIcon },
    { id: 'events', label: 'Events', icon: CalendarIcon, count: events.length },
    { id: 'pois', label: 'Attractions', icon: MapPinIcon, count: pois.length },
    { id: 'weather', label: 'Weather', icon: CloudIcon },
    { id: 'photos', label: 'Photos', icon: PhotoIcon, count: photos.length },
    { id: 'map', label: 'Map', icon: MapPinIcon },
  ]

  const handleShare = () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      navigator.share({
        title: `Travel Genie - ${cityInfo.name}`,
        text: `Check out this trip to ${cityInfo.name}, ${cityInfo.country}`,
        url: shareUrl,
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Share link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`${cityInfo.name}, ${cityInfo.country} (Shared)`} showBackButton />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Shared Trip Badge */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShareIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">This is a shared trip</p>
                <p className="text-xs text-blue-700">View-only access</p>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="btn btn-outline text-sm"
            >
              Share This Trip
            </button>
          </div>
        </div>

        {/* City Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {cityInfo.name}, {cityInfo.country}
              </h1>
              {trip.notes && (
                <p className="text-gray-600 mt-2">{trip.notes}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{events.length} upcoming events</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{pois.length} attractions</span>
                </div>
                <div className="flex items-center">
                  <PhotoIcon className="h-4 w-4 mr-1" />
                  <span>{photos.length} photos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content - Same as Trip page */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                    <div className="text-sm text-blue-800">Events</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{pois.length}</div>
                    <div className="text-sm text-green-800">Attractions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{photos.length}</div>
                    <div className="text-sm text-purple-800">Photos</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">7</div>
                    <div className="text-sm text-orange-800">Weather Days</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {events.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {event.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {event.venue.name} • {new Date(event.localDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="text-gray-500 text-sm">No upcoming events found</p>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2">
                <WeatherChart weather={weather} />
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
              {events.length === 0 && (
                <div className="col-span-full">
                  <div className="card text-center py-12">
                    <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
                    <p className="text-gray-600">No upcoming events were found for this location.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pois' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pois.map((poi) => (
                <PoiCard key={poi.xid} poi={poi} />
              ))}
              {pois.length === 0 && (
                <div className="col-span-full">
                  <div className="card text-center py-12">
                    <MapPinIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Attractions Found</h3>
                    <p className="text-gray-600">No points of interest were found for this location.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'weather' && (
            <WeatherChart weather={weather} />
          )}

          {activeTab === 'photos' && (
            <PhotoGrid photos={photos} />
          )}

          {activeTab === 'map' && (
            <MapView
              pois={pois}
              center={[cityInfo.lat, cityInfo.lon]}
              zoom={12}
            />
          )}
        </div>
      </div>
    </div>
  )
}


