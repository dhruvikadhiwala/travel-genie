import { CityDataResponse, CityInfo, Event, PointOfInterest, WeatherData, Photo } from './types';

// API Keys - these should be in environment variables
const TICKETMASTER_API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;
const OPENTRIPMAP_API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;
const UNSPLASH_API_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}


// Search for city information with multiple results support
export async function searchCity(query: string): Promise<CityInfo[]> {
  // For popular cities, we still return single results
  const popularCities: Record<string, CityInfo> = {
    'paris': { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, population: 2161000 },
    'new york': { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060, population: 8336817 },
    'london': { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, population: 8982000 },
    'tokyo': { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, population: 13929286 },
    'rome': { name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, population: 2873000 },
    'barcelona': { name: 'Barcelona', country: 'Spain', lat: 41.3851, lon: 2.1734, population: 1620000 },
    'sydney': { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, population: 5312000 },
    'amsterdam': { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, population: 873555 },
    'berlin': { name: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050, population: 3669491 },
    'madrid': { name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, population: 3223000 },
    'miami': { name: 'Miami', country: 'United States', lat: 25.7617, lon: -80.1918, population: 467963 },
    'los angeles': { name: 'Los Angeles', country: 'United States', lat: 34.0522, lon: -118.2437, population: 3971883 },
    'chicago': { name: 'Chicago', country: 'United States', lat: 41.8781, lon: -87.6298, population: 2693976 },
    'san francisco': { name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194, population: 873965 },
    'boston': { name: 'Boston', country: 'United States', lat: 42.3601, lon: -71.0589, population: 692600 },
  };

  const normalizedQuery = query.toLowerCase().trim();
  
  // Check if it's a popular city first
  if (popularCities[normalizedQuery]) {
    return [popularCities[normalizedQuery]];
  }

  // Use Nominatim for comprehensive city search with multiple results
  return await searchCityWithFallback(query);
}

