export type Coordinates = { lat: number; lng: number };

export type CityInfo = {
  name: string;
  country: string;
  coordinates: Coordinates;
};

export type WeatherPoint = {
  timestamp: string; // ISO
  temperatureC: number;
};

export type CityApiResponse = {
  city: CityInfo;
  weather: WeatherPoint[];
  events: Array<{ id: string; title: string; startsAt: string }>;
  pois: Array<{ id: string; name: string; coordinates: Coordinates }>;
  photos: string[];
};



