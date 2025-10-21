import { HeartIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { PointOfInterest } from '../lib/types'

interface PoiCardProps {
  poi: PointOfInterest;
  onFavorite?: (poi: PointOfInterest) => void;
  isFavorited?: boolean;
}

export function PoiCard({ poi, onFavorite, isFavorited = false }: PoiCardProps) {
  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(poi)
    }
  }

  const getCategories = () => {
    if (!poi.kinds) return []
    
    // Parse the kinds string and return formatted categories
    return poi.kinds
      .split(',')
      .slice(0, 3) // Show only first 3 categories
      .map(kind => kind.trim())
      .filter(kind => kind.length > 0)
      .map(kind => kind.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
  }

  const getDistance = () => {
    if (!poi.dist) return null
    
    if (poi.dist < 1000) {
      return `${Math.round(poi.dist)}m away`
    }
    return `${(poi.dist / 1000).toFixed(1)}km away`
  }

  const getRating = () => {
    if (!poi.rate || poi.rate === 0) return null
    return poi.rate.toFixed(1)
  }

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
            {poi.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            {getRating() && (
              <div className="flex items-center text-sm text-amber-600">
                <StarIcon className="h-4 w-4 mr-1" />
                <span>{getRating()}</span>
              </div>
            )}
            
            {getDistance() && (
              <div className="text-sm text-gray-500">
                {getDistance()}
              </div>
            )}
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

      {/* Categories */}
      {getCategories().length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {getCategories().map((category, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
            >
              {category}
            </span>
          ))}
        </div>
      )}

      {/* Preview Image */}
      {poi.preview?.source && (
        <div className="mb-3">
          <img
            src={poi.preview.source}
            alt={poi.name}
            className="w-full h-32 object-cover rounded-md"
            loading="lazy"
          />
        </div>
      )}

      {/* Description */}
      {poi.wikipedia_extracts?.text && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3">
            {poi.wikipedia_extracts.text}
          </p>
        </div>
      )}

      {/* Location Info */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
        <div>
          <div className="text-xs text-gray-500">
            {poi.point.lat.toFixed(4)}, {poi.point.lon.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {poi.wikipedia && (
            <a
              href={poi.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              Wikipedia
              <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          
          {poi.wikidata && (
            <a
              href={`https://www.wikidata.org/wiki/${poi.wikidata}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              Wikidata
              <svg className="h-3 w-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        
        {poi.osm && (
          <a
            href={`https://www.openstreetmap.org/relation/${poi.osm}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            View on Map
          </a>
        )}
      </div>
    </div>
  )
}