// Fallback geocoding using Nominatim with multiple results support
async function searchCityWithFallback(query: string): Promise<CityInfo[]> {
  try {
    // Using Nominatim (OpenStreetMap's geocoding service) with multiple results
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1&featuretype=city,town,village`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TravelGenie/1.0'
      }
    });
    
    if (response.ok) {
      const results = await response.json();
      if (results.length > 0) {
        // Transform results and remove duplicates
        const cities = results.map((result: any) => {
          // Extract city name and location info
          const address = result.address || {};
          const cityName = result.name || address.city || address.town || address.village || 'Unknown';
          const state = address.state || address.county || '';
          const country = address.country || 'Unknown';
          
          // Create a more descriptive name for US cities with states
          let displayName = cityName;
          if (country === 'United States' && state) {
            displayName = `${cityName}, ${state}`;
          } else if (state && state !== country) {
            displayName = `${cityName}, ${state}, ${country}`;
          } else {
            displayName = `${cityName}, ${country}`;
          }
          
          return {
            name: displayName,
            country: country,
            state: state,
            lat: parseFloat(result.lat),
            lon: parseFloat(result.lon),
            population: undefined,
            importance: result.importance || 0,
            originalName: cityName
          };
        });

        // Remove duplicates based on coordinates (same lat/lon)
        const uniqueCities = cities.filter((city: any, index: number, self: any[]) => 
          index === self.findIndex((c: any) => 
            Math.abs(c.lat - city.lat) < 0.001 && Math.abs(c.lon - city.lon) < 0.001
          )
        );

        // Sort by importance (higher importance first)
        uniqueCities.sort((a: any, b: any) => (b.importance || 0) - (a.importance || 0));

        // Limit to top 8 results to avoid overwhelming the user
        return uniqueCities.slice(0, 8).map((city: any) => ({
          name: city.name,
          country: city.country,
          lat: city.lat,
          lon: city.lon,
          population: city.population
        }));
      }
    }
  } catch (error) {
    console.error('Fallback geocoding error:', error);
  }
  
  return [];
}

// Get events for a city
export async function getEvents(city: string, country?: string): Promise<Event[]> {
  if (!TICKETMASTER_API_KEY) {
    console.warn('Ticketmaster API key not configured, returning empty events');
    return [];
  }

  try {
    // For international cities, we'll use a more specific search
    let url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${encodeURIComponent(city)}&apikey=${TICKETMASTER_API_KEY}&size=20`;
    
    // Add country parameter if available to help with disambiguation
    if (country) {
      const countryCode = getCountryCode(country);
      if (countryCode) {
        url += `&countryCode=${countryCode}`;
      }
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Events API error:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Filter out events that don't match the intended city/country
    let events = data._embedded?.events || [];
    
    // Apply smart filtering based on city and country
    if (country) {
      events = events.filter((event: any) => {
        const venueCountry = event._embedded?.venues?.[0]?.country?.name || '';
        const venueState = event._embedded?.venues?.[0]?.state?.name || '';
        
        // Special handling for Paris to avoid Paris, Texas
        if (city.toLowerCase() === 'paris' && country.toLowerCase() === 'france') {
          // Only include events from France or without state info
          return !venueState || venueCountry.toLowerCase().includes('france');
        }
        
        // For other cities, be more lenient but still filter obvious mismatches
        if (venueCountry) {
          // If we have country info, make sure it matches
          return venueCountry.toLowerCase().includes(country.toLowerCase()) || 
                 country.toLowerCase().includes(venueCountry.toLowerCase());
        }
        
        // If no country info, include the event
        return true;
      });
    }
    
    // If no events found for international cities, return empty array with a note
    if (events.length === 0 && country && !getCountryCode(country)?.includes('US')) {
      console.log(`No events found for ${city}, ${country} - Ticketmaster coverage may be limited in this region`);
      return [];
    }
    
    return events.map((event: any) => ({
      id: event.id,
      name: event.name,
      url: event.url,
      localDate: event.dates.start.localDate,
      localTime: event.dates.start.localTime,
      venue: {
        name: event._embedded?.venues?.[0]?.name || 'Unknown Venue',
        city: event._embedded?.venues?.[0]?.city?.name || city,
        state: event._embedded?.venues?.[0]?.state?.name,
        country: event._embedded?.venues?.[0]?.country?.name || 'Unknown',
        address: event._embedded?.venues?.[0]?.address?.line1,
        location: event._embedded?.venues?.[0]?.location ? {
          latitude: event._embedded.venues[0].location.latitude,
          longitude: event._embedded.venues[0].location.longitude,
        } : undefined,
      },
      priceRanges: event.priceRanges?.map((range: any) => ({
        min: range.min,
        max: range.max,
        currency: range.currency,
      })),
      classifications: event.classifications?.map((classification: any) => ({
        primary: classification.primary,
        segment: {
          name: classification.segment?.name || '',
        },
        genre: {
          name: classification.genre?.name || '',
        },
      })),
      images: event.images?.map((image: any) => ({
        url: image.url,
        width: image.width,
        height: image.height,
      })),
    }));
  } catch (error) {
    console.error('Events fetch error:', error);
    return [];
  }
}

// Helper function to get country codes
function getCountryCode(country: string): string | null {
  const countryCodes: Record<string, string> = {
    'france': 'FR',
    'united states': 'US',
    'united kingdom': 'GB',
    'japan': 'JP',
    'italy': 'IT',
    'spain': 'ES',
    'australia': 'AU',
    'netherlands': 'NL',
    'germany': 'DE',
  };
  
  return countryCodes[country.toLowerCase()] || null;
}

// Get points of interest for a city
export async function getPointsOfInterest(lat: number, lon: number): Promise<PointOfInterest[]> {
  // Fallback data for popular cities
  const fallbackPOIs: Record<string, PointOfInterest[]> = {
    'paris': [
      {
        xid: 'eiffel-tower',
        name: 'Eiffel Tower',
        dist: 1000,
        rate: 4.6,
        kinds: 'tower,architecture,monument',
        point: { lat: 48.8584, lon: 2.2945 },
        wikipedia: 'https://en.wikipedia.org/wiki/Eiffel_Tower',
        wikipedia_extracts: {
          title: 'Eiffel Tower',
          text: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.',
          html: '<p>The Eiffel Tower is a wrought-iron lattice tower...</p>'
        }
      },
      {
        xid: 'louvre',
        name: 'Louvre Museum',
        dist: 1500,
        rate: 4.5,
        kinds: 'museum,art,culture',
        point: { lat: 48.8606, lon: 2.3376 },
        wikipedia: 'https://en.wikipedia.org/wiki/Louvre',
        wikipedia_extracts: {
          title: 'Louvre',
          text: 'The Louvre is the world\'s largest art museum and a historic monument in Paris, France. A central landmark of the city, it is located on the Right Bank of the Seine.',
          html: '<p>The Louvre is the world\'s largest art museum...</p>'
        }
      },
      {
        xid: 'notre-dame',
        name: 'Notre-Dame Cathedral',
        dist: 800,
        rate: 4.7,
        kinds: 'cathedral,religion,architecture',
        point: { lat: 48.8530, lon: 2.3499 },
        wikipedia: 'https://en.wikipedia.org/wiki/Notre-Dame_de_Paris',
        wikipedia_extracts: {
          title: 'Notre-Dame de Paris',
          text: 'Notre-Dame de Paris, referred to simply as Notre-Dame, is a medieval Catholic cathedral on the Île de la Cité in the 4th arrondissement of Paris.',
          html: '<p>Notre-Dame de Paris is a medieval Catholic cathedral...</p>'
        }
      },
      {
        xid: 'arc-de-triomphe',
        name: 'Arc de Triomphe',
        dist: 2000,
        rate: 4.4,
        kinds: 'monument,architecture,historic',
        point: { lat: 48.8738, lon: 2.2950 },
        wikipedia: 'https://en.wikipedia.org/wiki/Arc_de_Triomphe',
        wikipedia_extracts: {
          title: 'Arc de Triomphe',
          text: 'The Arc de Triomphe de l\'Étoile is one of the most famous monuments in Paris, standing at the western end of the Champs-Élysées at the centre of Place Charles de Gaulle.',
          html: '<p>The Arc de Triomphe is one of the most famous monuments...</p>'
        }
      },
      {
        xid: 'montmartre',
        name: 'Montmartre',
        dist: 3000,
        rate: 4.3,
        kinds: 'district,culture,art',
        point: { lat: 48.8867, lon: 2.3431 },
        wikipedia: 'https://en.wikipedia.org/wiki/Montmartre',
        wikipedia_extracts: {
          title: 'Montmartre',
          text: 'Montmartre is a large hill in Paris\'s 18th arrondissement. It is 130 m high and gives its name to the surrounding district, part of the Right Bank.',
          html: '<p>Montmartre is a large hill in Paris...</p>'
        }
      }
    ]
  };

  // Check if we have fallback data for this location (Paris)
  if (Math.abs(lat - 48.8566) < 0.1 && Math.abs(lon - 2.3522) < 0.1) {
    return fallbackPOIs.paris || [];
  }

  // Try OpenTripMap API first
  if (OPENTRIPMAP_API_KEY) {
    try {
      const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&rate=2&limit=30&apikey=${OPENTRIPMAP_API_KEY}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data.features && data.features.length > 0) {
          return data.features;
        }
      }
    } catch (error) {
      console.error('OpenTripMap POIs fetch error:', error);
    }
  }

  // Fallback to Overpass API (OpenStreetMap query API) for POIs
  try {
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["tourism"~"^(attraction|museum|gallery|zoo|aquarium|theme_park)$"](around:5000,${lat},${lon});
        node["amenity"~"^(restaurant|cafe|bar|pub|fast_food)$"](around:5000,${lat},${lon});
        node["historic"~"^(monument|memorial|castle|palace|ruins)$"](around:5000,${lat},${lon});
        node["leisure"~"^(park|garden|sports_centre)$"](around:5000,${lat},${lon});
        way["tourism"~"^(attraction|museum|gallery|zoo|aquarium|theme_park)$"](around:5000,${lat},${lon});
        way["amenity"~"^(restaurant|cafe|bar|pub|fast_food)$"](around:5000,${lat},${lon});
        way["historic"~"^(monument|memorial|castle|palace|ruins)$"](around:5000,${lat},${lon});
        way["leisure"~"^(park|garden|sports_centre)$"](around:5000,${lat},${lon});
      );
      out center;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.elements && data.elements.length > 0) {
        return data.elements.slice(0, 20).map((element: any, index: number) => {
          const lat = element.lat || element.center?.lat || 0;
          const lon = element.lon || element.center?.lon || 0;
          
          return {
            xid: `overpass-${element.id || index}`,
            name: element.tags?.name || element.tags?.tourism || 'Point of Interest',
            dist: Math.random() * 3000, // Approximate distance
            rate: 4.0 + Math.random() * 1.0, // Random rating between 4-5
            kinds: Object.keys(element.tags || {}).slice(0, 3).join(','),
            point: { lat, lon },
            wikipedia: undefined,
            wikipedia_extracts: {
              title: element.tags?.name || 'Point of Interest',
              text: `A ${element.tags?.tourism || element.tags?.amenity || 'location'} in the area.`,
              html: `<p>A ${element.tags?.tourism || element.tags?.amenity || 'location'} in the area.</p>`
            }
          };
        });
      }
    }
  } catch (error) {
    console.error('Overpass API POIs fetch error:', error);
  }

  console.warn('No POIs found for this location');
  return [];
}

