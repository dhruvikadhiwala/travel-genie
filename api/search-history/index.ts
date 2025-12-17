import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ 
      error: 'Supabase configuration missing' 
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    if (req.method === 'GET') {
      // GET endpoint: Get search history from external API (OpenTripMap/Nominatim)
      // and combine with database records
      const userId = req.query.userId as string | undefined
      const limit = parseInt(req.query.limit as string) || 10

      if (!userId) {
        return res.status(400).json({ error: 'userId required' })
      }

      // Get user's search history from database
      const { data: dbHistory, error: dbError } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (dbError) {
        return res.status(500).json({ error: dbError.message })
      }

      // Enrich with data from external geocoding API (manipulate data)
      const enrichedHistory = await Promise.all(
        (dbHistory || []).map(async (search) => {
          // Get additional city data from Nominatim API
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search.city)}&format=json&limit=1`,
              {
                headers: {
                  'User-Agent': 'TravelGenie/1.0'
                }
              }
            )
            const nominatimData = await response.json()
            
            if (nominatimData && nominatimData.length > 0) {
              return {
                ...search,
                // Enrich with additional data from external API
                enriched: {
                  display_name: nominatimData[0].display_name,
                  place_rank: nominatimData[0].place_rank,
                  importance: nominatimData[0].importance,
                }
              }
            }
          } catch (error) {
            console.error('Error enriching search:', error)
          }
          
          return search
        })
      )

      return res.status(200).json(enrichedHistory)
    }

    if (req.method === 'POST') {
      // POST endpoint: Save search to database
      const { user_id, query, city, country, lat, lon } = req.body

      if (!user_id || !query || !city || !country || lat === undefined || lon === undefined) {
        return res.status(400).json({ 
          error: 'Missing required fields: user_id, query, city, country, lat, lon' 
        })
      }

      const { data, error } = await supabase
        .from('search_history')
        .insert({
          user_id,
          query,
          city,
          country,
          lat,
          lon,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        return res.status(500).json({ error: error.message })
      }

      return res.status(201).json(data)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error: any) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    })
  }
}

