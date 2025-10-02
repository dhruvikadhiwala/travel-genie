// Vercel Node.js Serverless Function
// GET /api/city?q=Paris
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const q = (req.query.q as string) || (req.query.city as string) || 'Paris';

  // Mocked data for demo purposes. Replace with real providers as needed.
  const now = new Date();
  const weather = Array.from({ length: 7 }).map((_, i) => ({
    timestamp: new Date(now.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
    temperatureC: 16 + Math.round(Math.sin(i) * 5),
  }));

  const response = {
    city: {
      name: q,
      country: 'FR',
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    weather,
    events: [
      { id: 'e1', title: 'City Walking Tour', startsAt: now.toISOString() },
      { id: 'e2', title: 'Local Market', startsAt: new Date(now.getTime() + 3 * 3600000).toISOString() },
    ],
    pois: [
      { id: 'p1', name: 'Central Park', coordinates: { lat: 48.86, lng: 2.35 } },
      { id: 'p2', name: 'Museum of Art', coordinates: { lat: 48.85, lng: 2.33 } },
    ],
    photos: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
      'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba',
    ],
  };

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).json(response);
}