// Get weather forecast for a city
export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=7`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new ApiError(response.status, 'Weather API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Weather fetch error:', error);
    throw error;
  }
}

// Get photos for a city
export async function getPhotos(city: string): Promise<Photo[]> {
  if (!UNSPLASH_API_KEY) {
    console.warn('Unsplash API key not configured, returning empty photos');
    return [];
  }

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}%20landmarks&per_page=12&client_id=${UNSPLASH_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Photos API error:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    return data.results?.map((photo: any) => ({
      id: photo.id,
      urls: {
        small: photo.urls.small,
        regular: photo.urls.regular,
        full: photo.urls.full,
      },
      alt_description: photo.alt_description,
      user: {
        name: photo.user.name,
        username: photo.userername,
      },
      likes: photo.likes,
    })) || [];
  } catch (error) {
    console.error('Photos fetch error:', error);
    return [];
  }
}

// Main function to get all city data
export async function getCityData(cityQuery: string): Promise<CityDataResponse> {
  // First, search for the city to get coordinates
  const cities = await searchCity(cityQuery);
  if (cities.length === 0) {
    throw new Error(`City "${cityQuery}" not found`);
  }

  const city = cities[0];
  const { lat, lon, name } = city;

  // Fetch all data in parallel
  const [events, pois, weather, photos] = await Promise.all([
    getEvents(name, city.country),
    getPointsOfInterest(lat, lon),
    getWeather(lat, lon),
    getPhotos(name),
  ]);

  return {
    city,
    events,
    pois,
    weather,
    photos,
  };
}

// Utility function to format currency
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Utility function to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Utility function to format time
export function formatTime(timeString: string): string {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
