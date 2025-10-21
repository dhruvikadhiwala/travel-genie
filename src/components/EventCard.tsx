import { HeartIcon, CalendarIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Event } from '../lib/types'
import { formatDate, formatTime, formatCurrency } from '../lib/fetcher'

interface EventCardProps {
  event: Event;
  onFavorite?: (event: Event) => void;
  isFavorited?: boolean;
}

export function EventCard({ event, onFavorite, isFavorited = false }: EventCardProps) {
  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(event)
    }
  }

  const getPrimaryGenre = () => {
    const primaryClassification = event.classifications?.find(c => c.primary)
    return primaryClassification?.genre?.name || primaryClassification?.segment?.name || 'Event'
  }

  const getPriceRange = () => {
    if (!event.priceRanges || event.priceRanges.length === 0) {
      return 'Price not available'
    }
    
    const range = event.priceRanges[0]
    if (range.min === range.max) {
      return formatCurrency(range.min, range.currency)
    }
    return `${formatCurrency(range.min, range.currency)} - ${formatCurrency(range.max, range.currency)}`
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {event.name}
          </h3>
          <div className="flex items-center text-sm text-primary-600 mb-2">
            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
              {getPrimaryGenre()}
            </span>
          </div>
        </div>
        
        {onFavorite && (
          <button
            onClick={handleFavorite}
            className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorited ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{formatDate(event.localDate)}</span>
          {event.localTime && (
            <span className="ml-1">
              at {formatTime(event.localTime)}
            </span>
          )}
        </div>
        
        <div className="flex items-start text-sm text-gray-600">
          <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium">{event.venue.name}</div>
            <div className="text-gray-500">
              {event.venue.city}
              {event.venue.state && `, ${event.venue.state}`}
              {event.venue.address && (
                <div className="text-xs text-gray-400 mt-1">
                  {event.venue.address}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <CurrencyDollarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{getPriceRange()}</span>
        </div>
      </div>

      {/* Event Image */}
      {event.images && event.images.length > 0 && (
        <div className="mb-4">
          <img
            src={event.images[0].url}
            alt={event.name}
            className="w-full h-32 object-cover rounded-md"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary text-sm"
        >
          View Tickets
        </a>
        
        {event.classifications && event.classifications.length > 0 && (
          <div className="text-xs text-gray-500">
            {event.classifications.length} classification{event.classifications.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}
