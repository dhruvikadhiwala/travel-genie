// API Response Types
export interface CityInfo {
  name: string;
  country: string;
  lat: number;
  lon: number;
  population?: number;
}

export interface WeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    weathercode: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
  };
}

export interface Event {
  id: string;
  name: string;
  url: string;
  localDate: string;
  localTime?: string;
  venue: {
    name: string;
    city: string;
    state?: string;
    country: string;
    address?: string;
    location?: {
      latitude: string;
      longitude: string;
    };
  };
  priceRanges?: Array<{
    min: number;
    max: number;
    currency: string;
  }>;
  classifications?: Array<{
    primary: boolean;
    segment: {
      name: string;
    };
    genre: {
      name: string;
    };
  }>;
  images?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

export interface PointOfInterest {
  xid: string;
  name: string;
  dist?: number;
  rate: number;
  wikidata?: string;
  kinds: string;
  point: {
    lon: number;
    lat: number;
  };
  osm?: string;
  bbox?: {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
  };
  preview?: {
    source: string;
    height: number;
    width: number;
  };
  wikipedia?: string;
  wikipedia_extracts?: {
    title: string;
    text: string;
    html: string;
  };
}

export interface Photo {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  alt_description?: string;
  user: {
    name: string;
    username: string;
  };
  likes: number;
}

// App State Types
export interface Trip {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  isPublic?: boolean;
  shareToken?: string;
}

export interface Favorite {
  id: string;
  tripId: string;
  type: 'event' | 'poi' | 'photo';
  itemId: string;
  itemData: Event | PointOfInterest | Photo;
  createdAt: string;
  userId: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  createdAt: string;
  userId?: string;
}

// UI State Types
export interface LoadingState {
  events: boolean;
  pois: boolean;
  weather: boolean;
  photos: boolean;
  city: boolean;
}

export interface ErrorState {
  events?: string;
  pois?: string;
  weather?: string;
  photos?: string;
  city?: string;
}

// API Response Wrapper
export interface CityDataResponse {
  city: CityInfo;
  events: Event[];
  pois: PointOfInterest[];
  weather: WeatherData;
  photos: Photo[];
}

// Component Props Types
export interface CitySearchProps {
  onCitySelect: (city: CityInfo) => void;
  loading?: boolean;
}

export interface EventCardProps {
  event: Event;
  onFavorite?: (event: Event) => void;
  isFavorited?: boolean;
}

export interface PoiCardProps {
  poi: PointOfInterest;
  onFavorite?: (poi: PointOfInterest) => void;
  isFavorited?: boolean;
}

export interface WeatherChartProps {
  weather: WeatherData;
}

export interface PhotoGridProps {
  photos: Photo[];
  onFavorite?: (photo: Photo) => void;
  favoritedPhotos?: Set<string>;
}

export interface MapViewProps {
  pois: PointOfInterest[];
  center: [number, number];
  zoom?: number;
}
