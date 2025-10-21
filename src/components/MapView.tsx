import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { PointOfInterest } from '../lib/types'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapViewProps {
  pois: PointOfInterest[];
  center: [number, number];
  zoom?: number;
}

// Create custom icons for different POI types
const createIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
    </svg>
  `)}`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
})

const poiIcons = {
  default: createIcon('#3b82f6'),
  cultural: createIcon('#8b5cf6'),
  historic: createIcon('#f59e0b'),
  nature: createIcon('#10b981'),
  food: createIcon('#ef4444'),
  entertainment: createIcon('#ec4899'),
  shopping: createIcon('#06b6d4'),
}

function getPoiIcon(poi: PointOfInterest): Icon {
  const kinds = poi.kinds.toLowerCase()
  
  if (kinds.includes('cultural') || kinds.includes('museum') || kinds.includes('theatre')) {
    return poiIcons.cultural
  }
  if (kinds.includes('historic') || kinds.includes('monument') || kinds.includes('castle')) {
    return poiIcons.historic
  }
  if (kinds.includes('nature') || kinds.includes('park') || kinds.includes('beach') || kinds.includes('mountain')) {
    return poiIcons.nature
  }
  if (kinds.includes('restaurant') || kinds.includes('food') || kinds.includes('cafe')) {
    return poiIcons.food
  }
  if (kinds.includes('entertainment') || kinds.includes('cinema') || kinds.includes('nightclub')) {
    return poiIcons.entertainment
  }
  if (kinds.includes('shop') || kinds.includes('market') || kinds.includes('mall')) {
    return poiIcons.shopping
  }
  
  return poiIcons.default
}

function getPoiCategory(poi: PointOfInterest): string {
  const kinds = poi.kinds.toLowerCase()
  
  if (kinds.includes('cultural') || kinds.includes('museum') || kinds.includes('theatre')) {
    return 'Cultural'
  }
  if (kinds.includes('historic') || kinds.includes('monument') || kinds.includes('castle')) {
    return 'Historic'
  }
  if (kinds.includes('nature') || kinds.includes('park') || kinds.includes('beach') || kinds.includes('mountain')) {
    return 'Nature'
  }
  if (kinds.includes('restaurant') || kinds.includes('food') || kinds.includes('cafe')) {
    return 'Food & Drink'
  }
  if (kinds.includes('entertainment') || kinds.includes('cinema') || kinds.includes('nightclub')) {
    return 'Entertainment'
  }
  if (kinds.includes('shop') || kinds.includes('market') || kinds.includes('mall')) {
    return 'Shopping'
  }
  
  return 'Point of Interest'
}

export function MapView({ pois, center, zoom = 12 }: MapViewProps) {
  if (pois.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Points of Interest</h3>
          <p className="text-gray-600">We couldn't find any points of interest for this location.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Points of Interest Map
        </h3>
        <p className="text-sm text-gray-600">
          Discover {pois.length} attraction{pois.length !== 1 ? 's' : ''} in the area
        </p>
      </div>

      <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {pois.map((poi) => (
            <Marker
              key={poi.xid}
              position={[poi.point.lat, poi.point.lon]}
              icon={getPoiIcon(poi)}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h4 className="font-semibold text-gray-900 mb-1">{poi.name}</h4>
                  
                  <div className="mb-2">
                    <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                      {getPoiCategory(poi)}
                    </span>
                  </div>
                  
                  {poi.rate && poi.rate > 0 && (
                    <div className="text-sm text-amber-600 mb-2">
                      ⭐ {poi.rate.toFixed(1)} rating
                    </div>
                  )}
                  
                  {poi.dist && (
                    <div className="text-sm text-gray-600 mb-2">
                      📍 {poi.dist < 1000 ? `${Math.round(poi.dist)}m away` : `${(poi.dist / 1000).toFixed(1)}km away`}
                    </div>
                  )}
                  
                  {poi.wikipedia_extracts?.text && (
                    <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                      {poi.wikipedia_extracts.text}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {poi.wikipedia && (
                      <a
                        href={poi.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        Wikipedia
                      </a>
                    )}
                    
                    {poi.osm && (
                      <a
                        href={`https://www.openstreetmap.org/relation/${poi.osm}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        OpenStreetMap
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">General</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Cultural</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Historic</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Nature</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Food & Drink</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Entertainment</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Shopping</span>
          </div>
        </div>
      </div>
    </div>
  )
}
