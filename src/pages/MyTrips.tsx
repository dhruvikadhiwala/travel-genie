import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header'
import { db, auth } from '../lib/supabase'
import { Trip } from '../lib/types'
import { 
  CalendarIcon, 
  MapPinIcon, 
  TrashIcon,
  ShareIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export function MyTrips() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [trips, setTrips] = useState<Trip[]>([])

  useEffect(() => {
    auth.getSession().then((session) => {
      if (session?.user) {
        setUser(session.user)
      } else {
        navigate('/')
      }
    })
  }, [navigate])

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['myTrips'],
    queryFn: async () => {
      if (!user) return []
      return await db.getTrips()
    },
    enabled: !!user,
  })

  useEffect(() => {
    if (data) {
      setTrips(data)
    }
  }, [data])

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return

    try {
      const success = await db.deleteTrip(tripId)
      if (success) {
        refetch()
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
      alert('Failed to delete trip')
    }
  }

  const handleShareTrip = async (tripId: string) => {
    try {
      const shareToken = await db.generateShareToken(tripId)
      if (shareToken) {
        const shareUrl = `${window.location.origin}/shared/${shareToken}`
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl)
          alert('Share link copied to clipboard!')
        } else {
          // Fallback: show the URL for manual copying
          prompt('Copy this share link:', shareUrl)
        }
      } else {
        alert('Failed to generate share token')
      }
    } catch (error: any) {
      console.error('Error sharing trip:', error)
      console.error('Full error object:', JSON.stringify(error, null, 2))
      const errorMessage = error?.message || 'Unknown error occurred'
      
      // Show detailed error in console for debugging
      if (error?.code) {
        console.error('Supabase error code:', error.code)
      }
      if (error?.details) {
        console.error('Error details:', error.details)
      }
      if (error?.hint) {
        console.error('Error hint:', error.hint)
      }
      
      alert(`Failed to generate share link: ${errorMessage}\n\nPlease check the browser console (F12) for more details.`)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="My Trips" showBackButton />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Please sign in to view your trips</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Trips" showBackButton />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Saved Trips</h1>
            <p className="text-gray-600">Manage and share your travel plans</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Plan New Trip
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner mx-auto" />
          </div>
        ) : trips.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPinIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No trips yet</h3>
            <p className="text-gray-600 mb-6">
              Start planning your first trip by searching for a destination
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="card hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {trip.city}
                  </h3>
                  <p className="text-sm text-gray-600">{trip.country}</p>
                </div>

                {trip.notes && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{trip.notes}</p>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>
                    Saved {
                      trip.createdAt 
                        ? new Date(trip.createdAt).toLocaleDateString()
                        : trip.created_at
                        ? new Date(trip.created_at).toLocaleDateString()
                        : 'Recently'
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/trip/${encodeURIComponent(trip.city)}`)}
                    className="btn btn-primary text-sm"
                  >
                    View Trip
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleShareTrip(trip.id)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Share trip"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete trip"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



