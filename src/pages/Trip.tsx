import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { EventCard } from '../components/EventCard'
import { PoiCard } from '../components/PoiCard'
import { WeatherChart } from '../components/WeatherChart'
import { PhotoGrid } from '../components/PhotoGrid'
import { MapView } from '../components/MapView'
import { CitySearch } from '../components/CitySearch'
import { TripNotes } from '../components/TripNotes'
import { getCityData } from '../lib/fetcher'
import { db, auth } from '../lib/supabase'
import { CityInfo, Event, PointOfInterest, Photo, type Trip } from '../lib/types'
import { 
  CalendarIcon, 
  MapPinIcon, 
  CloudIcon, 
  PhotoIcon,
  ShareIcon,
  ArrowPathIcon,
  BookmarkIcon,
  BookmarkSlashIcon
} from '@heroicons/react/24/outline'

export function Trip() {
  const { city } = useParams<{ city: string }>()
  const navigate = useNavigate()
  const [favoritedEvents, setFavoritedEvents] = useState<Set<string>>(new Set())
  const [favoritedPois, setFavoritedPois] = useState<Set<string>>(new Set())
  const [favoritedPhotos, setFavoritedPhotos] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'pois' | 'weather' | 'photos' | 'map'>('overview')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [savedTrip, setSavedTrip] = useState<Trip | null>(null)
  const [saving, setSaving] = useState(false)

  const decodedCity = city ? decodeURIComponent(city) : ''

  useEffect(() => {
    auth.getSession().then((session) => {
      setUser(session?.user || null)
    })
  }, [])

  const { 
    data: cityData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['cityData', decodedCity],
    queryFn: () => getCityData(decodedCity),
    enabled: !!decodedCity,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Check if trip is already saved and load favorites
  useEffect(() => {
    const checkSavedTrip = async () => {
      if (!user || !cityData) return
      
      const trips = await db.getTrips()
      const existingTrip = trips.find(
        (t: Trip) => t.city === cityData.city.name && t.country === cityData.city.country
      )
      
      if (existingTrip) {
        setSavedTrip(existingTrip)
        
        // Load favorites
        const favorites = await db.getFavorites(existingTrip.id)
        favorites.forEach((fav: any) => {
          if (fav.type === 'event') {
            setFavoritedEvents(prev => new Set(prev).add(fav.itemId))
          } else if (fav.type === 'poi') {
            setFavoritedPois(prev => new Set(prev).add(fav.itemId))
          } else if (fav.type === 'photo') {
            setFavoritedPhotos(prev => new Set(prev).add(fav.itemId))
          }
        })
      } else {
        setSavedTrip(null)
      }
    }

    checkSavedTrip()
  }, [user, cityData])

  const handleCitySelect = async (newCity: CityInfo) => {
    setLoading(true)
    try {
      navigate(`/trip/${encodeURIComponent(newCity.name)}`)
    } catch (error) {
      console.error('Error navigating to trip page:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteEvent = async (event: Event) => {
    if (!user || !savedTrip) {
      // Just update local state if not logged in or trip not saved
      setFavoritedEvents(prev => {
        const newSet = new Set(prev)
        if (newSet.has(event.id)) {
          newSet.delete(event.id)
        } else {
          newSet.add(event.id)
        }
        return newSet
      })
      return
    }

    // Save to database
    const isFavorited = favoritedEvents.has(event.id)
    try {
      if (isFavorited) {
        // Remove favorite - would need to find the favorite ID first
        // For now, just update local state
        setFavoritedEvents(prev => {
          const newSet = new Set(prev)
          newSet.delete(event.id)
          return newSet
        })
      } else {
        // Add favorite
        await db.saveFavorite({
          tripId: savedTrip.id,
          type: 'event',
          itemId: event.id,
          itemData: event,
          userId: user.id,
        })
        setFavoritedEvents(prev => new Set(prev).add(event.id))
      }
    } catch (error) {
      console.error('Error saving favorite:', error)
    }
  }

  const handleFavoritePoi = async (poi: PointOfInterest) => {
    if (!user || !savedTrip) {
      setFavoritedPois(prev => {
        const newSet = new Set(prev)
        if (newSet.has(poi.xid)) {
          newSet.delete(poi.xid)
        } else {
          newSet.add(poi.xid)
        }
        return newSet
      })
      return
    }

    const isFavorited = favoritedPois.has(poi.xid)
    try {
      if (isFavorited) {
        setFavoritedPois(prev => {
          const newSet = new Set(prev)
          newSet.delete(poi.xid)
          return newSet
        })
      } else {
        await db.saveFavorite({
          tripId: savedTrip.id,
          type: 'poi',
          itemId: poi.xid,
          itemData: poi,
          userId: user.id,
        })
        setFavoritedPois(prev => new Set(prev).add(poi.xid))
      }
    } catch (error) {
      console.error('Error saving favorite:', error)
    }
  }

  const handleFavoritePhoto = async (photo: Photo) => {
    if (!user || !savedTrip) {
      setFavoritedPhotos(prev => {
        const newSet = new Set(prev)
        if (newSet.has(photo.id)) {
          newSet.delete(photo.id)
        } else {
          newSet.add(photo.id)
        }
        return newSet
      })
      return
    }

    const isFavorited = favoritedPhotos.has(photo.id)
    try {
      if (isFavorited) {
        setFavoritedPhotos(prev => {
          const newSet = new Set(prev)
          newSet.delete(photo.id)
          return newSet
        })
      } else {
        await db.saveFavorite({
          tripId: savedTrip.id,
          type: 'photo',
          itemId: photo.id,
          itemData: photo,
          userId: user.id,
        })
        setFavoritedPhotos(prev => new Set(prev).add(photo.id))
      }
    } catch (error) {
      console.error('Error saving favorite:', error)
    }
  }

  const handleSaveNotes = async (notes: string) => {
    if (!savedTrip) return
    await db.updateTrip(savedTrip.id, { notes })
    setSavedTrip({ ...savedTrip, notes })
  }

  const handleSaveTrip = async () => {
    if (!user) {
      alert('Please sign in to save trips')
      return
    }

    if (!cityData) return

    setSaving(true)
    try {
      if (savedTrip) {
        // Delete saved trip
        await db.deleteTrip(savedTrip.id)
        setSavedTrip(null)
        alert('Trip removed from saved trips')
      } else {
        // Save new trip
        const trip = await db.saveTrip({
          city: cityData.city.name,
          country: cityData.city.country,
          lat: cityData.city.lat,
          lon: cityData.city.lon,
        })
        setSavedTrip(trip)
        alert('Trip saved successfully!')
      }
    } catch (error: any) {
      console.error('Error saving trip:', error)
      alert(error.message || 'Failed to save trip')
    } finally {
      setSaving(false)
    }
  }

  const handleShare = async () => {
    if (!cityData) return

    if (!user) {
      // Share current page URL
      if (navigator.share) {
        navigator.share({
          title: `Travel Genie - ${cityData.city.name}`,
          text: `Check out this amazing destination: ${cityData.city.name}, ${cityData.city.country}`,
          url: window.location.href,
        })
      } else {
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
      return
    }

    // If user is logged in and trip is saved, generate share token
    if (savedTrip) {
      try {
        const shareToken = await db.generateShareToken(savedTrip.id)
        if (shareToken) {
          const shareUrl = `${window.location.origin}/shared/${shareToken}`
          if (navigator.share) {
            navigator.share({
              title: `Travel Genie - ${cityData.city.name}`,
              text: `Check out my trip to ${cityData.city.name}, ${cityData.city.country}`,
              url: shareUrl,
            })
          } else {
            navigator.clipboard.writeText(shareUrl)
            alert('Share link copied to clipboard!')
          }
        }
      } catch (error: any) {
        console.error('Error sharing trip:', error)
        alert('Failed to generate share link')
      }
    } else {
      // Save trip first, then share
      try {
        const newTrip = await db.saveTrip({
          city: cityData.city.name,
          country: cityData.city.country,
          lat: cityData.city.lat,
          lon: cityData.city.lon,
        })
        if (newTrip) {
          setSavedTrip(newTrip)
          const shareToken = await db.generateShareToken(newTrip.id)
          if (shareToken) {
            const shareUrl = `${window.location.origin}/shared/${shareToken}`
            if (navigator.share) {
              navigator.share({
                title: `Travel Genie - ${cityData.city.name}`,
                text: `Check out my trip to ${cityData.city.name}, ${cityData.city.country}`,
                url: shareUrl,
              })
            } else {
              navigator.clipboard.writeText(shareUrl)
              alert('Trip saved and share link copied to clipboard!')
            }
          }
        }
      } catch (error: any) {
        console.error('Error saving and sharing trip:', error)
        alert('Failed to save and share trip')
      }
    }
  }

  const handleRefresh = () => {
    refetch()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title={`Planning trip to ${decodedCity}...`} showBackButton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading your trip...</h2>
              <p className="text-gray-600">Gathering events, attractions, weather, and photos</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !cityData) {
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
              We couldn't find information for "{decodedCity}". Try searching for a different city.
            </p>
            <div className="max-w-md mx-auto">
              <CitySearch
                onCitySelect={handleCitySelect}
                loading={loading}
                placeholder="Search for a different city..."
              />
            </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`${cityInfo.name}, ${cityInfo.country}`} showBackButton />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* City Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {cityInfo.name}, {cityInfo.country}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
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
            
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <button
                onClick={handleRefresh}
                className="btn btn-outline flex items-center"
                disabled={isLoading}
              >
                <ArrowPathIcon className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              {user && (
                <button
                  onClick={handleSaveTrip}
                  disabled={saving}
                  className={`btn ${savedTrip ? 'btn-primary' : 'btn-outline'} flex items-center`}
                  title={savedTrip ? 'Remove from saved trips' : 'Save trip'}
                >
                  {savedTrip ? (
                    <>
                      <BookmarkSlashIcon className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <BookmarkIcon className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </button>
              )}
              <button
                onClick={handleShare}
                className="btn btn-outline flex items-center"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
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

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Quick Stats */}
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

              {/* Top Events */}
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

              {/* Weather Summary */}
              <div className="lg:col-span-2">
                <WeatherChart weather={weather} />
              </div>

              {/* Trip Notes - Only show if trip is saved */}
              {savedTrip && (
                <div className="lg:col-span-2">
                  <TripNotes
                    tripId={savedTrip.id}
                    initialNotes={savedTrip.notes || ''}
                    onSave={handleSaveNotes}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onFavorite={handleFavoriteEvent}
                  isFavorited={favoritedEvents.has(event.id)}
                />
              ))}
              {events.length === 0 && (
                <div className="col-span-full">
                  <div className="card text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <CalendarIcon className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
                    <p className="text-gray-600 mb-4">
                      No upcoming events were found for this location.
                    </p>
                    <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                      <p className="font-medium mb-2">Why might this be?</p>
                      <ul className="text-left space-y-1">
                        <li>• Event coverage may be limited in this region</li>
                        <li>• Try searching for nearby major cities</li>
                        <li>• Check local tourism websites for events</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pois' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pois.map((poi) => (
                <PoiCard
                  key={poi.xid}
                  poi={poi}
                  onFavorite={handleFavoritePoi}
                  isFavorited={favoritedPois.has(poi.xid)}
                />
              ))}
              {pois.length === 0 && (
                <div className="col-span-full">
                  <div className="card text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <MapPinIcon className="w-12 h-12 mx-auto" />
                    </div>
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
            <PhotoGrid
              photos={photos}
              onFavorite={handleFavoritePhoto}
              favoritedPhotos={favoritedPhotos}
            />
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
